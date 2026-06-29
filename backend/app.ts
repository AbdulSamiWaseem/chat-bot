import express from "express";
import cors from "cors";
import chatRoutes from "./src/routes/chat";

const app = express();

app.use(
  cors()
);
app.use(express.json());
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "chat-bot backend is running",
  });
});

export default app;
