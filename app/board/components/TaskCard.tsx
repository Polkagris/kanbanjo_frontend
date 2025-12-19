import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task, TaskDto } from "../types/types";
import { Button } from "@/components/ui/button";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: TaskDto;
  deleteTaskHandler: (arg: number) => void;
  id: string;
}

export const TaskCard = ({ task, deleteTaskHandler, id }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      type: "task",
      fromSwimlane: task.swimlaneId,
      taskId: task.id,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <Card className="p-2" ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners}>
        <CardHeader>
          <CardTitle>{task.name}</CardTitle>
          <CardDescription>Description: {task.description}</CardDescription>
        </CardHeader>
        <CardContent>ID: {task.id}</CardContent>
        {/*         <CardFooter>
          Participants: {task.participant?.username ?? "None"}
        </CardFooter> */}
      </div>

      <Button onClick={() => deleteTaskHandler(task.id)}>Delete</Button>
    </Card>
  );
};
