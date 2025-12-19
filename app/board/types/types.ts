export type Board = {
  id: number | undefined;
  name: string;
  owner: Owner;
  participants: Participant[];
  swimlanes: Swimlane[];
  taskCount: number;
  tasks: Task[];
};

export type Owner = {
  id: number;
  email: string;
  username: string;
  roles: Role[];
};

export type Participant = {
  id: number;
  email: string;
  username: string;
  roles: Role[];
};

export type Role = {
  id: number;
  name: string; // "ROLE_USER"
};

export type User = {
  id: string;
  name: string;
  roles: Role[];
  email: string;
};

export type Swimlane = {
  id: number;
  name: string;
  tasks: Task[];
};

export type Task = {
  id: number;
  name: string;
  description: string | null;
  participant: Participant | null;
  status: string | null;
  priority: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TaskDto = {
  id: number;
  name: string;
  description: string;
  status: string | null;
  priority: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  swimlaneId: number | null;
  boardId: number | null;
  participantId: number | null;
};

export type SwimlaneDto = {
  id: number;
  name: string;
  tasks: TaskDto[];
};

export type BoardDto = {
  id: number;
  name: string;
  taskCount: number;
  swimlanes: SwimlaneDto[];
};
