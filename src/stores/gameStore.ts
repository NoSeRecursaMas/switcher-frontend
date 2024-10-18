import { create } from 'zustand';
import { Game, MovementCard, FigureCard } from '../types/gameTypes';

interface GameState {
  game: Game | undefined;
  selectedTile: { posX: number; posY: number } | undefined;
  selectedCard:
    | { cardData: MovementCard | FigureCard; type: 'movement' | 'figure' }
    | undefined;
  setGame: (game: Game) => void;
  deleteGame: () => void;
  selectTile: (posX: number, posY: number) => void;
  unselectTile: () => void;
  selectCard: (
    cardData: MovementCard | FigureCard,
    type: 'movement' | 'figure'
  ) => void;
  unselectCard: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  game: undefined,
  selectedTile: undefined,
  selectedCard: undefined,
  setGame: (game: Game) => {
    set({ game });
    set({ selectedTile: undefined });
    set({ selectedCard: undefined });
  },
  deleteGame: () => {
    set({ game: undefined });
  },
  selectTile: (posX, posY) => {
    set({ selectedTile: { posX, posY } });
    console.log('selectedTile', { posX, posY });
  },
  unselectTile: () => {
    set({ selectedTile: undefined });
  },
  selectCard: (cardData, type) => {
    set({ selectedCard: { cardData, type } });
  },
  unselectCard: () => {
    set({ selectedCard: undefined });
  },
}));
