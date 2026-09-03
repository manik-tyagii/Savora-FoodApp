const GEMINI_MODEL = "gemini-2.5-flash";

const createFallbackAnswer = (message, restaurants = [], history = []) => {
  const text = String(message).toLowerCase();
  const previousNames = new Set(
    history
      .filter((item) => item?.role === "assistant")
      .flatMap((item) =>
        restaurants
          .map((restaurant) => restaurant.name)
          .filter(
            (name) =>
              name &&
              String(item.text || "")
                .toLowerCase()
                .includes(name.toLowerCase()),
          ),
      ),
  );
  const wantsAnother = /(another|different|other|else|more option)/.test(text);
  const intents = [
    ["hotpot", ["hotpot", "hot pot", "asian"]],
    ["pizza", ["pizza", "italian"]],
    ["burger", ["burger", "fast food"]],
    ["spicy", ["spicy", "indian", "biryani", "curry", "mexican"]],
    ["healthy", ["healthy", "salad", "vegetarian", "veg", "fresh"]],
    ["sweet", ["sweet", "dessert", "ice cream", "bakery"]],
  ];
  const intent = intents.find(([, tokens]) =>
    tokens.some((token) => text.includes(token)),
  );
  const repeatedPrompt = history.some(
    (item) =>
      item?.role === "user" &&
      String(item.text || "")
        .trim()
        .toLowerCase() === text,
  );

  const ranked = restaurants
    .map((restaurant) => {
      const searchable =
        `${restaurant.name} ${(restaurant.cuisines || []).join(" ")}`.toLowerCase();
      const matchesIntent = intent?.[1].some((token) =>
        searchable.includes(token),
      );
      let score = Number(restaurant.rating || 0) * 10;
      if (intent) score += matchesIntent ? 150 : -30;
      if (
        (wantsAnother || repeatedPrompt) &&
        previousNames.has(restaurant.name)
      ) {
        score -= 200;
      }
      return { restaurant, score, matchesIntent };
    })
    .sort((left, right) => right.score - left.score);
  const candidate =
    ranked.find(
      (item) =>
        !(
          (wantsAnother || repeatedPrompt) &&
          previousNames.has(item.restaurant.name)
        ),
    ) || ranked[0];
  const selected = candidate?.restaurant;

  if (!selected?.name)
    return "I could not load the restaurant list yet. Please try again in a moment.";

  const cuisine =
    Array.isArray(selected.cuisines) && selected.cuisines.length
      ? ` (${selected.cuisines.slice(0, 2).join(" and ")})`
      : "";
  const rating = selected.rating
    ? ` with a ${Number(selected.rating).toFixed(1)}-star rating`
    : "";

  return `${wantsAnother || repeatedPrompt ? "Another option is" : "I recommend"} ${selected.name}${cuisine}${rating}.`;
};

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
      console.error("GEMINI_API_KEY is missing; using local chatbot fallback.");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: createFallbackAnswer(message, restaurantContext, history),
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
     * Keep restaurant data reasonably small.
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
                  text: "You are Savora AI, a precise food recommendation assistant. Follow the latest customer request first. For a specific cuisine or dish such as hotpot, pizza, burger, biryani, Indian, Chinese, healthy, dessert, or spicy, recommend only a restaurant whose name or cuisine directly matches it. Never choose a cafe or the highest-rated restaurant just because it has the best rating. Treat words like today, order, dinner, and food as context, not cuisine. Use only restaurants in the provided list, do not invent names, and be honest when there is no exact match. For broad requests, use rating and area as tie-breakers. If the customer asks for another option, avoid restaurants already recommended in the recent conversation. Reply in 1 or 2 short sentences with the restaurant name, matching cuisine, and rating when available. Never claim to place an order.",
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

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: createFallbackAnswer(message, restaurantContext, history),
        }),
      };
    }

    let geminiData;

    try {
      geminiData = JSON.parse(responseText);
    } catch {
      console.error("Gemini returned invalid JSON:", responseText);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: createFallbackAnswer(message, restaurantContext, history),
        }),
      };
    }

    const answer = geminiData?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join(" ")
      .trim();

    if (!answer) {
      console.error(
        "No answer found in Gemini response:",
        JSON.stringify(geminiData),
      );

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: createFallbackAnswer(message, restaurantContext, history),
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
