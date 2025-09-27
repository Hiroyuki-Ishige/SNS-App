import { useContext } from "react";
import { SessionContext } from "../SessionProvider";

export default function Home() {
  const sessionContext = useContext(SessionContext);
  const currentUser = sessionContext?.currentUser;

  return (
    <div>
      <h1>Home Page</h1>
      <h1>Welcome, {currentUser?.email || "Guest"}</h1>
    </div>
  );
}
