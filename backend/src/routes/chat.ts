import { Router } from "express";
import { chat, history } from "../controllers/chat";

const router = Router();

router.post("/", chat);
router.get("/history", history);

export default router;
