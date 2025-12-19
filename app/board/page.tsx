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
import type { DragEndEvent } from "@dnd-kit/core";
import { moveTask } from "../queries/moveTask";

const NewBoard = () => {
  const { isAuthenticated, refreshUser, user, roles, loading } = useAuth();
  const [boardData, setBoardData] = useState<Board | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isDropped, setIsDropped] = useState(false);
  console.log("🚀 ~ NewBoard ~ boardData:", boardData);
  console.log("🚀 ~ NewBoard ~ user:", user);

  const createNewBoard = async (boardName: string) => {
    const boardData = await createBoard(boardName);
    setBoardData(boardData);
  };

  const getExistingBoard = async () => {
    const boardData = await getBoardByOwnerId();
    console.log("getBoardByOwnerId - boardData:", boardData);

    if (!boardData || boardData?.length == 0) {
      setBoardData(null);
      return;
    }

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

  const moveTaskHandler = async (taskId: number, swimlaneId: number) => {
    try {
      const result = await moveTask(taskId, swimlaneId);
      return result;
    } catch (error) {
      console.error("Failed to move task", error);
    }
  };
  // Det du vil ha er: optimistic update (oppdater UI umiddelbart), og så sync med backend.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log("DROPPED!2");
    console.log("ACTIVE2:", active);
    console.log("OVER2:", over);

    const taskId = active.data.current?.taskId as number | undefined;
    const toSwimlane = over?.id as number;
    const fromSwimlane = active.data.current?.fromSwimlane as
      | number
      | undefined;

    if (!taskId || toSwimlane == null) return;
    if (fromSwimlane == toSwimlane) return;

    // 1) optimistic UI update
    // setBoardData((prev) => {});
    
    if (active.data.current?.fromSwimlane != over.id) {
      moveTaskHandler(active.data.current?.taskId, over.id);
      setIsDropped(true);
    }
  //};

  // get board from user
  useEffect(() => {
    getExistingBoard();
  }, [isDropped]);

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
          moveTaskHandler={moveTaskHandler}
          handleDragEnd={handleDragEnd}
        />
      )}
    </div>
  );
};

export default NewBoard;
