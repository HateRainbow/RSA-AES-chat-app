"use client";
import { socket } from "@/lib/socketClient";

import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import { useState, useEffect } from "react";

export default function page() {
  const [messages, setMessages] = useState<string | null>("");

  useEffect(() => {}, []);
  const user = localStorage.getItem("avatar");
  return (
    <div className="flex justify-center items-center h-screen">
      <h1>Room ID {room_id} </h1>
      <div className="flex w-screen h-screen">
        {/* // Wrap with ChatMessageList */}
        <ChatMessageList>
          {/* // You can map over messages here */}
          <ChatBubble variant="sent">
            <ChatBubbleAvatar fallback={user ? user : "US"} />
            <ChatBubbleMessage variant="sent">
              Hello, how has your day been? I hope you are doing well.
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="AI" />
            <ChatBubbleMessage variant="received">
              Hi, I am doing well, thank you for asking. How can I help you
              today?
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="AI" />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        </ChatMessageList>
      </div>
      <div className="absolute bottom-0 w-screen items-end p-2">
        <form className="relative w-full justify-end rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1">
          <ChatInput
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Mic className="size-4 lg:size-10" />
              <span className="sr-only">Use Microphone</span>
            </Button>
            <Button size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
