import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./types/socketInterface";
import type {
  RoomUserData,
  SystemMessageType,
} from "./types/types";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let users: RoomUserData[] = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on(
      "user-joined",
      ({ room, name, surname, avatar, rsaPublicKey }) => {
        socket.join(room);
        console.log(`User ${name} ${surname} joined room ${room}`);

        const newUser: RoomUserData = {
          id: socket.id,
          name,
          surname,
          avatar,
          room,
          rsaPublicKey,
        };

        users.push(newUser);

        socket.to(room).emit("user-joined-room", {
          message: {
            message: `${name} ${surname} has joined the room`,
            variant: "system",
          },
          rsaPublicKey,
          id: socket.id,
        });
      }
    );

    // send message to specific user id
    socket.on(
      "message",
      ({ room, avatar, encryptedMessage, encryptedAesKey, iv, id }) => {
        console.log(`Message received in room ${room}`);
        console.log(`Message sent: ${encryptedMessage}`);

        socket.to(id).emit("send-message", {
          avatar,
          encryptedMessage,
          encryptedAesKey,
          iv,
        });
      }
    );

    socket.on("disconnect", () => {
      const disconnectedUser = users.find((user) => user.id === socket.id);

      if (!disconnectedUser) return;

      console.log(
        `User ${disconnectedUser.name} ${disconnectedUser.surname} left room ${disconnectedUser.room}`
      );

      const systemMessage: SystemMessageType = {
        message: `User ${disconnectedUser.name} ${disconnectedUser.surname} has left`,
        variant: "system",
      };

      socket.to(disconnectedUser.room).emit("user-disconnected", {
        message: systemMessage,
        id: socket.id,
      });

      users = users.filter((user) => user.id !== socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
