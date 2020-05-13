import * as React from "react";
import { Task } from "../types";

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

const upsertTaskMutation = gql`
  mutation AddTask($task: TaskInsertInput!) {
    task: upsertOneTask(data: $task) {
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




type NewTask = {
  status: string;
  description: string;
  assignee?: { link: string };
}

export interface TaskActions {
  addTask: (draft: DraftTask) => void;
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

  const [upsertTask] = useMutation<{ task: Task }, { task: NewTask }>(upsertTaskMutation);
  const actions: TaskActions = {
    addTask: async (draft: DraftTask) => {
      const variables = {
        task: {
          status: String(draft.status),
          description: draft.description,
          assignee: draft.assignee ? { link: draft.assignee } : undefined,
        }
      }
      const result = await upsertTask({ variables })
      const task = result.data?.task as Task
      setTasks([...tasks, task])
    }
  }

  return { tasks, loading, actions }
}
