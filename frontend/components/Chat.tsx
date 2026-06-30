import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BotIcon from "@mui/icons-material/SmartToy";

export default function Chat({ messages }: { messages: any[] }) {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, width: "100%", flex: 1, overflowY: "auto" }}>
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{ display: "flex", gap: 2, alignItems: "center", bgcolor: "#f2f2f2", p: 2, borderRadius: "10px" }}
        >
          {msg.role === "user" ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
          <Typography>{msg.content}</Typography>
        </Box>
      ))}
    </Box>
  );
}
