import { Box, Typography } from "@mui/material";

export default function Sidebar() {
  return (
    <Box sx={{ width: 250, bgcolor: "black", color: "white", p: 2, height: "100%" }}>
      <Typography variant="h6">Chat Bot</Typography>
    </Box>
  );
}
