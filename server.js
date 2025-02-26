const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
export const PORT = 3000 || process.env.PORT;

const app = next({ dev, hostname, PORT });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User has joined ${socket.id}`);

    socket.on("join-room", ({ room, username, surname }) => {
      socket.join(username);
      console.log(`User ${username} ${surname} joined room ${room}`);
      socket.to(room).emit("user_joined", `${username} joined room`);
    });

    socket.on("disconnect", () => {
      console.log(`User has disconnected ${socket.id}`);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://${hostname}:${PORT}`);
  });
});
