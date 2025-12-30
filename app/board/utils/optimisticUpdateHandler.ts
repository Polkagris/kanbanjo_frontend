import { BoardDto, TaskDto, SwimlaneDto } from "../types/types";

export const optimisticUpdateHandler = (
  prev: BoardDto,
  taskId: number,
  toSwimlaneId: number,
  fromSwimlaneId: number
) => {
  let originalSwimlane: BoardDto["swimlanes"][number] | undefined;
  let draggedTask: BoardDto["swimlanes"][number]["tasks"][number] | undefined;

  for (const swimlane of prev.swimlanes) {
    // find moved task
    const task = swimlane.tasks?.find((task: TaskDto) => task.id === taskId);
    // if moved task is found set corresponding swimlane and task
    if (task) {
      originalSwimlane = swimlane;
      draggedTask = task;
      break;
    }
  }

  if (!draggedTask || !originalSwimlane) return prev;

  // remove task from original swimlane
  const originalSwimlaneNoMovedTask = {
    ...originalSwimlane,
    tasks: originalSwimlane.tasks?.filter((task) => task.id !== taskId),
  };

  const movedTask = { ...draggedTask, swimlaneId: toSwimlaneId };

  const newSwimlane = prev.swimlanes.find(
    (swimlane: SwimlaneDto) => swimlane.id === toSwimlaneId
  );

  if (!newSwimlane) return prev;

  // add movedTask to new swimlane without pushing, wich will mutate prev state
  const newSwimlaneWithMovedTask = {
    ...newSwimlane,
    tasks: newSwimlane.tasks.some((task: TaskDto) => task.id === movedTask.id)
      ? newSwimlane.tasks
      : [...(newSwimlane.tasks ?? []), movedTask],
  };

  // add task to new swimlane, remove it from old
  const boardWithUpdatedSwimlanes = prev.swimlanes.map(
    (swimlane: SwimlaneDto) => {
      if (!swimlane.id) return swimlane;
      if (swimlane.id === fromSwimlaneId) {
        return originalSwimlaneNoMovedTask;
      } else if (swimlane.id === toSwimlaneId) {
        return newSwimlaneWithMovedTask;
      } else {
        return swimlane;
      }
    }
  );

  // return new board state
  return { ...prev, swimlanes: boardWithUpdatedSwimlanes };
};
