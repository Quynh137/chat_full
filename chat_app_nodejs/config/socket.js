const { Server } = require("socket.io");
const messagesServices = require("../services/messagesServices");
const express = require("express");
const http = require("http");
const cors = require("cors");
const corsConfig = require("../config/cors");
const SOCKET_PORT = process.env.SOCKET_PORT;

const socketApp = express();

// Cors Config
socketApp.use(cors(corsConfig));

// Http Server
const socketServer = http.createServer(socketApp);

const connectSocket = () => {
  // Create Socket server
  const io = new Server(socketServer, { cors: corsConfig });

  // Socket connection
  io.on("connection", (socket) => {
    socket.on("chat-message", (data) => {
      messagesServices.chats(socket, data);
    });
  });
};

// Socket connection port
socketServer.listen(SOCKET_PORT);

module.exports = connectSocket;
