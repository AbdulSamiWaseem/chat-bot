import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "@/app/services/useAuth";

export default function Sidebar() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <Box sx={{ width: 250, bgcolor: "black", color: "white", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "start" }}>
      <Typography variant="h6" sx={{ borderBottom: "1px solid white", width: "100%", padding: "16px 0px 16px 16px" }}>Chat Bot</Typography>
      <Button
        onClick={handleLogout}
        variant="contained"
        color="error"
        size="small"
        sx={{ textTransform: "none", m: 2 }}
      >
        Logout
      </Button>
    </Box >
  );
}
