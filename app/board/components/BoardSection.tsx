"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Board } from "../types/types";
import { DialogModal } from "./CreateTaskModal";
import { TaskCard } from "./TaskCard";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { BoardColumn } from "./BoardColumn";
import type { DragEndEvent } from "@dnd-kit/core";

interface DialogProps {
  openModal: boolean;
  setOpenModal: (arg: boolean) => void;
  taskName: string;
  setTaskName: (arg: string) => void;
  taskDescription: string;
  setTaskDescription: (arg: string) => void;
  handleCreateTask: () => void;
  deleteTaskHandler: (arg: number) => void;
}

type BoardSectionProps = DialogProps & {
  boardData: Board | null;
};

export const BoardSection = ({
  boardData,
  openModal,
  handleCreateTask,
  setOpenModal,
  setTaskDescription,
  setTaskName,
  taskDescription,
  taskName,
  deleteTaskHandler,
}: BoardSectionProps) => {
  const [isDropped, setIsDropped] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Table>
        <TableCaption>{boardData?.name ?? "No name found"}</TableCaption>
        <TableHeader>
          <TableRow>
            {boardData?.swimlanes?.map((swimlane) => {
              return (
                <TableHead key={swimlane.id} className="w-[100px]">
                  {swimlane.name}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="h-64">
            {boardData?.swimlanes.map((swimlane) => {
              return (
                <BoardColumn
                  key={swimlane.id}
                  className="border"
                  id={`swimlane-${swimlane.id}`}
                  columnId={swimlane.id}
                >
                  {swimlane.tasks?.map((task) => {
                    return (
                      <TaskCard
                        task={task}
                        key={task.id}
                        deleteTaskHandler={deleteTaskHandler}
                        id={`task-${task.id}`}
                      />
                    );
                  })}
                  {swimlane.name == "todo" && (
                    <DialogModal
                      openModal={openModal}
                      setOpenModal={setOpenModal}
                      handleCreateTask={handleCreateTask}
                      setTaskDescription={setTaskDescription}
                      setTaskName={setTaskName}
                      taskDescription={taskDescription}
                      taskName={taskName}
                    />
                  )}
                </BoardColumn>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </DndContext>
  );
};
