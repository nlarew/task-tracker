import * as React from "react";
import styled from "@emotion/styled";
import { TaskLists } from "./TaskLists";
import { useTasks } from "../hooks/useTasks";

const Board: React.FC = () => {
  const { tasks, loading, actions: taskActions } = useTasks();
  return (
    <TaskBoard>
      {!loading && (
        <TaskLists tasks={tasks} taskActions={taskActions} />
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
