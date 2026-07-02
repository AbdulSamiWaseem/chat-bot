"use client";

import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "@/app/services/useAuth";
import { authClient } from "@/app/services/auth-client";
import { redirect } from "next/navigation";

export default function Sidebar() {
  const { signOut } = useAuth();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Box sx={{ width: 250, bgcolor: "black", color: "white", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h6" sx={{ borderBottom: "1px solid white", width: "100%", padding: "16px 0px 16px 16px" }}>Chat Bot</Typography>
      {!session && <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", color: "#9c9c9c", fontStyle: "italic" }}>
        <Typography>Login to save history</Typography>
      </Box>}
      {session ? (
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          size="small"
          sx={{ textTransform: "none", mb: 2 }}
        >
          Logout
        </Button>
      ) : (
        <Button
          onClick={() => redirect("/login")}
          variant="contained"
          color="primary"
          size="small"
          sx={{ textTransform: "none", mb: 2 }}
        >
          Login
        </Button>
      )}
    </Box>
  );
}
