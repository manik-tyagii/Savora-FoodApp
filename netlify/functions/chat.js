export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { message, restaurantContext = [] } = await request.json();
    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey =
      process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const modelsData = await modelsResponse.json();
    const model = (modelsData.models || []).find((entry) =>
      entry.supportedGenerationMethods?.includes("generateContent"),
    );

    if (!model) {
      throw new Error(
        "No Gemini model supports chat replies for this API key.",
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are Savora AI, a warm food assistant. Recommend only from the provided restaurant list when possible. Keep replies under 100 words, mention ratings when useful, and never claim to place an order.",
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Available restaurants:\n${JSON.stringify(restaurantContext)}\n\nCustomer request: ${message}`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data?.error?.message || "Gemini could not answer right now.",
      );
    }

    const answer = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join(" ");

    if (!answer) throw new Error("Gemini returned an empty reply.");

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
