import { useEffect, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";

const quickPrompts = [
  "Suggest a dinner for me",
  "What should I order today?",
  "Find something spicy",
];

const buildLocalFallbackAnswer = (message, restaurantContext = []) => {
  const restaurants = Array.isArray(restaurantContext) ? restaurantContext : [];
  const text = (message || "").toLowerCase();

  const keywordBias = [
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
    ["dinner", "dinner"],
    ["lunch", "lunch"],
    ["breakfast", "breakfast"],
  ].find(([keyword]) => text.includes(keyword));

  const scored = restaurants
    .map((restaurant) => {
      const cuisines = (restaurant?.cuisines || []).map((cuisine) =>
        String(cuisine).toLowerCase(),
      );
      const name = String(restaurant?.name || "").toLowerCase();
      const rating = Number(restaurant?.rating || 0);

      let score = rating * 10;

      if (keywordBias) {
        const matchTarget = keywordBias[1].toLowerCase();
        if (cuisines.some((cuisine) => cuisine.includes(matchTarget))) {
          score += 100;
        }
        if (name.includes(matchTarget)) {
          score += 25;
        }
      }

      if (
        text.includes("dinner") &&
        cuisines.some((cuisine) =>
          /(indian|north|biryani|pizza|burger)/.test(cuisine),
        )
      ) {
        score += 20;
      }
      if (
        text.includes("healthy") &&
        cuisines.some((cuisine) =>
          /(healthy|salad|veg|vegetarian)/.test(cuisine),
        )
      ) {
        score += 20;
      }
      if (
        text.includes("order today") &&
        cuisines.some((cuisine) =>
          /(pizza|burger|biryani|cafe|coffee)/.test(cuisine),
        )
      ) {
        score += 15;
      }

      return { ...restaurant, score };
    })
    .sort((a, b) => b.score - a.score);

  const fallbackIndex =
    Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    Math.max(scored.length, 1);
  const candidate = scored[fallbackIndex] || scored[0] || restaurants[0];

  if (!candidate?.name) {
    return "I’d suggest trying a popular local favorite nearby—start with a comfort meal and pick based on your mood.";
  }

  const ratingText = candidate?.rating
    ? ` with a ${Number(candidate.rating).toFixed(1)}-star rating`
    : "";
  const cuisineText = candidate?.cuisines?.length
    ? `, especially ${candidate.cuisines.slice(0, 2).join(" or ")}`
    : "";

  const intentText = text.includes("spicy")
    ? "for a spicy craving"
    : text.includes("healthy") || text.includes("veg")
      ? "for a lighter option"
      : text.includes("sweet") || text.includes("dessert")
        ? "for something sweet"
        : text.includes("pizza") || text.includes("burger")
          ? "for a comfort-food fix"
          : text.includes("dinner")
            ? "for dinner"
            : text.includes("order today")
              ? "for today’s order"
              : "for your craving";

  return `I’d recommend ${candidate.name}${ratingText}${cuisineText}. It’s a great fit ${intentText} and a reliable choice from the nearby options.`;
};

const isLocalDevelopment =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantContext, setRestaurantContext] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I am Savora AI. Tell me what you are craving, and I will help you find something delicious.",
    },
  ]);

  useEffect(() => {
    fetch("/mock/restaurants.json")
      .then((response) => response.json())
      .then((restaurants) => {
        setRestaurantContext(
          (restaurants || []).slice(0, 30).map((restaurant) => ({
            name: restaurant?.info?.name,
            rating: restaurant?.info?.avgRating,
            cuisines: restaurant?.info?.cuisines,
            area: restaurant?.info?.areaName,
          })),
        );
      })
      .catch(() => setRestaurantContext([]));
  }, []);

  const sendMessage = async (messageText = input) => {
    const prompt = messageText.trim();
    if (!prompt || isLoading) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", text: prompt }]);
    setIsLoading(true);

    if (isLocalDevelopment) {
      const fallbackAnswer = buildLocalFallbackAnswer(
        prompt,
        restaurantContext,
      );
      setMessages((current) => [
        ...current,
        { role: "assistant", text: fallbackAnswer },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      let response;
      let data = {};

      try {
        response = await fetch("/.netlify/functions/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt, restaurantContext }),
        });

        const responseText = await response.text();
        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch {
            throw new Error("The chat server returned an invalid response.");
          }
        }
      } catch (fetchError) {
        response = null;
        data = {};

        if (
          fetchError instanceof Error &&
          fetchError.message.includes("Failed to fetch")
        ) {
          const fallbackAnswer = buildLocalFallbackAnswer(
            prompt,
            restaurantContext,
          );
          setMessages((current) => [
            ...current,
            { role: "assistant", text: fallbackAnswer },
          ]);
          return;
        }

        throw fetchError;
      }

      if (!response?.ok) {
        if (response?.status === 404 || response?.status === 500) {
          const fallbackAnswer = buildLocalFallbackAnswer(
            prompt,
            restaurantContext,
          );
          setMessages((current) => [
            ...current,
            { role: "assistant", text: fallbackAnswer },
          ]);
          return;
        }

        throw new Error(
          data?.error?.message ||
            data?.error ||
            "Gemini could not answer right now.",
        );
      }

      const answer = data?.answer;

      if (!answer) {
        const fallbackAnswer = buildLocalFallbackAnswer(
          prompt,
          restaurantContext,
        );
        setMessages((current) => [
          ...current,
          { role: "assistant", text: fallbackAnswer },
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: answer },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="savora-chatbot">
      {isOpen && (
        <section className="chat-panel" aria-label="Savora AI chat">
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-icon">
                <Bot size={18} />
              </span>
              <span>
                <strong>Savora AI</strong>
                <small>Your tasty co-pilot</small>
              </span>
            </div>
            <button
              type="button"
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant chat-thinking">
                Savora AI is thinking...
              </div>
            )}
          </div>

          <div className="chat-prompts">
            {quickPrompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
              >
                <Sparkles size={12} /> {prompt}
              </button>
            ))}
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about food..."
              aria-label="Ask Savora AI"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close Savora AI" : "Open Savora AI"}
      >
        <span className="chat-launcher-icon">
          {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </span>
        {!isOpen && (
          <>
            <span>Ask Savora</span>
          </>
        )}
      </button>
    </div>
  );
}

export default Chatbot;
