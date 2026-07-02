"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../services/useAuth";
import { Card, CardContent, TextField, Button, Stack, Box, Typography, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authClient } from "../services/auth-client";
import Link from "next/link";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isSubmitting } = useAuth();
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      redirect("/");
    }
  }, [session]);

  const handleOnSubmit = async (data: any) => {
    await signIn(data);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5">Chat Bot</Typography>
      <Card variant="outlined" className="w-full max-w-md">
        <CardContent>
          <form onSubmit={handleSubmit(handleOnSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                placeholder="Enter your email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ py: 1, textTransform: "none" }}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <Link href="/signup">
                <Button fullWidth sx={{ textTransform: "none" }}>
                  Don't have an account? Sign Up
                </Button>
              </Link>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
