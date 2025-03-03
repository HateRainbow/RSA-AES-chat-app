import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let users = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`user joined ${socket.id}`);

    socket.on("join-room", ({ room, name, surname, rsaPublicKey }) => {
      socket.join(room);
      console.log(`User ${name} ${surname} has joined room ${room}`);
      users.push({ id: socket.id, name, surname, room, rsaPublicKey });
      socket.to(room).emit("user-joined", {
        message: `${name} ${surname} joined the room`,
        rsaPublicKey,
        id: socket.id,
      });
    });

    socket.on(
      "message",
      ({ avatar, encryptedMessage, encryptedAesKey, iv, id }) => {
        console.log("The message:", encryptedMessage);

        socket.to(id).emit("message", {
          avatar,
          encryptedMessage,
          encryptedAesKey,
          iv,
        });
      }
    );

    socket.on("disconnect", () => {
      const isUserDisconnected = users.find((user) => user.id === socket.id);

      if (isUserDisconnected) {
        socket.to(isUserDisconnected.room).emit("user-left", {
          message: {
            message: `User ${isUserDisconnected.name} ${isUserDisconnected.surname} has left`,
            variant: "system",
          },
          id: socket.id,
        });

        users = users.filter((user) => user.id !== isUserDisconnected.id);
      }
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
