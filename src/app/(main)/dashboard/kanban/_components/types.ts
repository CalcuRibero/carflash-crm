export type TaskTeam = "open" | "in_progress" | "resolved" | "closed";

export type ColumnId = TaskTeam;

export type Column = {
  id: ColumnId;
  title: string;
};

export type TaskPriority = "High" | "Medium" | "Low";

export type TaskInsightLabel = "Attachments" | "Comments" | "Documents";

export type TaskInsight = {
  label: TaskInsightLabel;
  count: number;
};

export type TaskOwnerProfile = {
  name: string;
  tone: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  progress: number;
  owner: TaskOwnerProfile;
  team: TaskTeam;
  insights: TaskInsight[];
};

export type BoardState = Record<ColumnId, Task[]>;
