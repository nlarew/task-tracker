import * as React from "react";
import styled from "@emotion/styled";
import TaskList from "./TaskList";
import { Task, TaskStatus } from "../types";
import { useTasks } from "../hooks/useTasks";

type TaskListDescription = {
  status: TaskStatus;
  displayName: string;
  tasks: Array<Task>;
}

function useTaskLists(tasks: Array<Task>): Array<TaskListDescription> {
  return React.useMemo(
    () => ([
      {
        status: TaskStatus.Open,
        displayName: "Open",
        tasks: tasks.filter(
          (task: Task) => TaskStatus[task.status] === TaskStatus.Open
        )
      },
      {
        status: TaskStatus.InProgress,
        displayName: "In Progress",
        tasks: tasks.filter(
          (task: Task) => TaskStatus[task.status] === TaskStatus.InProgress
        )
      },
      {
        status: TaskStatus.Complete,
        displayName: "Complete",
        tasks: tasks.filter(
          (task: Task) => TaskStatus[task.status] === TaskStatus.Complete
        )
      },
    ]),
    [tasks]
  );
}

const Board: React.FC = () => {
  const { tasks, loading, actions: taskActions } = useTasks();
  const lists = useTaskLists(tasks);

  return (
    <TaskBoard>
      {!loading && (
        <TaskLists>
          {lists.map(({ status, displayName, tasks }) => {
            return (
              <TaskList
                key={status}
                status={status}
                displayName={displayName}
                tasks={tasks}
                taskActions={taskActions}
              />
            );
          })}
        </TaskLists>
      )}
    </TaskBoard>
  );
};
export default Board;

const TaskBoard = styled.div`
  height: 100vh;
  padding: 0 64px;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const TaskLists = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
