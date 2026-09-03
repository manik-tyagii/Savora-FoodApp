import { useEffect, useState } from "react";
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

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, restaurantContext }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data?.error?.message || "Gemini could not answer right now.",
        );
      }

      const answer = data?.answer;

      if (!answer) throw new Error("Gemini returned an empty reply.");
      setMessages((current) => [
        ...current,
        { role: "assistant", text: answer },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error.message || "Something went wrong. Please try again.",
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
