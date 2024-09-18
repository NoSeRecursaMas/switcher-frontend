import { useState, ReactNode } from "react";
import { UserContext } from "./user-context";
import { UserState } from "./types";

export default function UserProvider({ children }: { children: ReactNode }){
    const [state, setState] = useState<UserState>({ id: 0, username: "" });

    const isUserLoaded = state.username !== "";
  
    return (
      <UserContext.Provider value={{ user: state, setUser: setState, isUserLoaded }}>
        {children}
      </UserContext.Provider>
    );
  };
