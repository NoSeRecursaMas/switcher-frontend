import { createContext, useContext } from "react";
import { RoomContextType } from "./types";

export const RoomContext = createContext<RoomContextType | null>(null);

export const useRoom: () => RoomContextType = () => {
  const context = useContext(RoomContext);
  if (context === null) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}



