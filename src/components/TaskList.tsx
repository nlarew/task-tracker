/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Task } from "../types";
import { motion } from "framer-motion";
import useSort from "../utils/useSort";
import { uiColors } from "@leafygreen-ui/palette";

import TaskCard from "./TaskCard";

interface TaskListProps {
  title: string;
  tasks: Task[];
}
const TaskList: React.FC<TaskListProps> = ({ title, tasks }) => {
  const { sorted } = useSort(tasks, { sortBy: "status" });

  return (
    <Layout>
      <ListContainer>
        <ListTitle>{title}</ListTitle>
        {sorted.map((task, i) => {
          const isLast = i + 1 === tasks.length;
          return (
            <ListItem key={task._id}>
              <TaskCard task={task} />
            </ListItem>
          );
        })}
        <ListButton>+ Add Task</ListButton>
      </ListContainer>
    </Layout>
  );
};
export default TaskList;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 512px;
  margin: 0 8px;
`;
const ListTitle = styled.h2`
  margin: 0;
  margin-bottom: 16px;
  font-size: 32px;
  color: ${uiColors.black};
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: ${uiColors.gray.light1};
  border-radius: 4px;
`;
const ListItem = styled.div`
  margin-bottom: 16px;
`;
const ListButton = styled.button`
  padding: 8px;
  border: none;
  background: ${uiColors.white};
  background: transparent;
  border-radius: 4px;
  font-size: 16px;
  text-align: left;
  font-weight: bold;
  color: ${uiColors.gray.dark2};
  :hover {
    background: ${uiColors.gray.light2};
  }
`;
