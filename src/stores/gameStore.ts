import { create } from 'zustand';
import { Game, MovementCard, FigureCard } from '../types/gameTypes';

interface GameState {
  game: Game | undefined;
  selectedTile: { posX: number; posY: number } | undefined;
  selectedCard: MovementCard | FigureCard | undefined;
  setGame: (game: Game) => void;
  deleteGame: () => void;
  selectTile: (posX: number, posY: number) => void;
  unselectTile: () => void;
  selectCard: (card: MovementCard | FigureCard) => void;
  unselectCard: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  game: undefined,
  selectedTile: undefined,
  selectedCard: undefined,
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
  selectCard: (card) => {
    set({ selectedCard: card });
  },
  unselectCard: () => {
    set({ selectedCard: undefined });
  },
}));
