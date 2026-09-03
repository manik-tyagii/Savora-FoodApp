const parseJsonBody = async (response, label) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} returned an invalid response.`);
  }
};

const createFallbackAnswer = (message, restaurantContext = []) => {
  const restaurants = Array.isArray(restaurantContext) ? restaurantContext : [];
  const text = (message || "").toLowerCase();

  const cuisineMatch = [
    ["spicy", "spicy"],
    ["pizza", "pizza"],
    ["burger", "burger"],
    ["biryani", "biryani"],
    ["dessert", "dessert"],
    ["veg", "vegetarian"],
    ["healthy", "healthy"],
    ["south", "South Indian"],
    ["north", "North Indian"],
    ["chinese", "Chinese"],
    ["momos", "momos"],
    ["coffee", "coffee"],
    ["sweet", "sweet"],
  ].find(([keyword]) => text.includes(keyword));

  const filtered = restaurants.filter((restaurant) => {
    const cuisines = (restaurant?.cuisines || []).join(" ").toLowerCase();
    if (!cuisineMatch) return true;
    return cuisines.includes(cuisineMatch[1].toLowerCase());
  });

  const candidate =
    filtered.length > 0
      ? filtered.reduce((best, current) => {
          const bestRating = Number(best?.rating || 0);
          const currentRating = Number(current?.rating || 0);
          return currentRating > bestRating ? current : best;
        })
      : restaurants.reduce((best, current) => {
          const bestRating = Number(best?.rating || 0);
          const currentRating = Number(current?.rating || 0);
          return currentRating > bestRating ? current : best;
        }, restaurants[0] || {});

  if (!candidate?.name) {
    return "I’d suggest trying a popular local favorite nearby—start with a comfort meal and pick based on your mood.";
  }

  const ratingText = candidate?.rating
    ? ` with a ${Number(candidate.rating).toFixed(1)}-star rating`
    : "";
  const cuisineText = candidate?.cuisines?.length
    ? `, especially ${candidate.cuisines.slice(0, 2).join(" or ")}`
    : "";

  return `I’d recommend ${candidate.name}${ratingText}${cuisineText}. It’s a great fit for your craving and a reliable choice from the nearby options.`;
};

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Request body is invalid" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { message, restaurantContext = [] } = body;
    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          answer: createFallbackAnswer(message, restaurantContext),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    try {
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      );
      const modelsData = await parseJsonBody(
        modelsResponse,
        "Gemini model list",
      );
      const supportedModels = (modelsData.models || []).filter(
        (entry) =>
          entry.supportedGenerationMethods?.includes("generateContent") &&
          typeof entry.name === "string",
      );

      if (supportedModels.length === 0) {
        return new Response(
          JSON.stringify({
            answer: createFallbackAnswer(message, restaurantContext),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const preferredModelNames = [
        "models/gemini-3.6-flash",
        "models/gemini-3.7-flash",
        "models/gemini-3.5-flash",
        "models/gemini-flash-latest",
        "models/gemini-flash-lite-latest",
        "models/gemini-2.5-flash",
        "models/gemini-2.5-flash-lite",
      ];

      const modelNames = [
        ...new Set(
          preferredModelNames.filter((name) =>
            supportedModels.some((model) => model.name === name),
          ),
        ),
      ];

      const fallbackModelNames = supportedModels
        .map((model) => model.name)
        .filter((name) => !modelNames.includes(name));

      let data;
      let lastError;

      for (const modelName of [...modelNames, ...fallbackModelNames]) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
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

        data = await parseJsonBody(response, "Gemini response");
        if (response.ok) {
          break;
        }

        lastError = new Error(
          data?.error?.message ||
            data?.error ||
            "Gemini could not answer right now.",
        );

        if (data?.error?.status !== "NOT_FOUND") {
          throw lastError;
        }
      }

      if (!data || !data.candidates) {
        return new Response(
          JSON.stringify({
            answer: createFallbackAnswer(message, restaurantContext),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const answer = data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join(" ");

      if (!answer) {
        return new Response(
          JSON.stringify({
            answer: createFallbackAnswer(message, restaurantContext),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({ answer }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(
        JSON.stringify({
          answer: createFallbackAnswer(message, restaurantContext),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
