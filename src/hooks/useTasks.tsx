import * as React from "react";
import { Task, TaskStatus, User } from "../types";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { DraftTask } from "./useDraftTask";

import {
  AddTaskMutation,
  AddTaskMutationVariables,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
} from "../graphql-types";
import { loader } from "graphql.macro";

const queries = {
  getAllTasks: loader("../realm/operations/GetAllTasks.graphql"),
};

const mutations = {
  addTask: loader("../realm/operations/AddTask.graphql"),
  updateTask: loader("../realm/operations/UpdateTask.graphql"),
  deleteTask: loader("../realm/operations/DeleteTask.graphql"),
};

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
  const [tasks, setTasks] = React.useState<Array<Task>>([]);
  const { loading, error, data } = useQuery(queries.getAllTasks);
  // Wait for the query to finish loading and update state with the returned tasks
  React.useEffect(() => {
    if (!loading && data?.tasks) {
      setTasks(data.tasks);
    }
  }, [loading, data]);
  // Throw if there's an error
  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Define task mutations
  const [addTask] = useMutation<AddTaskMutation, AddTaskMutationVariables>(
    mutations.addTask
  );
  
  const [updateTask] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(mutations.updateTask);

  const [deleteTask] = useMutation<
    DeleteTaskMutation,
    DeleteTaskMutationVariables
  >(mutations.deleteTask);

  const actions: TaskActions = {
    addTask: async (draft: DraftTask) => {
      const variables = {
        task: {
          status: String(draft.status),
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
          status: updated.status ? String(updated.status) : undefined,
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
