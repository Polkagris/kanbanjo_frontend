import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "../types/types";
import { Button } from "@/components/ui/button";
import { deleteTask } from "@/app/queries/deleteTask";

interface TaskCardProps {
  task: Task;
  deleteTaskHandler: (arg: number) => void;
}

export const TaskCard = ({ task, deleteTaskHandler }: TaskCardProps) => {
  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <CardDescription>Description: {task.description}</CardDescription>
      </CardHeader>
      <CardContent>ID: {task.id}</CardContent>
      <CardFooter>
        Participants: {task.participant?.username ?? "None"}
      </CardFooter>
      <Button onClick={() => deleteTaskHandler(task.id)}>Delete</Button>
    </Card>
  );
};
