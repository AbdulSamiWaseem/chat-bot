import { Box, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInput({ inputValue, setInputValue, onSend }: { inputValue: any, setInputValue: any, onSend: any }) {
  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ display: "flex", alignItems: "center", p: 1, border: "1px solid gray" }}>
        <TextField
          fullWidth
          placeholder="Send a message..."
          variant="standard"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <IconButton color="primary" onClick={onSend}>
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
