import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BotIcon from "@mui/icons-material/SmartToy";
import ReactMarkdown from "react-markdown";

export default function Chat({ messages }: { messages: any[] }) {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, width: "100%", flex: 1, overflowY: "auto" }}>
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{ display: "flex", gap: 2, alignItems: "start", bgcolor: "#f2f2f2", p: 2, borderRadius: "10px" }}
        >
          {msg.role === "user" ? <PersonIcon fontSize="small" sx={{ mt: 1 }} /> : <BotIcon fontSize="small" sx={{ mt: 1 }} />}
          <Box>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
