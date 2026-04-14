"use client";

import { useState, useEffect, useRef } from "react";
import { Chat, Message, ChatSummary } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Check, Archive, Trash2, MoreVertical, Search } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminChatsPage() {
  const { admin } = useAdminAuth();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "waiting" | "closed">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all chats
  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Poll for new chats
  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Load selected chat
  const loadChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedChat(data.chat);
        setMessages(data.chat.messages || []);
        
        // Mark messages as read
        await fetch(`/api/chats/${chatId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
          body: JSON.stringify({ action: "mark-read", userType: "admin" }),
        });
        
        fetchChats(); // Refresh unread counts
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat || !admin) return;

    try {
      const response = await fetch(`/api/chats/${selectedChat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          senderType: "admin",
          senderId: admin?.username || "admin",
          senderName: admin?.username || "Support Agent",
          content: inputMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setInputMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateChatStatus = async (chatId: string, status: "active" | "closed" | "waiting") => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchChats();
        if (selectedChat?.id === chatId) {
          setSelectedChat((prev) => prev ? { ...prev, status } : null);
        }
      }
    } catch (error) {
      console.error("Error updating chat status:", error);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (response.ok) {
        fetchChats();
        if (selectedChat?.id === chatId) {
          setSelectedChat(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (filter !== "all" && chat.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        chat.userName.toLowerCase().includes(query) ||
        chat.subject?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "waiting":
        return <Badge variant="secondary">Waiting</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Live Chat Support</h1>
        <p className="text-muted-foreground">Manage customer conversations in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "active", "waiting", "closed"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f as any)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto h-[calc(100%-120px)]">
            <div className="divide-y">
              {filteredChats.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No chats found</p>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => loadChat(chat.id)}
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                      selectedChat?.id === chat.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{chat.userName}</span>
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {chat.subject && (
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.subject}
                          </p>
                        )}
                        {chat.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {chat.lastMessage}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusBadge(chat.status)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(chat.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedChat ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedChat.userName}</CardTitle>
                    {selectedChat.userEmail && (
                      <p className="text-sm text-muted-foreground">{selectedChat.userEmail}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedChat.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateChatStatus(selectedChat.id, "active")}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateChatStatus(selectedChat.id, "closed")}>
                          <Archive className="h-4 w-4 mr-2" />
                          Close Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteChat(selectedChat.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderType === "admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.senderType === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-xs font-medium mb-1">{message.senderName}</p>
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
