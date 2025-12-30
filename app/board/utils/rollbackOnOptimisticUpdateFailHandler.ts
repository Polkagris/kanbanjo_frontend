import { BoardDto, TaskDto, SwimlaneDto } from "../types/types";

export const rollbackOnOptimisticUpdateFailHandler = (
  prev: BoardDto,
  taskId: number,
  toSwimlaneId: number,
  fromSwimlaneId: number
) => {
  // Find "to"-swimlane - where task is after update
  const toSwimlaneWithNewTask = prev.swimlanes?.find(
    (swimlane) => swimlane.id == toSwimlaneId
  );

  // Find task to roll back
  let taskToRollback = toSwimlaneWithNewTask?.tasks?.find(
    (task) => task.id == taskId
  );

  // Remove task from "to"-swimlane
  if (!toSwimlaneWithNewTask) return prev;

  const toSwimlaneWithoutNewTask = {
    ...toSwimlaneWithNewTask,
    tasks: toSwimlaneWithNewTask?.tasks?.filter(
      (task) => task.id != taskToRollback?.id
    ),
  };

  // Set swimlane back to what it was
  if (!taskToRollback || fromSwimlaneId == null) return prev;
  taskToRollback = { ...taskToRollback, swimlaneId: fromSwimlaneId };

  // 5) Find from-swimlane
  const fromSwimlane = prev.swimlanes?.find(
    (swimlane) => swimlane.id == fromSwimlaneId
  );

  if (!fromSwimlane) return prev;

  // Add task back to from swimlane
  const fromSwimlaneWithOldTask = {
    ...fromSwimlane,
    tasks: fromSwimlane.tasks?.some((task) => task.id == taskToRollback.id)
      ? fromSwimlane.tasks
      : [...(fromSwimlane.tasks ?? []), taskToRollback],
  };

  // Update rollback state
  const swimlanesWithRolledbackTask = prev.swimlanes.map((swimlane) => {
    if (!swimlane.id) return swimlane;
    if (swimlane.id == fromSwimlaneId) {
      return fromSwimlaneWithOldTask;
    } else if (swimlane.id == toSwimlaneId) {
      return toSwimlaneWithoutNewTask;
    } else {
      return swimlane;
    }
  });

  return { ...prev, swimlanes: swimlanesWithRolledbackTask };
};
