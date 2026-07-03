"use client";

import { Box, Button, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useAuth } from "@/app/services/useAuth";
import { authClient } from "@/app/services/auth-client";
import { useRouter } from "next/navigation";
import { useChatHistory } from "@/app/services/queries";

export default function Sidebar() {
  const { signOut } = useAuth();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { data: history } = useChatHistory(session?.user?.id);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Box sx={{ width: 250, bgcolor: "black", color: "white", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h6" sx={{ borderBottom: "1px solid white", width: "100%", padding: "16px 0px 16px 16px" }}>
          Chat Bot
        </Typography>

        {session && (
          <Box sx={{ p: 2, borderBottom: "1px solid gray" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push("/")}
              sx={{ textTransform: "none", borderColor: "gray", color: "white" }}
            >
              New Chat
            </Button>
          </Box>
        )}

        <List sx={{ width: "100%", overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          {history?.map((chat: any) => (
            <ListItem key={chat.id}>
              <ListItemButton onClick={() => router.push(`/?chatId=${chat.id}`)}>
                <ListItemText primary={chat.chatName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {!session && <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", color: "#9c9c9c", fontStyle: "italic" }}>
        <Typography>Login to save history</Typography>
      </Box>}

      <Box sx={{ borderTop: "1px solid #333", width: "100%", display: "flex", justifyContent: "center", pt: 2, mb: 2 }}>
        {session ? (
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
}
