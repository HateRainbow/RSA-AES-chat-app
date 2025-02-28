"use client";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";

import { useState, useEffect, FormEvent } from "react";

import { useParams } from "next/navigation";

import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import Clock from "@/components/Clock";
import ConnectionStatus from "@/components/Socket";
import { socket } from "@/socket";

import { getUserData } from "@/app/utils/getLocalStorage";

type SystemMessage = {
  variant: "system";
};

type UserMessage = {
  variant: "sent" | "received";
  avatar: string;
};

// if variant system it doens't contain an avatar
export type Message = {
  message: string;
} & (UserMessage | SystemMessage);

export default function page() {
  const searchParams: any = useParams();
  const room = searchParams.id;
  const user = getUserData();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { variant: "system", message: "" },
  ]);

  useEffect(() => {
    socket.on("user_left", (message: any) => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { variant: "system", message: message },
      ]);
    });

    socket.on("user_joined", (message: string) => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { variant: "system", message: message },
      ]);
    });

    socket.on("message", (data: any) => {
      setChatMessages((prev) => [
        ...prev,
        { variant: "received", avatar: data.avatar, message: data.message },
      ]);
    });

    socket.emit("join-room", {
      room,
      name: user.name,
      surname: user.surname,
      avatar: user.avatar,
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
      socket.off("user_left");
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("message", {
      room: room,
      avatar: user.avatar,
      message: message,
    });

    setChatMessages([
      ...chatMessages,
      { avatar: user.avatar, message: message, variant: "sent" },
    ]);

    setMessage("");
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen flex-col bg-slate-400">
      <header className="md:min-h-7 sm:h-[20%]">
        <nav className="flex justify-between items-center w-screen p-3 bg-gray-800 text-white font-serif">
          <div className="font-black text-base md:text-lg">
            <span>Chat room {room}</span>
          </div>
          <div className="flex-grow text-lg text-center">
            <ConnectionStatus />
          </div>
          <div className="text-base md:text-2xl">
            <Clock />
          </div>
        </nav>
      </header>

      {/* Chat messages */}
      <div className="flex flex-col gap-0 w-screen flex-grow">
        {chatMessages.map((message, index) => {
          return message.variant === "system" ? (
            <p className="text-black text-center" key={index}>
              {message.message}
            </p>
          ) : (
            <ChatMessageList className="gap-y-0" key={index}>
              <ChatBubble variant={message.variant}>
                <ChatBubbleAvatar
                  fallback={
                    message.variant === "sent" ? user.avatar : message.avatar
                  }
                />
                <ChatBubbleMessage variant={message.variant}>
                  {message.message}
                </ChatBubbleMessage>
              </ChatBubble>
            </ChatMessageList>
          );
        })}
      </div>

      {/* Send message input */}
      <div className="sticky bottom-0 pb-2 w-[90%] h-[20%]">
        <form
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          onSubmit={handleSubmit}
        >
          <ChatInput
            onChange={(e) => setMessage(e.target.value)}
            name="message"
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
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
