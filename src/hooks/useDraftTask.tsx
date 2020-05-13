import * as React from "react";
import { TaskStatus } from "../types";
import { TaskActions } from "../hooks/useTasks";

export type DraftTask = {
  status: TaskStatus;
  description: string;
  assignee?: string;
};

export interface DraftTaskActions {
  updateDraft: (draft: DraftTask) => void;
  deleteDraft: () => void;
  saveDraft: () => Promise<void>;
}

export default function useDraftTask(taskActions: TaskActions): [DraftTask | null, DraftTaskActions] {
  const [draft, setDraft] = React.useState<DraftTask | null>(null);
  const actions: DraftTaskActions = {
    updateDraft: (updatedDraft: DraftTask) => {
      setDraft(updatedDraft);
    },
    deleteDraft: () => {
      setDraft(null);
    },
    saveDraft: async () => {
      if (draft) {
        await taskActions.addTask(draft);
        setDraft(null);
      }
    },
  };
  return [draft, actions];
}
