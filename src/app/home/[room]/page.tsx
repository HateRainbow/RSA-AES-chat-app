"use client";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";

import { useState, useEffect, type FormEvent } from "react";
import { useParams } from "next/navigation";

import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import Clock from "@/components/Clock";
import ConnectionStatus from "@/components/Socket";
import { socket } from "@/socket";
import { getUserData } from "@/utils/getSessionStorage";

import {
  aesDecryptMessage,
  aesEncryptMessage,
  rsaDecryptAesKey,
  rsaEncryptAesKey,
} from "@/lib/encryption";

import type {
  User,
  Message,
  UserData,
  EncryptedMessage,
} from "../../../../types/types";

export default function ChatPage() {
  const params = useParams();
  const room = params.room as string;
  const { avatar, name, surname, publicKey, privateKey } = getUserData() as UserData;
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { variant: "system", message: `Welcome to room ${room}` },
  ]);

  useEffect(() => {
    socket.on("user-joined-room", ({ message, rsaPublicKey, id }) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);

      setUsers((prevUsers) => [...prevUsers, { id, rsaPublicKey }]);
    });

    // Handle incoming messages
    socket.on(
      "send-message",
      ({ avatar, encryptedAesKey, encryptedMessage, iv }) => {
        const decodedAesKey = rsaDecryptAesKey(
          encryptedAesKey,
          privateKey
        );

        const decryptedMessage = aesDecryptMessage(
          encryptedMessage,
          decodedAesKey,
          iv
        );

        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            variant: "received",
            avatar: avatar,
            message: decryptedMessage,
          },
        ]);
      }
    );

    socket.on("user-disconnected", ({ id, message }) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.emit("user-joined", {
      avatar,
      name,
      surname,
      room,
      rsaPublicKey: publicKey,
    });

    return () => {
      socket.off("user-joined");
      socket.off("message");
      socket.off("disconnect");
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message) return;

    const { encryptedMessage, iv, key }: EncryptedMessage =
      aesEncryptMessage(message);

    users.forEach((receiver) => {
      const encryptedAesKey = rsaEncryptAesKey(key, receiver.rsaPublicKey);

      socket.emit("message", {
        room,
        avatar: user.avatar,
        encryptedMessage,
        encryptedAesKey,
        iv,
        id: receiver.id,
      });
    });

    setChatMessages((prev) => [
      ...prev,
      { avatar: user.avatar, message, variant: "sent" },
    ]);

    setMessage("");
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen flex-col bg-slate-400">
      <header>
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
        {chatMessages.map((msg, index) => {
          return msg.variant === "system" ? (
            <p className="text-black text-center" key={index}>
              {msg.message}
            </p>
          ) : (
            <ChatMessageList className="gap-y-0" key={index}>
              <ChatBubble variant={msg.variant}>
                <ChatBubbleAvatar
                  fallback={msg.variant === "sent" ? user.avatar : msg.avatar}
                />
                <ChatBubbleMessage variant={msg.variant}>
                  {msg.message}
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
