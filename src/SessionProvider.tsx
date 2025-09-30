import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authRepository } from "./repositories/auth";

// Define a proper User type for the session
type User = {
  id: string;
  email: string;
  userName?: string; // Optional userName property
  // Add other user properties as needed
} | null;

type SessionContextType = {
  currentUser: User;
  setCurrentUser: (user: User) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = (props: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession();
  }, []);

  const setSession = async () => {
    try {
      const currentUser = await authRepository.getCurrentUser();
      if (currentUser && currentUser.email && currentUser.id) {
        setCurrentUser({
          id: currentUser.id,
          email: currentUser.email,
          userName: currentUser.userName,
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
      {props.children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
