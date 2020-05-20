import * as React from "react";
import * as RealmWeb from "realm-web";
import { useRealmApp } from "../realm/RealmApp";

import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";

import Card from "@leafygreen-ui/card";

const LoginScreen: React.FC = () => {
  const app = useRealmApp();
  const [email, setEmail] = React.useState<string>("joe.jasper@example.com");
  const [password, setPassword] = React.useState<string>("password");
  const handleLogin = async () => {
    return await app.logIn(RealmWeb.Credentials.emailPassword(email, password));
  };
  return (
    <Container>
    <Card>
      <Layout>
        <LoginFormRow>
          <LoginHeading>Log In</LoginHeading>
        </LoginFormRow>
        <LoginFormRow>
          <TextInput
            type="email"
            label="Email"
            placeholder="your.email@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </LoginFormRow>
        <LoginFormRow>
          <TextInput
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="password"
            label="Password"
          />
        </LoginFormRow>
        <Button variant="primary" onClick={() => handleLogin()}>Log In</Button>
      </Layout>
    </Card>
    </Container>
  );
};
export default LoginScreen;

const Container = styled.div`
  height: 100vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Layout = styled.div`
  padding: 8px;
  color: black;
  width: 400px;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const LoginHeading = styled.h1`
  margin: 0;
  font-size: 32px;
`;
const LoginFormRow = styled.div`
  margin-bottom: 16px;
`;
