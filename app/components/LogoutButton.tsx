"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { redirect, useRouter } from "next/navigation";
import { logoutUser } from "../queries//logoutUser";

export const LogoutButton = () => {
  const { isAuthenticated, refreshUser, user, roles, loading } = useAuth();
  const router = useRouter();

  const logoutUserRequest = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      await refreshUser?.();
      router.push("/");
    }
  };

  return (
    <div>
      {isAuthenticated && (
        <Button onClick={() => logoutUserRequest()}>Logout</Button>
      )}
    </div>
  );
};
