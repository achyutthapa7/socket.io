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

io.on("connection", (socket: Socket) => {
  console.log("New client connected", socket.id);
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
    // console.log("unlike-blog:", res);
    io.emit("unlike-blog", res);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = 5002;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
