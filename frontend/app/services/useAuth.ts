"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authClient } from "./auth-client";

export const useAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const signIn = async (data: any) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          setIsSubmitting(true);
        },
        onSuccess: (ctx) => {
          if (ctx.data) {
            localStorage.setItem("user", JSON.stringify(ctx.data));
          }
          toast.success("Successfully logged in");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Sign in failed");
          setIsSubmitting(false);
        },
      }
    );
  };

  const signUp = async (data: any) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onRequest: () => {
          setIsSubmitting(true);
        },
        onSuccess: (ctx) => {
          if (ctx.data) {
            localStorage.setItem("user", JSON.stringify(ctx.data));
          }
          toast.success("Successfully registered");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Sign up failed");
          setIsSubmitting(false);
        },
      }
    );
  };

  const signOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("user");
    toast.success("Successfully logged out.");
    router.push("/login");
  };

  return {
    signIn,
    signUp,
    signOut,
    isSubmitting,
  };
};
