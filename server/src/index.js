require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Real-time Chat API is running" });
});

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// In-memory user storage (for demo only)
const usersBySocket = new Map(); // socket.id -> { username, room }

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_room", ({ username, room }) => {
    if (!username || !room) return;
    socket.join(room);
    usersBySocket.set(socket.id, { username, room });

    // Notify others in room
    socket.to(room).emit("user_joined", { username });

    // Send updated user list
    sendRoomUsers(room);
  });

  socket.on("send_message", ({ room, username, message }) => {
    if (!room || !message) return;
    const payload = {
      username,
      message,
      time: new Date().toISOString()
    };
    io.to(room).emit("receive_message", payload);
  });

  socket.on("typing", ({ room, username, isTyping }) => {
    if (!room) return;
    socket.to(room).emit("user_typing", { username, isTyping });
  });

  socket.on("disconnect", () => {
    const user = usersBySocket.get(socket.id);
    if (user) {
      const { username, room } = user;
      usersBySocket.delete(socket.id);
      socket.to(room).emit("user_left", { username });
      sendRoomUsers(room);
    }
    console.log("Client disconnected:", socket.id);
  });

  function sendRoomUsers(room) {
    const users = [];
    for (const [_, info] of usersBySocket.entries()) {
      if (info.room === room) {
        users.push(info.username);
      }
    }
    io.to(room).emit("room_users", users);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
