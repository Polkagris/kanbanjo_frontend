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
    console.log(
      "getBoardByOwnerId - boardData: 44444444444444444444444",
      boardData
    );

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
  // Det du vil ha er: optimistic update (oppdater UI umiddelbart), og så sync med backend.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log("DROPPED!2");
    console.log("ACTIVE2:", active);
    console.log("OVER2:", over);

    const taskId = active.data.current?.taskId as number | undefined;
    const toSwimlaneId = over?.id as number;
    const fromSwimlaneId = active.data.current?.fromSwimlane as
      | number
      | undefined;

    if (!taskId || toSwimlaneId == null) return;
    if (fromSwimlaneId == toSwimlaneId) return;

    // optimistic UI update
    setBoardData((prev) => {
      if (!prev) return prev;
      let movedTask = null;
      // find swimlane with dragged task
      const originalSwimlane = prev.swimlanes.filter((swimlane) =>
        swimlane.tasks?.find((task) => {
          return task.id == taskId;
        })
      )?.[0];

      // with more data
      const originalSwimlaneFull = prev.swimlanes.filter((swimlane) => {
        return swimlane.id == fromSwimlaneId;
      })?.[0];

      console.log(
        "🚀 ~ handleDragEnd ~ originalSwimlaneNoMovedTask: $$$$$$$$$$$",
        originalSwimlaneFull
      );
      if (!originalSwimlaneFull) return prev;

      // remove task from original swimlane
      const originalSwimlaneNoMovedTask = {
        ...originalSwimlaneFull,
        tasks: originalSwimlaneFull?.tasks?.filter((task) => task.id != taskId),
      };
      console.log(
        "🚀 ~ handleDragEnd ~ ogSwimlaneNoTask: ////////////////",
        originalSwimlaneNoMovedTask
      );

      // task that was moved
      const draggedTask = originalSwimlane?.tasks?.find(
        (task) => task.id == taskId
      );
      if (!draggedTask) return prev;
      console.log("🚀 ~ handleDragEnd ~ draggedTask: ##########", draggedTask);
      console.log(
        "🚀 ~ handleDragEnd ~ originalSwimlane: ¤¤¤¤¤¤¤¤",
        originalSwimlane
      );

      movedTask = draggedTask;
      console.log("🚀 ~ handleDragEnd ~ prev: !!!!!!!!!", prev);

      // Fjerne den fra gammel swimlane

      // Oppdatere swimlaneId på tasken
      if (!movedTask) return prev;
      movedTask = {
        ...movedTask,
        swimlaneId: toSwimlaneId,
      };
      console.log("🚀 ~ handleDragEnd ~ movedTask: ==========", movedTask);

      // get new swimlane
      const newSwimlane = prev.swimlanes.filter((swimlane) => {
        return swimlane.id == toSwimlaneId;
      })?.[0];
      console.log(
        "🚀 ~ handleDragEnd ~ newSwimlane - TO SWIMLANE ^^^^^^^^^",
        newSwimlane
      );
      if (!newSwimlane) return prev;

      // add movedTask to new swimlane without pushing, wich will mutate prev state
      const newSwimlaneWithMovedTask = {
        ...newSwimlane,
        tasks: newSwimlane.tasks.some((task) => task.id == movedTask.id)
          ? newSwimlane.tasks
          : [...(newSwimlane.tasks ?? []), movedTask],
      };
      console.log(
        "🚀 ~ handleDragEnd ~ newSwimlaneWithMovedTask: 5555555555555555",
        newSwimlaneWithMovedTask
      );

      // add task to new swimlane, remove it from old
      const boardWithUpdatedSwimlanes = prev.swimlanes.map((swimlane) => {
        if (!swimlane.id) return swimlane;
        if (swimlane.id == fromSwimlaneId) {
          return originalSwimlaneNoMovedTask;
        } else if (swimlane.id == toSwimlaneId) {
          return newSwimlaneWithMovedTask;
        } else {
          return swimlane;
        }
      });
      console.log(
        "🚀 ~ handleDragEnd ~ boardWithUpdatedSwimlanes: 777777777777777",
        boardWithUpdatedSwimlanes
      );
      console.log("PREV £$NOK:", prev);
      // return new board state
      return { ...prev, swimlanes: boardWithUpdatedSwimlanes };
    });

    // update backend, roll-back UI changes on fail
    // Promise.reject(new Error("Force rollback")).catch((error) => {
    moveTaskHandler(taskId, toSwimlaneId).catch((error) => {
      // Promise.reject(new Error("Force rollback")).catch((error) => {
      console.log("The move task query failed", error);
      setBoardData((prev) => {
        // guard
        if (!prev) return prev;
        console.log("PREV BEFORE THAT AGAIN AGIN - - - - - -", prev);
        // 1) Finn "to"-swimlane (der tasken ligger etter optimistic update)
        const toSwimlaneWithNewTask = prev.swimlanes?.find(
          (swimlane) => swimlane.id == toSwimlaneId
        );
        console.log(
          "🚀 ~ moveTaskHandler ~ toSwimlaneWithNewTask: 11111111111111",
          toSwimlaneWithNewTask
        );
        console.log("PREV BEFORE THAT AGAIN - - - - - -", prev);

        // 2) Finn tasken vi skal rulle tilbake
        let taskToRollback = toSwimlaneWithNewTask?.tasks?.find(
          (task) => task.id == taskId
        );
        console.log(
          "🚀 ~ handleDragEnd ~ taskToRollback: 222222222222222222",
          taskToRollback
        );
        console.log("PREV BEFORE THAT - - - - - -", prev);

        // 3) Fjern tasken fra "to"-swimlane
        // guard
        if (!toSwimlaneWithNewTask) return prev;

        const toSwimlaneWithoutNewTask = {
          ...toSwimlaneWithNewTask,
          tasks: toSwimlaneWithNewTask?.tasks?.filter(
            (task) => task.id != taskToRollback?.id
          ),
        };
        console.log(
          "🚀 ~ handleDragEnd ~ toSwimlaneWithoutNewTask: ????????????",
          toSwimlaneWithoutNewTask
        );

        // 4) Lag "restored" task (sett swimlaneId tilbake)
        if (!taskToRollback || fromSwimlaneId == null) return prev;
        taskToRollback = { ...taskToRollback, swimlaneId: fromSwimlaneId };

        console.log("PREV BEFORE - - - - - -", prev);

        // 5) Finn "from"-swimlane (der tasken kom fra)
        const fromSwimlane = prev.swimlanes?.find(
          (swimlane) => swimlane.id == fromSwimlaneId
        );

        if (!fromSwimlane) return prev;
        console.log("PREV AFTER - - - - - -", prev);
        console.log(
          "🚀 ~ handleDragEnd ~ fromSwimlane <<<<<<<<<<<<<:",
          fromSwimlane
        );

        // 6) Legg tasken tilbake i "from"-swimlane
        const fromSwimlaneWithOldTask = {
          ...fromSwimlane,
          tasks: fromSwimlane.tasks?.some(
            (task) => task.id == taskToRollback.id
          )
            ? fromSwimlane.tasks
            : [...(fromSwimlane.tasks ?? []), taskToRollback],
        };
        console.log(
          "🚀 ~ handleDragEnd ~ fromSwimlaneWithOldTask: ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ",
          fromSwimlaneWithOldTask
        );
        // 7) Update rolled back state
        const swimlanesWithRolledbackTask = prev.swimlanes.map((swimlane) => {
          if (!swimlane.id) return swimlane;
          // for old swimlane -> return fromSwimlaneWithOldTask
          // for new swimlane -> return toSwimlaneWithoutNewTask
          if (swimlane.id == fromSwimlaneId) {
            return fromSwimlaneWithOldTask;
          } else if (swimlane.id == toSwimlaneId) {
            return toSwimlaneWithoutNewTask;
          } else {
            return swimlane;
          }
        });
        console.log(
          "🚀 ~ handleDragEnd ~ swimlanesWithRolledbackTask: ???????????????",
          swimlanesWithRolledbackTask
        );
        return { ...prev, swimlanes: swimlanesWithRolledbackTask };
      });
    });
  };

  // get board from user
  useEffect(() => {
    getExistingBoard();
    console.log("BOARD data inside useeffect: 3333333333333333", boardData);
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
