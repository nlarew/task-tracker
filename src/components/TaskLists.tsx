/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { DragDropContext, Droppable, Draggable, DropResult, DragDropContextProps } from "react-beautiful-dnd";

import { Task, TaskStatus, statusMap } from "../types";
import TaskCard, { DraftTaskCard } from "./TaskCard";
import { TaskActions } from "../hooks/useTasks";
import useDraftTask from "../hooks/useDraftTask";
import useTaskLists from "../hooks/useTaskLists";


interface TaskListsProps {
  tasks: Task[];
  taskActions: TaskActions;
}

export function TaskLists(props: TaskListsProps): React.ReactElement {
  const { tasks, taskActions } = props;
  const { lists, actions: listActions } = useTaskLists(tasks);
  const onDragEnd = (result: DropResult) => {
    // Parse the drag and drop DropResult
    const {
      draggableId: taskId,
      destination: { droppableId: destinationStatus } = {
        droppableId: null,
      },
    } = result;
    // If there wasn't a valid drop destination, don't do anything
    if (!destinationStatus) return;
    // Manipulate the in-memory lists, preserving drag and drop order
    listActions.handleDragAndDrop(result);
    // Update the Task if it changed status
    const newStatus = statusMap.get(destinationStatus);
    if (newStatus) {
      taskActions.updateTask(taskId, {
        status: statusMap.get(newStatus),
      });
    }
  }
  return (
    <TaskListsContainer onDragEnd={onDragEnd}>
      {lists.map(({ status, displayName, tasks, displayOrder }) => {
        return (
          <TaskList
            key={status}
            status={status}
            displayName={displayName}
            tasks={
              displayOrder
                .map((id) => tasks.find((t) => t._id === id) ?? undefined)
                .filter(Boolean) as Task[]
            }
            taskActions={taskActions}
          />
        );
      })}
    </TaskListsContainer>
  );
}

const TaskListsContainer: React.FC<DragDropContextProps> = ({ onDragEnd, children }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        css={css`
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        `}
      >
        {children}
      </div>
    </DragDropContext>
  )
}


interface TaskListProps {
  status: TaskStatus;
  displayName: string;
  tasks: Task[];
  taskActions: TaskActions;
}
export default function TaskList(props: TaskListProps): React.ReactElement {
  const { status, displayName, tasks, taskActions } = props;
  const [draft, draftActions] = useDraftTask(taskActions);

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <Layout ref={provided.innerRef} {...provided.droppableProps}>
          <ListContainer>
            <ListTitle>{displayName}</ListTitle>
            {tasks.map((task, i) => (
              <DraggableListItem key={task._id} id={task._id} index={i}>
                <TaskCard task={task} />
              </DraggableListItem>
            ))}
            {provided.placeholder}
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
      )}
    </Droppable>
  );
}

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

const DraggableListItem: React.FC<{ id: any; index: number }> = ({
  id,
  index,
  children,
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {children}
        </ListItem>
      )}
    </Draggable>
  );
};

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
