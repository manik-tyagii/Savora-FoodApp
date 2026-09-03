import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";

const quickPrompts = [
  "Suggest a dinner for me",
  "What should I order today?",
  "Find something spicy",
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantContext, setRestaurantContext] = useState([]);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I am Savora AI. Tell me what you are craving, and I will help you find something delicious.",
    },
  ]);

  // --------------------------------------------------
  // Load restaurants
  // --------------------------------------------------
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await fetch("/mock/restaurants.json");

        if (!response.ok) {
          throw new Error("Could not load restaurant data.");
        }

        const restaurants = await response.json();

        const formatted = (restaurants || [])
          .slice(0, 30)
          .map((restaurant) => ({
            name: restaurant?.info?.name || "",

            rating: restaurant?.info?.avgRating || 0,

            cuisines: restaurant?.info?.cuisines || [],

            area: restaurant?.info?.areaName || "",
          }))
          .filter((restaurant) => restaurant.name);

        setRestaurantContext(formatted);

        console.log("Restaurants loaded:", formatted.length);
      } catch (error) {
        console.error("Restaurant loading error:", error);

        setRestaurantContext([]);
      }
    };

    loadRestaurants();
  }, []);

  useEffect(() => {
    if (!isOpen || !messagesEndRef.current) {
      return;
    }

    const container = messagesEndRef.current.parentElement;
    if (!container) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages, isOpen]);

  // --------------------------------------------------
  // Send message
  // --------------------------------------------------
  const sendMessage = async (messageText = input) => {
    const prompt = String(messageText || "").trim();

    if (!prompt || isLoading) {
      return;
    }

    const nextMessages = [
      ...messages,
      {
        role: "user",
        text: prompt,
      },
    ];

    setInput("");
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      // --------------------------------------------------
      // Call Netlify Function
      // --------------------------------------------------
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: prompt,
          restaurantContext,
          history: nextMessages.slice(-8),
        }),
      });

      // --------------------------------------------------
      // Read server response
      // --------------------------------------------------
      const responseText = await response.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        console.error("Invalid server response:", responseText);

        throw new Error("The chatbot server returned an invalid response.");
      }

      // --------------------------------------------------
      // Server error
      // --------------------------------------------------
      if (!response.ok) {
        throw new Error(
          data?.error || `Chatbot server error (${response.status})`,
        );
      }

      // --------------------------------------------------
      // No answer
      // --------------------------------------------------
      if (!data?.answer) {
        throw new Error("Gemini returned an empty answer.");
      }

      // --------------------------------------------------
      // Add AI response
      // --------------------------------------------------
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? `Sorry, ${error.message}`
              : "Sorry, something went wrong.",
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
          {/* Header */}
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

          {/* Messages */}
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {isLoading && (
              <div className="chat-message assistant chat-thinking">
                Savora AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="chat-prompts">
            {quickPrompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                disabled={isLoading}
                onClick={() => sendMessage(prompt)}
              >
                <Sparkles size={12} />
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
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
              disabled={isLoading}
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

      {/* Launcher */}
      <button
        type="button"
        className="chat-launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close Savora AI" : "Open Savora AI"}
      >
        <span className="chat-launcher-icon">
          {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </span>

        {!isOpen && <span>Ask Savora</span>}
      </button>
    </div>
  );
}

export default Chatbot;
