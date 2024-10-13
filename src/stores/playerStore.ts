import { create } from "zustand";
import { persist } from "zustand/middleware";
import Player from "../types/playerTypes";
import { redirect } from "react-router-dom";

interface PlayerState {
  player: Player | undefined;
  setPlayer: (player: Player) => void;
  deletePlayer: () => void;
}

export const usePlayerStore = create(
  persist<PlayerState>(
    (set) => ({
      player: undefined,
      setPlayer: (player: Player) => {
        set({ player });
      },
      deletePlayer: () => {
        set({ player: undefined });
        redirect("/signup");
      },
    }),
    {
      name: "player-storage",
    }
  )
);
