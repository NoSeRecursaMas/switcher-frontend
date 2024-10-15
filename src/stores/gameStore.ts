import { create } from "zustand";
import Game from "../types/gameTypes";

interface GameState {
  game: Game | undefined;
  selectedTile: { posX: number; posY: number } | undefined;
  selectedCard: { cardID: number; type: "movement" | "figure" } | undefined;
  setGame: (game: Game) => void;
  deleteGame: () => void;
  selectTile: (posX: number, posY: number) => void;
  unselectTile: () => void;
  selectCard: (cardID: number, type: "movement" | "figure") => void;
  unselectCard: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  game: undefined,
  selectedTile: undefined,
  selectedCard: { cardID: 0, type: "movement" },
  setGame: (game: Game) => {
    set({ game });
  },
  deleteGame: () => {
    set({ game: undefined });
  },
  selectTile: (posX, posY) => {
    set({ selectedTile: { posX, posY } });
  },
  unselectTile: () => {
    set({ selectedTile: undefined });
  },
  selectCard: (cardID, type) => {
    set({ selectedCard: { cardID, type } });
  },
  unselectCard: () => {
    set({ selectedCard: undefined });
  },
}));
