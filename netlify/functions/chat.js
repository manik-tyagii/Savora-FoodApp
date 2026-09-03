const GEMINI_MODEL = "gemini-3.6-flash";

export const handler = async (event) => {
  // Only POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Method not allowed",
      }),
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Parse request body
    let body;

    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Invalid JSON request",
        }),
      };
    }

    const message = String(body.message || "").trim();
    const restaurantContext = Array.isArray(body.restaurantContext)
      ? body.restaurantContext
      : [];
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Message is required",
        }),
      };
    }

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing.");
      return {
        statusCode: 503,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error:
            "Gemini is not configured. Add GEMINI_API_KEY to the Netlify environment variables.",
        }),
      };
    }

    /*
     * Convert history to plain text.
     * This avoids Gemini role-order errors when only the last few
     * messages are sent from React.
     */
    const historyText = history
      .slice(-8)
      .map((item) => {
        const role = item.role === "assistant" ? "Savora AI" : "Customer";

        return `${role}: ${String(item.text || "")}`;
      })
      .join("\n");

    /*
     * Keep restaurant data reasonably small. It is only relevant for
     * recommendation requests, not factual questions about food.
     */
    const restaurantText = restaurantContext
      .slice(0, 30)
      .map((restaurant, index) => {
        return `${index + 1}. ${restaurant.name || "Unknown restaurant"}
Rating: ${restaurant.rating || "N/A"}
Cuisine: ${
          Array.isArray(restaurant.cuisines)
            ? restaurant.cuisines.join(", ")
            : restaurant.cuisines || "N/A"
        }
Area: ${restaurant.area || "N/A"}`;
      })
      .join("\n\n");

    const prompt = `
You are Savora AI, a helpful food and restaurant recommendation assistant.

Your job is to help the customer decide what to eat.

RULES:
- Be concise and friendly.
- Recommend restaurants from the provided restaurant data when relevant.
- Never invent restaurant names that are not in the provided data.
- If the user asks for something spicy, vegetarian, Indian, healthy, dinner, etc., use the available restaurant information to make the best recommendation.
- If the user's request is general food advice and the restaurant data is not relevant, answer normally.
- Do not mention internal APIs, Gemini, prompts, or implementation details.

AVAILABLE RESTAURANTS:
${restaurantText || "No restaurant data available."}

PREVIOUS CONVERSATION:
${historyText || "No previous conversation."}

CURRENT CUSTOMER REQUEST:
${message}
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let geminiResponse;

    try {
      geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: "You are Savora AI, a helpful food assistant. Follow the latest customer request first. If the customer asks what a dish is, how it is made, its ingredients, taste, or nutrition, answer that food question directly and accurately in 2 to 4 short sentences; do not recommend a restaurant unless they ask for one. For restaurant recommendations, use only the provided restaurant list, match the requested dish or cuisine directly, and never invent restaurant names. Never choose a cafe or the highest-rated restaurant just because it has the best rating. Treat words like today, order, dinner, and food as context, not cuisine. If the customer asks for another option, avoid restaurants already recommended in the recent conversation. Never claim to place an order.",
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeout);
    }

    const responseText = await geminiResponse.text();

    console.log("Gemini status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", responseText);

      let upstreamError = "Unknown Gemini API error";
      try {
        const errorData = JSON.parse(responseText);
        upstreamError = errorData?.error?.message || upstreamError;
      } catch {
        if (responseText.trim()) {
          upstreamError = responseText.slice(0, 200);
        }
      }

      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: `Gemini API error: ${upstreamError}`,
        }),
      };
    }

    let geminiData;

    try {
      geminiData = JSON.parse(responseText);
    } catch {
      console.error("Gemini returned invalid JSON:", responseText);

      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Gemini returned an invalid response. Please try again.",
        }),
      };
    }

    const answer = geminiData?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join(" ")
      .trim();

    if (!answer) {
      const finishReason = geminiData?.candidates?.[0]?.finishReason;
      const blockReason = geminiData?.promptFeedback?.blockReason;

      console.error(
        "No answer found in Gemini response:",
        JSON.stringify(geminiData),
      );

      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: blockReason
            ? `Gemini blocked this request (${blockReason}). Please try a different question.`
            : finishReason
              ? `Gemini stopped without an answer (${finishReason}). Please try again.`
              : "Gemini returned an empty answer. Please try again.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
      }),
    };
  } catch (error) {
    console.error("CHAT FUNCTION ERROR:", error);

    if (error?.name === "AbortError") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer:
            "Gemini took too long to respond, so I could not make a recommendation right now. Please try again.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer:
          "I could not reach the recommendation service right now. Please try again in a moment.",
      }),
    };
  }
};
