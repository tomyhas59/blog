const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Add this line to enable CORS for all routes in your Express app.

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with the origin (URL) of your frontend application.
    methods: ["GET", "POST"], // allowed HTTP methods
    credentials: true, // Enable credentials (cookies, auth headers, etc.).
  },
});

io.on("connection", (socket) => {
  console.log("User connected.");

  socket.on("sendMessage", (message) => {
    console.log("You have received a message:", message);
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected.");
  });
});

const port = 3001;
server.listen(port, () => {
  console.log(`Socket server is running on port ${port}.`);
});
