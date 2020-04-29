import * as RealmWeb from "realm-web"

type ObjectID = string;
type ProjectID = ObjectID;
type UserID = ObjectID;

export type Project = {
  _id: ProjectID;
  _partition?: ProjectID;
  name: String;
  users: UserID[]
}

export type Task = {
  _id: ObjectID;
  _partition?: ProjectID;
  assignee: User | null;
  status: TaskStatus;
  description: String;
  watchers: UserID[];
}

export type User = {
  _id: UserID;
  _partition?: UserID;
  name: String;
  image: String;
  projects: ProjectID[];
}

export enum TaskStatus {
  Open,
  InProgress,
  Complete,
}
