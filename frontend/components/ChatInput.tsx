import { Box, Paper, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInput({ inputValue, setInputValue, onSend, isPending }: { inputValue: string, setInputValue: any, onSend: any, isPending?: boolean }) {
  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ display: "flex", alignItems: "center", p: 1, border: "1px solid gray" }}>
        <TextField
          fullWidth
          placeholder="Send a message..."
          variant="standard"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isPending}
        />
        <IconButton color="primary" onClick={onSend} disabled={isPending}>
          {isPending ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
}
