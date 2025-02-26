import React, { createContext, useContext, useEffect, useState } from "react";
import "./globals.css";

type UserContextType = {
  name: string;
  username: string;
  avatar: string;
  room_id: number;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  setRoomId: React.Dispatch<React.SetStateAction<number>>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [avatar, setAvatar] = useState<string>("");
  const [room_id, setRoomID] = useState<number>(0); // Fixed to match room_id
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // Create context with proper type
  const UserContext = createContext<UserContextType>({
    avatar: "",
    name: "",
    room_id: 0, // Ensure it's room_id
    setAvatar,
    setName,
    setUsername,
    username: "",
    setRoomId: setRoomID,
  });

  const useUserContext = () => useContext(UserContext);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    const storedUsername = localStorage.getItem("user_username");
    const storedAvatar = localStorage.getItem("user_avatar");
    const storedRoomId = localStorage.getItem("user_room_id");

    if (storedName) setName(storedName);
    if (storedUsername) setUsername(storedUsername);
    if (storedAvatar) setAvatar(storedAvatar);
    if (storedRoomId) setRoomID(Number(storedRoomId)); // Fixed setter to setRoomID
  }, []);

  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <UserContext.Provider
        value={{
          name,
          username,
          avatar,
          room_id,
          setName,
          setUsername,
          setAvatar,
          setRoomId: setRoomID,
        }}
      >
        <body>{children}</body>
      </UserContext.Provider>
    </html>
  );
}
