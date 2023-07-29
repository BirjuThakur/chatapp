const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");

const chatMembers = new Map();

app.use(cors({
  origin: "http://127.0.0.1:3000"
}));

app.get("/", (req, res) => {
  res.send("Welcome to the chat server");
});

const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  // Function to update chat members list and emit it to all clients
  const updateChatMembers = () => {
    io.emit("chat_members", Array.from(chatMembers.values()));
  };

  socket.on("room_join", (data) => {
    chatMembers.set(socket.id, data.name);
    updateChatMembers();
    socket.join(data.room);
    console.log(`User ${data.name} joined room ${data.room}`);
  });

  socket.on("send_message", (data) => {
    console.log("message getting", data);
    io.to(data.room).emit("recieve_message", data);
  });

  
  socket.on("disconnect", () => {
    console.log("user disconnected");
    chatMembers.delete(socket.id);
    updateChatMembers();
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});