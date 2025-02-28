import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const user = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`User has been connected: ${socket}`);
    // check for new user joining
    socket.on("join-room", ({ room, name, surname }) => {
      socket.join(room);
      console.log(`User ${name} ${surname} has joined room ${room}`);
      user.push({ id: socket.id, name: name, surname: surname, room: room });
      socket.to(room).emit("user_joined", `${name} ${surname} joined the room`);
    });

    // send message
    socket.on("message", (data) => {
      console.dir("The message:", data);
      socket.to(data.room).emit("message", {
        avatar: data.avatar,
        message: data.message,
      });
    });

    socket.on("disconnect", () => {
      const disconnectedUser = user.find((user) => user.id === socket.id);

      console.log(`User has been disconnected: ${socket.id}`);
      socket
        .to(disconnectedUser.room)
        .emit(
          "user_left",
          `User ${disconnectedUser.name} ${disconnectedUser.surname} has left`
        );

      user = user.filter((user) => user.id !== disconnectedUser.id);
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
