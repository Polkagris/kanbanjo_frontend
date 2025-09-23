"use client";
import { Button } from "@/components/ui/button";
import { createBoard } from "../queries/createBoard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export const CreateBoardButton = () => {
  /*   if (!isAuthenticated) {
    return <div>Log in to create a new board</div>;
  } */
  const { isAuthenticated, refreshUser, user, roles, loading } = useAuth();

  console.log("isAuthenticated i CreateButton:", isAuthenticated);
  console.log("user i CreateButton:", user);

  /*   useEffect(() => {
    refreshUser();
  }, []); */
  {
    /* <Button onClick={() => createBoard("Arnes best board 2025")}>
          Create new board
        </Button> */
  }
  return (
    <div>
      {isAuthenticated ? (
        <Button onClick={() => redirect("/board")}>Create new board</Button>
      ) : (
        <div>Log in to create a new board</div>
      )}
    </div>
  );
};
