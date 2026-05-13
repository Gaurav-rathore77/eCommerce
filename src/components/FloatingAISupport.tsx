"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export function FloatingAISupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "👋 Hi! How can I help you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
     const res = await fetch("/api/genChat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: userMessage,
  }),
});

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] rounded-2xl border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="font-semibold">AI Support</h3>
              <p className="text-xs text-muted-foreground">
                Ask anything about our website
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 hover:bg-muted"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "bg-muted"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="rounded-2xl bg-muted p-3 text-sm">
                Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about products, orders..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
              />

              <button
                onClick={handleSend}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition hover:opacity-90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}