import * as React from "react";
import styled from "@emotion/styled";
import TaskList from "./TaskList";
import { Task, TaskStatus } from "../types";
import { useRealmApp } from "../realm/RealmApp";
import useGroupBy from "../utils/useGroupBy";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
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

interface BoardProps {
  // tasks: Task[];
}

const Board: React.FC<BoardProps> = ({}) => {
  const { logOut, user } = useRealmApp();
  const { loading, error, data } = useQuery(getAllTasksQuery);

  console.log("loading?", loading, "data:", data, "error:", error);
  // const grouped = useGroupBy<Task>(data?.tasks || [], "status");
  // const lists = Object.entries(grouped).map(([id, tasks]) => ({ id, tasks }));
  const tasks = data?.tasks || [];
  const lists = {
    "Open": tasks.filter((task: Task) => TaskStatus[task.status] === TaskStatus.Open),
    "In Progress": tasks.filter(
      (task: Task) => TaskStatus[task.status] === TaskStatus.InProgress
    ),
    "Complete": tasks.filter(
      (task: Task) => TaskStatus[task.status] === TaskStatus.Complete
    ),
  };
  return (
    <TaskBoard>
      {!loading && (
        <TaskLists>
          {Object.entries(lists).map(([status, tasks]) => {
            console.log("status,tasks", status, tasks)
            return (
              <TaskList key={status} title={status} tasks={tasks} />
            )
          })}
        </TaskLists>
      )}
    </TaskBoard>
  );
};
export default Board;

const TaskBoard = styled.div`
  padding: 0 64px;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const TaskLists = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

// const ProjectTitle = styled.h1`
//   color: white;
//   /* padding: 0 24px; */
// `;
