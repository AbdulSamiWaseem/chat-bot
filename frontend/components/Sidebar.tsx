import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "@/app/services/useAuth";

export default function Sidebar() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <Box sx={{ width: 250, bgcolor: "black", color: "white", p: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "start" }}>
      <Typography variant="h6">Chat Bot</Typography>
      <Button
        onClick={handleLogout}
        variant="contained"
        color="error"
        size="small"
        sx={{ textTransform: "none" }}
      >
        Logout
      </Button>
    </Box>
  );
}
