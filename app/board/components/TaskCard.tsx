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
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
  deleteTaskHandler: (arg: number) => void;
  id: string;
}

export const TaskCard = ({ task, deleteTaskHandler, id }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <Card
      className="p-2"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
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
