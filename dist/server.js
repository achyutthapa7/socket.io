import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://blog-post-phi-seven.vercel.app"],
    methods: ["GET", "POST"],
  })
);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://blog-post-phi-seven.vercel.app"],
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on("new-blog", (blog) => {
    socket.broadcast.emit("new-blog", blog);
  });
});
app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = 5002;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
