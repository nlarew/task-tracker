import React from "react";
import styled from "@emotion/styled";

import { User, Task, TaskStatus } from "./types";

import RealmApp, { useRealmApp } from "./realm/RealmApp";
import RealmApolloProvider from "./realm/RealmApolloProvider";
import LoginScreen from "./components/LoginScreen";
import Board from "./components/Board";

import "./App.css";

const JOE: User = {
  _id: "5ea9ee394a25db5ecae02ff5",
  name: "Joe Jasper",
  image: "https://semantic-ui.com/images/avatar/small/joe.jpg",
  projects: [],
};
const HELEN: User = {
  _id: "5ea9ee4b4a25db5ecae02ff6",
  name: "Helen LaGrange",
  image: "https://semantic-ui.com/images/avatar/small/helen.jpg",
  projects: [],
};
const USERS: User[] = [JOE, HELEN];

const TASKS: Task[] = [
  {
    _id: "5ea9ee2a022d5a063bad737e",
    assignee: HELEN,
    status: TaskStatus.Open,
    description:
      "Develop test plan (mock data, unit, integration, e2e, security)",
    watchers: [],
  },
  {
    _id: "5ea9ee5cca25db5ecae02fe3",
    assignee: HELEN,
    status: TaskStatus.Open,
    description: "Develop the Gizmo Connector",
    watchers: [],
  },
  {
    _id: "5ea9ee5cca25db5ecae02fs7",
    assignee: JOE,
    status: TaskStatus.Open,
    description: "[Spike] Evaluate Serverless",
    watchers: [],
  },
  {
    _id: "5ea9ee3b023d5a063bad738f",
    assignee: HELEN,
    status: TaskStatus.InProgress,
    description: "Refactor the Whizbang Sprocket Interface",
    watchers: [],
  },
  {
    _id: "5ea9ee5b4a25db5ecae02ff7",
    assignee: JOE,
    status: TaskStatus.InProgress,
    description: "Design the Widget Assembly",
    watchers: [],
  },
  {
    _id: "5ea9ee884a25db5ecae02ff8",
    assignee: undefined,
    status: TaskStatus.Complete,
    description: "Schmooze the investors",
    watchers: [],
  },
  {
    _id: "5ea9ee5cca25db5ecae02fq2",
    assignee: JOE,
    status: TaskStatus.Complete,
    description: "Draft Gizmo Feature Spec",
    watchers: [],
  },
];

const App: React.FC = (props) => {
  return (
    <RealmApp id="task-tracker-lgpko">
      <AppContainer>
        <RequireAuthentication />
      </AppContainer>
    </RealmApp>
  );
};
export default App;

const AppContainer = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

function RequireAuthentication() {
  const app = useRealmApp();
  // return (
  //   <RealmApolloProvider>
  //     <Board />
  //   </RealmApolloProvider>
  // );
  return app.user ? (
    <RealmApolloProvider>
      <Board />
    </RealmApolloProvider>
  ) : (
    <LoginScreen />
  );
}
