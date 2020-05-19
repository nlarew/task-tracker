/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Task, TaskStatus, ObjectID, statusMap } from "../types";
import { uiColors } from "@leafygreen-ui/palette";

import TaskCard, { DraftTaskCard } from "./TaskCard";
import { TaskActions } from "../hooks/useTasks";
import useDraftTask from "../hooks/useDraftTask";

import * as R from "ramda";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type TaskListDescription = {
  status: TaskStatus;
  displayName: string;
  tasks: Array<Task>;
  displayOrder: Array<ObjectID>;
};

function isStatus(task: Task, status: TaskStatus) {
  return task.status === status;
}

const isOpenTask = (task: Task) => isStatus(task, TaskStatus.Open);
const isInProgressTask = (task: Task) => isStatus(task, TaskStatus.InProgress);
const isCompleteTask = (task: Task) => isStatus(task, TaskStatus.Complete);

const createLists = (tasks: Array<Task>) => {
  const openTasks = tasks.filter(isOpenTask);
  const inProgressTasks = tasks.filter(isInProgressTask);
  const completeTasks = tasks.filter(isCompleteTask);

  return [
    {
      status: TaskStatus.Open,
      displayName: "Open",
      tasks: openTasks,
      displayOrder: openTasks.map((t) => t._id),
    },
    {
      status: TaskStatus.InProgress,
      displayName: "In Progress",
      tasks: inProgressTasks,
      displayOrder: inProgressTasks.map((t) => t._id),
    },
    {
      status: TaskStatus.Complete,
      displayName: "Complete",
      tasks: completeTasks,
      displayOrder: completeTasks.map((t) => t._id),
    },
  ];
};

// function useTaskLists(tasks: Task[], taskActions: TaskActions): TaskListDescription[] {
interface UseTaskListsPayload {
  lists: TaskListDescription[];
  actions: { handleDragAndDrop: (dragDropResult: DropResult) => void };
}
function useTaskLists(tasks: Task[]): UseTaskListsPayload {
  const [lists, setLists] = React.useState<TaskListDescription[]>(
    createLists(tasks)
  );

  const getListWithStatus = (status: TaskStatus) =>
    R.find<TaskListDescription>(R.propEq("status", status))(lists);

  const updateList = (status: TaskStatus, updated: TaskListDescription) => {
    setLists((prevLists: TaskListDescription[]) =>
      prevLists.map((list) => (status !== list.status ? list : updated))
    );
  };

  const addTaskToList = (
    taskId: ObjectID,
    status: TaskStatus,
    displayIndex?: number
  ) => {
    const listToUpdate = getListWithStatus(status);
    if (!listToUpdate) return;
    if (!displayIndex) displayIndex = listToUpdate.displayOrder.length;
    const updatedDisplayOrder = Array.from(
      new Set(R.insert(displayIndex, taskId, listToUpdate.displayOrder))
    );
    updateList(status, {
      ...listToUpdate,
      displayOrder: updatedDisplayOrder,
    });
  };

  const removeTaskFromList = (taskId: ObjectID, status: TaskStatus) => {
    const listToUpdate = getListWithStatus(status);
    if (!listToUpdate) return;
    const updatedDisplayOrder = Array.from(
      new Set(
        R.filter((id) => !R.equals(taskId, id), listToUpdate.displayOrder)
      )
    );
    updateList(status, {
      ...listToUpdate,
      displayOrder: updatedDisplayOrder,
    });
  };

  const moveTask = (
    taskId: ObjectID,
    oldStatus: TaskStatus,
    oldDisplayIndex: number,
    newStatus: TaskStatus,
    newDisplayIndex?: number
  ) => {
    removeTaskFromList(taskId, oldStatus);
    addTaskToList(taskId, newStatus, newDisplayIndex);
  };

  const moveTaskInColumn = (
    taskId: ObjectID,
    status: TaskStatus,
    newIndex: number
  ) => {
    const listToUpdate = getListWithStatus(status);
    if (!listToUpdate) return;
    const oldIndex = listToUpdate.displayOrder.findIndex((id) => id === taskId);
    const updatedDisplayOrder = Array.from(
      new Set(R.move(oldIndex, newIndex, listToUpdate.displayOrder))
    );
    updateList(status, {
      ...listToUpdate,
      displayOrder: updatedDisplayOrder,
    });
  };

  const previousTasksRef = React.useRef<Task[] | undefined>();
  React.useEffect(() => {
    if (previousTasksRef.current) {
      if (!previousTasksRef.current.length) {
        setLists(createLists(tasks));
      } else {
        const previousTasks = previousTasksRef.current;
        const updatedTasks = tasks;
        const isInPreviousTasks = (newTask: Task) =>
          Boolean(
            previousTasks.find((oldTask: Task) => oldTask._id === newTask._id)
          );
        const isInUpdatedTasks = (oldTask: Task) =>
          Boolean(
            updatedTasks.find((newTask: Task) => newTask._id === oldTask._id)
          );

        const newTasks = updatedTasks.filter(
          (task: Task) => !isInPreviousTasks(task)
        );
        const removedTasks = previousTasks.filter(
          (task: Task) => !isInUpdatedTasks(task)
        );
        const modifiedTasks = updatedTasks
          // New tasks and removed tasks can't be modified tasks. Filter them out.
          .filter((task: Task) => {
            const isNewTask = Boolean(
              newTasks.find((newTask: Task) => newTask._id === task._id)
            );
            const isRemovedTask = Boolean(
              removedTasks.find(
                (removedTask: Task) => removedTask._id === task._id
              )
            );
            if (isNewTask || isRemovedTask) return false;
            const isModified = Boolean(
              previousTasks.find(
                (prevTask: Task) =>
                  prevTask._id === task._id && prevTask.status !== task.status
              )
            );
            return isModified;
          });

        newTasks.forEach((newTask) => {
          addTaskToList(newTask._id, newTask.status);
        });
        removedTasks.forEach((removedTask) => {
          removeTaskFromList(removedTask._id, removedTask.status);
        });
        modifiedTasks.forEach((modifiedTask) => {
          const isThisTask = (t: Task) => t._id === modifiedTask._id;
          const oldStatus = (previousTasks.find(isThisTask) as Task).status;
          const oldIndex = (lists.find(
            (l) => l.status === oldStatus
          ) as TaskListDescription).displayOrder.findIndex(
            (id) => id === modifiedTask._id
          );
          const newStatus = modifiedTask.status;
          moveTask(modifiedTask._id, oldStatus, oldIndex, newStatus);
        });
      }
    }
    previousTasksRef.current = tasks;

    // Make sure that all tasks are assigned to a list
    setLists((lists: TaskListDescription[]) => {
      return lists.map((list) => {
        return {
          ...list,
          tasks: tasks.filter((t) => t.status === list.status),
        };
      });
    });
  }, [tasks]);

  const handleDragAndDrop = (dragDropResult: DropResult) => {
    const { draggableId, source, destination } = dragDropResult;
    if (!destination) return;

    const taskId = draggableId;
    const { droppableId: sourceStatus, index: sourceIndex } = source;
    const {
      droppableId: destinationStatus,
      index: destinationIndex,
    } = destination;

    if (sourceStatus === destinationStatus) {
      // Task did not change columns
      if (sourceIndex !== destinationIndex) {
        // Task change position within its column
        moveTaskInColumn(
          taskId,
          statusMap.get(sourceStatus) || TaskStatus.Open,
          destinationIndex
        );
      }
    } else {
      // Task was moved to a different column
      moveTask(
        taskId,
        statusMap.get(sourceStatus) || TaskStatus.Open,
        sourceIndex,
        statusMap.get(destinationStatus) || TaskStatus.Open,
        destinationIndex
      );
    }
  };

  return { lists, actions: { handleDragAndDrop } };
}

interface TaskListsProps {
  tasks: Task[];
  taskActions: TaskActions;
}
export function TaskLists(props: TaskListsProps): React.ReactElement {
  const { tasks, taskActions } = props;
  const {
    lists,
    actions: { handleDragAndDrop },
  } = useTaskLists(tasks);
  return (
    <DragDropContext
      onDragEnd={(result) => {
        handleDragAndDrop(result);
        
        const {
          draggableId: taskId, 
          destination: { droppableId: destinationStatus } = { droppableId: "" }
        } = result;
        
        const newStatus = statusMap.get(destinationStatus);
        if(newStatus) {
          taskActions.updateTask(taskId, {
            status: statusMap.get(newStatus),
          });
        }
      }}
    >
      <div
        css={css`
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        `}
      >
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
      </div>
    </DragDropContext>
  );
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
