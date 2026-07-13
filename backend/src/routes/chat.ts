import { Router } from "express";
import { chat, history, chatById } from "../controllers/chat";

const router = Router();

router.post("/", chat);
router.get("/history", history);
router.get("/:id", chatById);

export default router;
