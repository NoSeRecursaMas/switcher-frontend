import { createContext, useContext } from "react";
import { UserContextType } from "./types";

export const UserContext = createContext<UserContextType | null>(null);

export const useUser: () => UserContextType = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}



