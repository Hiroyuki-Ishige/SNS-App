import { createContext, useState } from "react";
import type { ReactNode } from "react";

// Define a proper User type for the session
type User = {
  id: string;
  email: string;
  // Add other user properties as needed
} | null;

type SessionContextType = {
  currentUser: User;
  setCurrentUser: (user: User) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = (props: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);

  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
      {props.children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
