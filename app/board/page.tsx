"use client";

import { useEffect, useState } from "react";
import { createBoard } from "../queries/createBoard";
import { getBoardByOwnerId } from "../queries/getBoardByOwnerId";
import { createTask } from "../queries/createTask";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BoardSection } from "./components/BoardSection";
import { Board } from "./types/types";
import { deleteTask } from "../queries/deleteTask";

const NewBoard = () => {
  const { isAuthenticated, refreshUser, user, roles, loading } = useAuth();
  const [boardData, setBoardData] = useState<Board | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  console.log("🚀 ~ NewBoard ~ boardData:", boardData);
  console.log("🚀 ~ NewBoard ~ user:", user);

  const createNewBoard = async (boardName: string) => {
    const boardData = await createBoard(boardName);
    setBoardData(boardData);
  };

  const getExistingBoard = async () => {
    const boardData = await getBoardByOwnerId();
    console.log("getBoardByOwnerId - boardData:", boardData);
    setBoardData(boardData[0]);
  };

  const handleCreateTask = async () => {
    try {
      await createTask(taskName, taskDescription, user?.name, boardData?.id);
      setTaskName("");
      setTaskDescription("");
      setOpenModal(false);
      await getExistingBoard();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const deleteTaskHandler = async (taskId: number) => {
    try {
      const result = await deleteTask(taskId);
      return result;
    } finally {
      await getExistingBoard();
    }
  };

  // get board from user
  useEffect(() => {
    getExistingBoard();
  }, []);

  return (
    <div>
      <div className="p-3">
        <Button onClick={() => createNewBoard("Arnes test board")}>
          Create new board
        </Button>
        <Button className="mx-2">
          <Link href="/">Back</Link>
        </Button>
      </div>

      <h1>Your existing boards</h1>
      {boardData && (
        <BoardSection
          boardData={boardData}
          handleCreateTask={handleCreateTask}
          openModal={openModal}
          setOpenModal={setOpenModal}
          setTaskDescription={setTaskDescription}
          setTaskName={setTaskName}
          taskDescription={taskDescription}
          taskName={taskName}
          deleteTaskHandler={deleteTaskHandler}
        />
      )}
    </div>
  );
};

export default NewBoard;
