"use client";

import { useEffect, useState } from "react";
import { createBoard } from "../queries/createBoard";
import { getBoardByOwnerId } from "../queries/getBoardByOwnerId";
import { createTask } from "../queries/createTask";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BoardSection } from "./components/BoardSection";
import { Board, BoardDto } from "./types/types";
import { deleteTask } from "../queries/deleteTask";
import type { DragEndEvent } from "@dnd-kit/core";
import { moveTask } from "../queries/moveTask";
import { optimisticUpdateHandler } from "./utils/optimisticUpdateHandler";
import { rollbackOnOptimisticUpdateFailHandler } from "./utils/rollbackOnOptimisticUpdateFailHandler";

const NewBoard = () => {
  const { isAuthenticated, refreshUser, user, roles, loading } = useAuth();
  const [boardData, setBoardData] = useState<BoardDto | null>(null);
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
      // throw new Error("Forced error for testing");
      const result = await moveTask(taskId, swimlaneId);
      return result;
    } catch (error) {
      console.error("Failed to move task", error);
    }
  };

  // Optimistic UI update - frontend change, then backend update
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.data.current?.taskId as number | undefined;
    const toSwimlaneId = over?.id as number;
    const fromSwimlaneId = active.data.current?.fromSwimlane as
      | number
      | undefined;

    if (taskId == null) return;
    if (toSwimlaneId == null) return;
    if (fromSwimlaneId == null) return;
    if (fromSwimlaneId == toSwimlaneId) return;

    // optimistic UI update
    setBoardData((prev) => {
      if (!prev) return prev;

      return optimisticUpdateHandler(
        prev,
        taskId,
        toSwimlaneId,
        fromSwimlaneId
      );
    });

    // update backend, roll-back UI changes on optimistic update fail
    moveTaskHandler(taskId, toSwimlaneId).catch((error) => {
      setBoardData((prev) => {
        if (!prev) return prev;

        return rollbackOnOptimisticUpdateFailHandler(
          prev,
          taskId,
          toSwimlaneId,
          fromSwimlaneId
        );
      });
    });
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
          moveTaskHandler={moveTaskHandler}
          handleDragEnd={handleDragEnd}
        />
      )}
    </div>
  );
};

export default NewBoard;
