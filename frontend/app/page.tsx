"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import BotIcon from "@mui/icons-material/SmartToy";

export default function ChatBotUI() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello", role: "assistant" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    console.log(inputValue);
    setMessages([...messages, { id: messages.length + 1, text: inputValue, role: "user" }]);
    setInputValue("");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: 250, bgcolor: "black", color: "white", p: 2 }}>
        <Typography variant="h6">Chat Bot</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", justifyContent: "space-between" }}>
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{ display: "flex", gap: 2, alignItems: "center", bgcolor: "#f2f2f2", p: 2, borderRadius: "10px" }}
            >
              {msg.role === "user" ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
              <Typography>{msg.text}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ p: 2 }}>
          <Paper sx={{ display: "flex", alignItems: "center", p: 1, border: "1px solid gray" }}>
            <TextField
              fullWidth
              placeholder="Send a message..."
              variant="standard"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
