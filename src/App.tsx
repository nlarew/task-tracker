import React from 'react';
import logo from './logo.svg';
import RealmApp, { useRealmApp } from './realm/RealmApp';
import RealmApolloProvider from './realm/RealmApolloProvider';
import * as RealmWeb from "realm-web";
import './App.css';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_DOGS = gql`
  {
    dogs {
      id
      breed
    }
  }
`;

const AppContainer: React.FC = (props) => {
  return (
    <RealmApp id="task-tracker-lgpko">
      <App />
    </RealmApp>
  )
}
export default AppContainer;

function App() {
  const app = useRealmApp();
  const user = app.user;
  return (
    !user
    ? <UnauthenticatedApp />
    : <RealmApolloProvider>
        <AuthenticatedApp />
      </RealmApolloProvider>
  );
}

function AuthenticatedApp() {
  const { logOut } = useRealmApp();
  const handleLogout = async () => {
    return await logOut()
  }
  return (
    <div className="App">
      <button onClick={() => handleLogout()}>Log Out</button>
    </div>
  )
}

function UnauthenticatedApp() {
  const app = useRealmApp();
  const handleLogin = async () => {
    return await app.logIn(RealmWeb.Credentials.anonymous())
  }
  return (
    <div>
      <div>
        YOU NEED TO LOG IN!
      </div>
      <button onClick={() => handleLogin()}>Log In</button>
    </div>
  )
}
