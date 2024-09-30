import { create } from "zustand";
import Player from "../types/playerTypes";

interface PlayerState {
  player: Player | undefined;
  setPlayer: (player: Player) => void;
  deletePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  player: undefined,
  setPlayer: (player: Player) => {
    set({ player });
  },
  deletePlayer: () => {
    set({ player: undefined });
  },
}));
