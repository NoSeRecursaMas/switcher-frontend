import { useState, ReactNode } from "react";
import { RoomContext } from "./room-context";
import { RoomState } from "./types";


export default function UserProvider({ children }: { children: ReactNode }){
    const [state, setState] = useState<RoomState | undefined>(undefined);

    const isRoomDataLoaded = typeof state !== "undefined";
  
    return (
      <RoomContext.Provider value={{ room: state, setRoom: setState, isRoomDataLoaded }}>
        {children}
      </RoomContext.Provider>
    );
  };
