/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Task, TaskStatus, User } from "../types";
import { DraftTask, DraftTaskActions } from "./TaskList";
import Card from "@leafygreen-ui/card";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { uiColors } from "@leafygreen-ui/palette";

interface TaskCardProps {
  task: Task;
}
const statusMessages = new Map<TaskStatus, string>([
  [TaskStatus.Open, "Open"],
  [TaskStatus.InProgress, "In Progress"],
  [TaskStatus.Complete, "Complete"],
]);
const statusColors = new Map<TaskStatus, { background: string; text: string }>([
  [
    TaskStatus.Open,
    { background: uiColors.blue.base, text: uiColors.gray.light3 },
  ],
  [
    TaskStatus.InProgress,
    { background: uiColors.yellow.base, text: uiColors.gray.dark2 },
  ],
  [
    TaskStatus.Complete,
    { background: uiColors.green.base, text: uiColors.gray.light3 },
  ],
]);

const KeyID = styled.div`
  font-size: 10px;
`

export default function TaskCard({ task }: TaskCardProps): React.ReactElement {
  const statusColor = statusColors.get(task.status);
  const statusMessage = statusMessages.get(task.status)
  return (
      <Card>
        <Layout>
          <KeyID>{task._id}</KeyID>
          <Row>
            <Assignee user={task?.assignee} />
            <Status backgroundColor={statusColor?.background} textColor={statusColor?.text}>
              {statusMessage}
            </Status>
          </Row>
          <Row>
            <Description>
              <span>{task.description}</span>
            </Description>
          </Row>
        </Layout>
      </Card>
  );
};

type DraftTaskCardProps = {
  draft: DraftTask;
  draftActions: DraftTaskActions;
}

export function DraftTaskCard({ draft, draftActions }: DraftTaskCardProps): React.ReactElement {
  const { updateDraft, deleteDraft, saveDraft } = draftActions;
  const statusColor = statusColors.get(draft.status);
  const statusMessage = statusMessages.get(draft.status)
  return (
    <Card>
      <Layout>
        <Row>
          <Assignee />
          <Status backgroundColor={statusColor?.background} textColor={statusColor?.text}>
            {statusMessage}
          </Status>
        </Row>
        <Row>
          <DraftInput
            placeholder="Enter a task..."
            onChange={(e) => {
              updateDraft({
                ...draft,
                description: e.target.value,
              })
            }}
            value={draft.description}
          />
        </Row>
        <Row>
          <DeleteButton onClick={() => { deleteDraft() }}>Delete</DeleteButton>
          <SubmitButton onClick={async () => { await saveDraft() }} disabled={!draft.description}>Add</SubmitButton>
        </Row>
      </Layout>
    </Card>
  );
};
const DraftInput = styled(TextInput)`
  width: 100%;
`
interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}
const SubmitButton: React.FC<ButtonProps> = (props) => (
  <Button variant="primary" {...props}>Add</Button>
)
const DeleteButton: React.FC<ButtonProps> = (props) => (
  <Button variant="danger" {...props}>Delete</Button>
)

interface AssigneeProps { user?: User }
function Assignee({ user }: AssigneeProps) {
  const image = user?.image || "https://www.shareicon.net/data/48x48/2015/09/24/106423_user_512x512.png"
  const username = user?.name || "No assignee"
  return (
    <div css={css`
      display: flex;
      align-items: center;
      padding-right: 16px;
      border-radius: 500px;
      border: 0.5px solid transparent;
    `}>
      <Avatar src={image} />
      <Username>{username}</Username>
    </div>
  );
}
const Username = styled.div`
  font-size: 16px;
`

const Avatar = styled.div<{ src: string }>(props => `
    background-image: url('${props.src}');
    /* make a square container */
    width: 24px;
    height: 24px;
    /* fill the container, preserving aspect ratio, and cropping to fit */
    background-size: cover;
    /* center the image vertically and horizontally */
    background-position: top center;
    /* round the edges to a circle with border radius 1/2 container size */
    border-radius: 50%;
    margin-right: 8px;
`)

const Layout = styled.div`
  padding: 8px;
  color: black;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`;

const Description = styled.div`
  font-size: 24px;
  margin: 0;
  text-align: left;
`;

const Status = styled.div<{
  backgroundColor?: string;
  textColor?: string;
}>(
  (props) => `
  font-size: 12px;
  font-weight: bold;
  line-height: 12px;
  text-align: center;
  border-radius: 500px;
  background-color: ${props.backgroundColor || "lightgray"};
  padding: 8px 12px;
  color: ${props.textColor || "black"};
  user-select: none;
`
);
