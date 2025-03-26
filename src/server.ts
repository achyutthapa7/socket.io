import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

interface IBlog {
  _id: string;
  userId: string;
  title: string;
  content: string;
  likes: string[];
  comments: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IComment {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  postedBlogId: string;
  commentText: string;
  createdAt?: Date;
  updatedAt?: Date;
}
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

const onlineUsers = new Map<string, string>();
io.on("connection", (socket: Socket) => {
  socket.on("join", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers);
    console.log(`User ${userId} added with socket ${socket.id}`);
  });

  socket.on("new-blog", (blog: IBlog) => {
    io.emit("new-blog", blog);
  });

  socket.on("add-comment", (comment: IComment) => {
    io.emit("add-comment", comment);
  });

  socket.on("delete-comment", (res) => {
    io.emit("delete-comment", res.payload);
  });

  socket.on("like-blog", (res) => {
    io.emit("like-blog", res);
  });
  socket.on("unlike-blog", (res) => {
    io.emit("unlike-blog", res);
  });

  socket.on("notification", (notification) => {
    if (!notification) return;
    const { receiverId } = notification;
    if (!receiverId || !receiverId._id) {
      console.log("Receiver ID is missing in the notification.");
      return;
    }
    const receiverSocketId = onlineUsers.get(receiverId._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", notification);
      console.log(`Notification sent to ${receiverId._id}`);
    } else {
      console.log(
        `User ${receiverId._id} is offline. Cannot send notification.`
      );
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = 5002;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
