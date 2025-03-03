import { disconnectedUser, SystemMessageType } from "./types";

interface ClientToServerEvents {
  "user-joined": (data: {
    rsaPublicKey: string;
    surname: string;
    name: string;
    room: string;
    avatar: string;
  }) => void;
  message: (data: {
    room: string;
    avatar: string;
    encryptedMessage: string;
    encryptedAesKey: string;
    iv: string;
    id: string;
  }) => void;
  "user-disconnected": (data: {
    id: string;
    message: SystemMessageType;
  }) => void;
  "user-joined-room": {
    message: SystemMessageType;
    rsaPublicKey: string;
    id: string;
  };
  "send-message": (data: {
    avatar: string;
    encryptedMessage: string;
    encryptedAesKey: string;
    iv: string;
  }) => void;
}

interface ServerToClientEvents {
  "user-joined": (data: {
    message: string;
    rsaPublicKey: string;
    id: string;
  }) => void;

  message: (data: {
    avatar: string;
    encryptedAesKey: string;
    encryptedMessage: string;
    iv: string;
  }) => void;
  "user-disconnected": (data: {
    id: string;
    message: SystemMessageType;
  }) => void;
  "user-joined-room": (data: {
    message: SystemMessageType;
    rsaPublicKey: string;
    id: string;
  }) => void;
  "send-message": (data: {
    avatar: string;
    encryptedMessage: string;
    encryptedAesKey: string;
    iv: string;
  }) => void;
}

export type { ClientToServerEvents, ServerToClientEvents };
