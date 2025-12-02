import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "../types/types";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <CardDescription>Description: {task.description}</CardDescription>
      </CardHeader>
      <CardContent>ID: {task.id}</CardContent>
      <CardFooter>
        Participants: {task.participant?.username ?? "None"}
      </CardFooter>
    </Card>
  );
};
