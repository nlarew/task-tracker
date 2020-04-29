import * as React from "react";
import * as RealmWeb from "realm-web";

interface IRealmApp {
  id: string;
  user: Realm.User | null;
  logIn: Function;
  logOut: Function;
}
const RealmAppContext = React.createContext<IRealmApp>({
  id: "",
  user: null,
  logIn: () => {},
  logOut: () => {},
});

interface RealmAppProps {
  id: string; // Realm App ID
}

function createRealmAppWithId(appId: string) {
  return new RealmWeb.App({
    id: appId,
    baseUrl: "https://realm-dev.mongodb.com"
  });
}

const RealmApp: React.FC<RealmAppProps> = ({ id, children }) => {
  const [app, setApp] = React.useState(createRealmAppWithId(id));
  React.useEffect(() => {
    setApp(createRealmAppWithId(id));
  }, [id])
  
  const [user, setUser] = React.useState(app.currentUser)
  React.useEffect(() => {
    setUser(app.currentUser)
  }, [app.currentUser])
  
  const logIn = React.useCallback(async (credentials) => {
    const loggedInUser = await app.logIn(credentials);
    setUser(loggedInUser)
  }, [app])
  
  const logOut = React.useCallback(async (user) => {
    await app.logOut(user);
    setUser(app.currentUser)
  }, [app])
  
  const context: IRealmApp = { id, user, logIn, logOut }
  return (
    <RealmAppContext.Provider value={context}>
      {children}
    </RealmAppContext.Provider>
  )
}
export default RealmApp

export const useRealmApp = (): IRealmApp => {
  const app = React.useContext(RealmAppContext);
  if(!app) {
    throw new Error("You must call useRealmApp() inside of a <RealmApp />.")
  }
  return app
}
