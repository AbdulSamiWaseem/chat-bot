import { Router } from "express";
import { chat } from "../controllers/chat";

const router = Router();

router.post("/", chat);

export default router;
