import { create } from "zustand";
import Game from "../types/gameTypes";

interface GameState {
  game: Game | undefined;
  setGame: (game: Game) => void;
  deleteGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  game: undefined,
  setGame: (game: Game) => {
    set({ game });
  },
  deleteGame: () => {
    set({ game: undefined });
  },
}));
