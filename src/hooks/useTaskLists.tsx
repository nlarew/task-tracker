import * as React from "react";
import { Task, TaskStatus, ObjectID, statusMap } from "../types";

import * as R from "ramda";
import { DropResult } from "react-beautiful-dnd";

function isStatus(task: Task, status: TaskStatus) {
  return task.status === status;
}

const isOpenTask = (task: Task) => isStatus(task, TaskStatus.Open);
const isInProgressTask = (task: Task) => isStatus(task, TaskStatus.InProgress);
const isCompleteTask = (task: Task) => isStatus(task, TaskStatus.Complete);

type TaskListDescription = {
  status: TaskStatus;
  displayName: string;
  tasks: Array<Task>;
  displayOrder: Array<ObjectID>;
};

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

interface UseTaskListsPayload {
  lists: TaskListDescription[];
  actions: { handleDragAndDrop: (dragDropResult: DropResult) => void };
}

export default function useTaskLists(tasks: Task[]): UseTaskListsPayload {
  const [lists, setLists] = React.useState<TaskListDescription[]>(
    createLists(tasks)
  );

  const getListWithStatus = React.useCallback(
    (status: TaskStatus) => {
      const findListForStatus = R.find<TaskListDescription>(R.propEq("status", status))
      return findListForStatus(lists)
    },
    [lists]
  );

  const updateList = React.useCallback((status: TaskStatus, updated: TaskListDescription) => {
    setLists((prevLists: TaskListDescription[]) =>
      prevLists.map((list) => (status !== list.status ? list : updated))
    );
  }, []);

  const {
    addTaskToList,
    removeTaskFromList,
    moveTask,
    moveTaskInColumn,
  }: OrderedListActions = useOrderedListActions({ getListWithStatus, updateList, })

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
  }, [tasks, lists, addTaskToList, removeTaskFromList, moveTask]);

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

interface OrderedListActions {
  addTaskToList: (taskId: ObjectID, status: TaskStatus, displayIndex?: number) => void;
  removeTaskFromList: (taskId: ObjectID, status: TaskStatus) => void;
  moveTask: (taskId: ObjectID, oldStatus: TaskStatus, oldDisplayIndex: number, newStatus: TaskStatus, newDisplayIndex?: number) => void;
  moveTaskInColumn: (taskId: ObjectID, status: TaskStatus, newIndex: number) => void;
}
function useOrderedListActions({ getListWithStatus, updateList }: {
  getListWithStatus: (status: TaskStatus) => TaskListDescription | undefined;
  updateList: (status: TaskStatus, updated: TaskListDescription) => void;
}): OrderedListActions {
  const addTaskToList = React.useCallback((
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
  }, [getListWithStatus, updateList]);

  const removeTaskFromList = React.useCallback((taskId: ObjectID, status: TaskStatus) => {
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
  }, [getListWithStatus, updateList]);

  const moveTask = React.useCallback((
    taskId: ObjectID,
    oldStatus: TaskStatus,
    oldDisplayIndex: number,
    newStatus: TaskStatus,
    newDisplayIndex?: number
  ) => {
    removeTaskFromList(taskId, oldStatus);
    addTaskToList(taskId, newStatus, newDisplayIndex);
  }, [removeTaskFromList, addTaskToList]);

  const moveTaskInColumn = React.useCallback((
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
  }, [getListWithStatus, updateList]);

  return {
    addTaskToList,
    removeTaskFromList,
    moveTask,
    moveTaskInColumn,
  }
}
