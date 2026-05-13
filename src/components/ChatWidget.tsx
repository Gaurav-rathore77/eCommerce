"use client";

import { useState, useEffect, useRef } from "react";
import { Message, Chat } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [showForm, setShowForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const stored = localStorage.getItem("chat-user-id");

  if (stored) {
    setUserId(stored);
  } else {
    const newId = uuidv4();

    localStorage.setItem("chat-user-id", newId);

    setUserId(newId);
  }
}, []);

  // Polling for new messages
  useEffect(() => {
    if (!chat) return;

    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chats/${chat.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.chat && data.chat.messages) {
            setMessages(data.chat.messages);
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    const interval = setInterval(pollMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [chat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check for existing chat on mount
  useEffect(() => {
    const checkExistingChat = async () => {
      try {
        const response = await fetch(`/api/chats?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.chats && data.chats.length > 0) {
            const latestChat = data.chats[0];
            const chatResponse = await fetch(`/api/chats/${latestChat.id}`);
            if (chatResponse.ok) {
              const chatData = await chatResponse.json();
              setChat(chatData.chat);
              setMessages(chatData.chat.messages || []);
              setShowForm(false);
              // Polling handles message updates
            }
          }
        }
      } catch (error) {
        console.error("Error checking existing chat:", error);
      }
    };

    if (userId) {
      checkExistingChat();
    }
  }, [userId]);

  const startChat = async () => {
    if (!userName.trim()) return;

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          subject: subject || "General Support",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChat(data.chat);
        setShowForm(false);
        // Polling handles message updates
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !chat) return;

    try {
      const response = await fetch(`/api/chats/${chat.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderType: "user",
          senderId: userId,
          senderName: userName,
          content: inputMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Message sent, polling will pick it up
        setInputMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Mark messages as read when chat opens
  useEffect(() => {
    if (!chat || !isOpen) return;
    
    const markAsRead = async () => {
      try {
        await fetch(`/api/chats/${chat.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mark-read", userType: "user" }),
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markAsRead();
  }, [chat, isOpen]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed right-6 bottom-6 w-80 sm:w-96 shadow-xl z-50 transition-all duration-300 ${isMinimized ? "h-14" : "h-[500px]"}`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <CardTitle className="text-sm font-medium">Live Support</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 p-4 overflow-y-auto h-[340px]">
            {showForm ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Fill in your details to start chatting with our support team.
                </p>
                <Input
                  placeholder="Your Name *"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  placeholder="Your Email (optional)"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <Input
                  placeholder="Subject (optional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <Button onClick={startChat} className="w-full" disabled={!userName.trim()}>
                  Start Chat
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm">
                    Connecting you with a support agent...
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.senderType === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>

          {!showForm && (
            <CardFooter className="p-4 pt-0 gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button size="icon" onClick={sendMessage} disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
