import * as React from "react";
import { Task, TaskStatus, User } from "../types";

import { DraftTask } from "./useDraftTask";

import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "./../graphql-operations";

interface TaskInput {
  status?: string;
  description?: string;
  assignee?: { link: string };
}
interface UpdatedTask {
  status?: TaskStatus;
  description?: string;
  assignee?: User;
}

export interface TaskActions {
  addTask: (draft: DraftTask) => void;
  updateTask: (taskId: string, updated: UpdatedTask) => void;
  deleteTask: (task: Task) => void;
}

export function useTasks(): {
  tasks: Array<Task>;
  loading: boolean;
  actions: TaskActions;
} {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  // Query for Tasks
  const { loading, error, data } = useGetAllTasksQuery();
  React.useEffect(() => {
    // Throw if there's an error
    if (error) throw error;

    // Wait for the query to finish loading and update state with the returned tasks
    if (!loading && data?.tasks) {
      setTasks(data.tasks as Task[]);
    }
  }, [loading, error, data]);

  // Create Task Mutation Functions
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const actions: TaskActions = {
    addTask: async (draft: DraftTask) => {
      const variables = {
        task: {
          status: draft.status,
          description: draft.description,
          assignee: draft.assignee ? { link: draft.assignee } : undefined,
        },
      };
      const result = await addTask({ variables });
      const task = result.data?.task as Task;
      setTasks([...tasks, task]);
    },
    updateTask: async (taskId: string, updated: UpdatedTask) => {
      const variables = {
        taskId: taskId,
        updates: {
          status: updated?.status ?? undefined,
          description: updated?.description ?? undefined,
          assignee: updated.assignee
            ? { link: updated.assignee.user_id }
            : undefined,
        },
      };
      const isSpecifiedTask = (t: Task) => t._id === taskId;
      const currentTasks = [...tasks];
      const currentTask = currentTasks.find(isSpecifiedTask);
      if (!currentTask) {
        return;
      }
      updateTask({ variables }).catch((error) => {
        setTasks(currentTasks);
        throw error;
      });
      const updatedTask: Task = { ...currentTask, ...updated };
      setTasks([...tasks.filter((t) => !isSpecifiedTask(t)), updatedTask]);
    },
    deleteTask: (task: Task) => {
      const variables = { taskId: task._id };
      const currentTasks = [...tasks];
      deleteTask({ variables }).catch((error) => {
        setTasks(currentTasks);
        throw error;
      });
      setTasks([...tasks.filter((t) => t._id !== task._id)]);
    },
  };

  return { tasks, loading, actions };
}
