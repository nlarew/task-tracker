/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Task, TaskStatus } from "../types";
import { uiColors } from "@leafygreen-ui/palette";

import TaskCard, { DraftTaskCard } from "./TaskCard";
import { TaskActions } from "../hooks/useTasks";
import useDraftTask from "../hooks/useDraftTask";

interface TaskListProps {
  status: TaskStatus;
  displayName: string;
  tasks: Task[];
  taskActions: TaskActions;
}
const TaskList: React.FC<TaskListProps> = ({
  status,
  displayName,
  tasks,
  taskActions,
}) => {
  const [draft, draftActions] = useDraftTask(taskActions);
  
  return (
    <Layout>
      <ListContainer>
        <ListTitle>{displayName}</ListTitle>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <TaskCard task={task} />
          </ListItem>
        ))}

        {draft && (
          <ListItem>
            <DraftTaskCard draft={draft} draftActions={draftActions} />
          </ListItem>
        )}
        {!draft && (
          <ListButton
            onClick={() =>
              draftActions.updateDraft({ status, description: "" })
            }
          >
            + Add Task
          </ListButton>
        )}
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
  :not(:last-child) {
    margin-bottom: 8px;
  }
`;
const ListItem = styled.div`
  :not(:last-child) {
    margin-bottom: 16px;
  }
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
