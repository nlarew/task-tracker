import * as React from "react";
import { Task, TaskStatus, User } from "../types";

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { DraftTask } from "./useDraftTask";

const getAllTasksQuery = gql`
  query GetAllTasks {
    tasks {
      _id
      description
      status
      assignee {
        _id
        name
        image
        user_id
      }
    }
  }
`;

const addTaskMutation = gql`
  mutation AddTask($task: TaskInsertInput!) {
    task: insertOneTask(data: $task) {
      _id
      description
      status
      assignee {
        _id
        name
        image
        user_id
      }
    }
  }
`;

const updateTaskMutation = gql`
  mutation UpdateTask($taskId: ObjectId!, $updates: TaskUpdateInput!) {
    task: updateOneTask(
      query: { _id: $taskId }
      set: $updates
    ) {
      _id
      description
      status
      assignee {
        _id
        name
        image
        user_id
      }
    }
  }
`;

const deleteTaskMutation = gql`
  mutation DeleteTask($taskId: ObjectId!) {
    deletedTask: deleteOneTask(query: { _id: $taskId }) {
      _id
      description
      status
      assignee {
        _id
        name
        image
        user_id
      }
    }
  }
`;

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

export function useTasks(): { tasks: Array<Task>, loading: boolean, actions: TaskActions } {
  const [tasks, setTasks] = React.useState<Array<Task>>([]);
  const { loading, error, data } = useQuery(getAllTasksQuery);
  React.useEffect(() => {
    if(!loading && data?.tasks) {
      setTasks(data.tasks)
    }
  }, [loading, data])
  React.useEffect(() => { if(error) throw error }, [error])

  const [addTask] = useMutation<{ task: Task }, { task: TaskInput }>(addTaskMutation);
  const [updateTask] = useMutation<{ task: Task }, { taskId: string, updates: TaskInput }>(updateTaskMutation);
  const [deleteTask] = useMutation<{ deletedTask: Task }, { taskId: string }>(deleteTaskMutation);

  const actions: TaskActions = {
    addTask: async (draft: DraftTask) => {
      const variables = {
        task: {
          status: String(draft.status),
          description: draft.description,
          assignee: draft.assignee ? { link: draft.assignee } : undefined,
        }
      }
      const result = await addTask({ variables })
      const task = result.data?.task as Task
      setTasks([...tasks, task])
    },
    updateTask: async (taskId: string, updated: UpdatedTask) => {
      const variables = {
        taskId: taskId,
        updates: {
          status: updated.status ? String(updated.status) : undefined,
          description: updated?.description ?? undefined,
          assignee: updated.assignee ? { link: updated.assignee.user_id } : undefined,
        }
      }
      const isSpecifiedTask = (t: Task) => t._id === taskId
      const currentTasks = [...tasks]
      const currentTask = currentTasks.find(isSpecifiedTask)
      if(!currentTask) {
        return
      }
      updateTask({ variables }).catch(error => {
        setTasks(currentTasks)
        throw error
      })
      const updatedTask: Task = { ...currentTask, ...updated }
      setTasks([...tasks.filter(t => !isSpecifiedTask(t)), updatedTask])
    },
    deleteTask: (task: Task) => {
      const variables = { taskId: task._id }
      const currentTasks = [...tasks]
      deleteTask({ variables }).catch(error => {
        setTasks(currentTasks)
        throw error
      })
      setTasks([...tasks.filter(t => t._id !== task._id)])
    },
  }

  return { tasks, loading, actions }
}
