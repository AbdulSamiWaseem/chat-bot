import express from "express";
import cors from "cors";
import chatRoutes from "./src/routes/chat";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/utils/auth";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));

app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "chat-bot backend is running",
  });
});

export default app;
