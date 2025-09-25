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
import { useEffect, useState } from "react";
import { createBoard } from "../queries/createBoard";
import { getBoardByOwnerId } from "../queries/getBoardByOwnerId";
import { createTask } from "../queries/createTask";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const NewBoard = () => {
  const { isAuthenticated, refreshUser, user, roles, loading } = useAuth();
  const [boardData, setBoardData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const createNewBoard = async (boardName) => {
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
      await createTask(taskName, taskDescription, user?.name, boardData.id);
      setTaskName("");
      setTaskDescription("");
      setOpenModal(false);
      await getExistingBoard();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  // get board from user
  useEffect(() => {
    getExistingBoard();
  }, []);

  const dialog = (
    <Dialog open={openModal}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpenModal(true)}>
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>
            Add information for this specific task
          </DialogDescription>
          <div className="flex flex-col items-center gap-2">
            <div className="flex w-full">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div className="flex w-full">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            onClick={() => handleCreateTask()}
          >
            Create
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const card = (task) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{task.name}</CardTitle>
          <CardDescription>Description: {task.description}</CardDescription>
        </CardHeader>
        <CardContent>ID: {task.id}</CardContent>
        <CardFooter>Participants: {task.participant}</CardFooter>
      </Card>
    );
  };

  const board = boardData && (
    <Table>
      <TableCaption>{boardData.name}</TableCaption>
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
                return card(task);
              })}
            </div>
            {dialog}
          </TableCell>
          <TableCell className="border"></TableCell>
          <TableCell className="border"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <div>
      <Button onClick={() => createNewBoard("Arnes test board")}>
        Create new board
      </Button>
      <h1>Your existing boards</h1>
      {board}
    </div>
  );
};

export default NewBoard;
