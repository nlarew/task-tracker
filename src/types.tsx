import * as RealmWeb from "realm-web"

type ObjectID = string;
type ProjectID = ObjectID;
type UserID = ObjectID;

export type Project = {
  _id: ProjectID;
  _partition?: ProjectID;
  name: string;
  users: UserID[]
}

export type Task = {
  _id: ObjectID;
  _partition?: ProjectID;
  assignee?: User;
  status: TaskStatus;
  description: string;
  watchers: UserID[];
}

export type User = {
  _id: UserID;
  _partition?: UserID;
  name: string;
  image?: string;
  projects: ProjectID[];
}

export enum TaskStatus {
  Open = "Open",
  InProgress = "InProgress",
  Complete = "Complete",
}
