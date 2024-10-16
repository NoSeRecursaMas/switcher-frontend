import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import {
  Game,
  MovementCard,
  FigureCard,
  Movement,
  Figure,
  Color,
  Tile,
} from '../types/gameTypes';

// Mock de la información de juego
const playersMock = [
  {
    position: 1,
    username: 'Player 1',
    playerID: 1,
    isActive: true,
    sizeDeckFigure: 6,
    cardsFigure: randomFigureHand(),
  },
  {
    position: 2,
    username: 'Player 2',
    playerID: 2,
    isActive: true,
    sizeDeckFigure: 5,
    cardsFigure: randomFigureHand(),
  },
  {
    position: 3,
    username: 'Player 3',
    playerID: 3,
    isActive: true,
    sizeDeckFigure: 4,
    cardsFigure: randomFigureHand(),
  },
  {
    position: 4,
    username: 'Player 4',
    playerID: 4,
    isActive: true,
    sizeDeckFigure: 3,
    cardsFigure: randomFigureHand(),
  },
];
function randomMovementHand(): MovementCard[] {
  const movements = [
    Movement.mov1,
    Movement.mov2,
    Movement.mov3,
    Movement.mov4,
    Movement.mov5,
    Movement.mov6,
    Movement.mov7,
  ];
  return Array(3)
    .fill(0)
    .map(() => ({
      type: movements[Math.floor(Math.random() * movements.length)],
      cardID: 0,
      isUsed: false,
    }));
}
function randomFigureHand(): FigureCard[] {
  const figures = [
    Figure.fig01,
    Figure.fig02,
    Figure.fig03,
    Figure.fig04,
    Figure.fig05,
    Figure.fig06,
    Figure.fig07,
    Figure.fig08,
    Figure.fig09,
    Figure.fig10,
    Figure.fig11,
    Figure.fig12,
    Figure.fig13,
    Figure.fig14,
    Figure.fig15,
    Figure.fig16,
    Figure.fig17,
    Figure.fig18,
    Figure.fige01,
    Figure.fige02,
    Figure.fige03,
    Figure.fige04,
    Figure.fige05,
    Figure.fige06,
    Figure.fige07,
  ];
  return Array(3)
    .fill(0)
    .map(() => ({
      type: figures[Math.floor(Math.random() * figures.length)],
      cardID: 0,
      isBlocked: false,
    }));
}
function getRandomColor(): Color {
  const colors = [Color.R, Color.G, Color.B, Color.Y];
  return colors[Math.floor(Math.random() * colors.length)];
}
const boardMock: Tile[] = Array(36)
  .fill(0)
  .map((_, i) => ({
    posX: i % 6,
    posY: Math.floor(i / 6),
    color: getRandomColor(),
    isPartial: false,
  }));

const gameStatus: Game = {
  gameID: 1,
  board: boardMock,
  figuresToUse: [],
  prohibitedColor: null,
  cardsMovement: randomMovementHand(),
  posEnabledToPlay: 3,
  players: playersMock,
};

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      game: undefined,
      selectedTile: undefined,
      selectedCard: undefined,
    });
  });

  it('should have initial state with room undefined', () => {
    const state = useGameStore.getState();
    expect(state.game).toBeUndefined();
  });

  it('should set the game', () => {
    useGameStore.getState().setGame(gameStatus);
    const state = useGameStore.getState();
    expect(state.game).toEqual(gameStatus);
  });

  it('should delete the game', () => {
    useGameStore.getState().setGame(gameStatus);
    useGameStore.getState().deleteGame();
    const state = useGameStore.getState();
    expect(state.game).toBeUndefined();
  });

  it('should select a tile', () => {
    useGameStore.getState().setGame(gameStatus);
    useGameStore.getState().selectTile(boardMock[7].posX, boardMock[7].posY);
    const state = useGameStore.getState();
    expect(state.selectedTile).toEqual({ posX: 1, posY: 1 });
  });

  it('should unselect a tile', () => {
    useGameStore.getState().setGame(gameStatus);
    useGameStore.getState().selectTile(boardMock[7].posX, boardMock[7].posY);
    expect(useGameStore.getState().selectedTile).toBeDefined();
    useGameStore.getState().unselectTile();
    const state = useGameStore.getState();
    expect(state.selectedTile).toBeUndefined();
  });

  it('should select a card', () => {
    useGameStore.getState().setGame(gameStatus);
    expect(useGameStore.getState().game.cardsMovement).toBeDefined();
    useGameStore
      .getState()
      .selectCard(useGameStore.getState().game.cardsMovement[0], 'movement');
    const state = useGameStore.getState();
    expect(state.selectedCard).toEqual({
      cardData: gameStatus.cardsMovement[0],
      type: 'movement',
    });
  });

  it('should unselect a card', () => {
    useGameStore.getState().setGame(gameStatus);
    expect(useGameStore.getState().game.cardsMovement).toBeDefined();
    useGameStore
      .getState()
      .selectCard(useGameStore.getState().game.cardsMovement[0], 'movement');
    useGameStore.getState().unselectCard();
    const state = useGameStore.getState();
    expect(state.selectedCard).toBeUndefined();
  });
});
