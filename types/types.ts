type User = {
  id: string;
  rsaPublicKey: string;
};

type RoomUserData = {
  room: string;
  surname: string;
  name: string;
  avatar: string;
} & User;

type disconnectedUser = {
  id: string;
  message: SystemMessageType;
};

type UserData = {
  id: string;
  name: string;
  surname: string;
  avatar: string;
  publicKey: string;
  privateKey: string;
};

type MessageBase = {
  message: string;
};

type SystemMessageType = MessageBase & {
  variant: "system";
};

type UserMessageType = MessageBase & {
  variant: "sent" | "received";
  avatar: string;
};

type Message = SystemMessageType | UserMessageType;

type EncryptedMessage = {
  encryptedMessage: string;
  iv: string;
  key: string;
};

export type {
  EncryptedMessage,
  Message,
  MessageBase,
  SystemMessageType,
  User,
  UserData,
  UserMessageType,
  RoomUserData,
  disconnectedUser,
};
