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
  return (
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
          <TableCell className="border">
            <div>
              {boardData?.tasks?.map((task) => {
                return (
                  <TaskCard
                    task={task}
                    key={task.id}
                    deleteTaskHandler={deleteTaskHandler}
                  />
                );
              })}
            </div>
            <DialogModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              handleCreateTask={handleCreateTask}
              setTaskDescription={setTaskDescription}
              setTaskName={setTaskName}
              taskDescription={taskDescription}
              taskName={taskName}
            />
          </TableCell>
          <TableCell className="border"></TableCell>
          <TableCell className="border"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
