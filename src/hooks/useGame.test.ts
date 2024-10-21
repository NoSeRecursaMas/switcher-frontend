import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
  Mock,
} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';
import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import { useGameStore } from '../stores/gameStore';
import * as GameEndpoints from '../api/gameEndpoints';
import * as utils from '../services/utils';
import { server } from '../mocks/node';
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
const roomMock = {
  roomID: 1,
  roomName: 'test',
  hostID: 1,
  maxPlayers: 4,
  minPlayers: 2,
  players: [
    { playerID: 1, username: 'Player 1' },
    { playerID: 2, username: 'Player 2' },
    { playerID: 3, username: 'Player 3' },
    { playerID: 4, username: 'Player 4' },
  ],
};

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
  posEnabledToPlay: 1,
  players: playersMock,
};

const mockNavigate = vi.fn();

vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> =
    await vi.importActual(`react-router-dom`);

  return {
    ...actual,
    useNavigate: (): Mock => mockNavigate,
  };
});

describe('useGame', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: 'test' } });
    useRoomStore.setState({ room: roomMock });
  });

  it('Me devuelve el estado de la partida (caso undefined)', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.cardsMovement).toBeUndefined();
    expect(result.current.currentPlayer).toBeUndefined();
    expect(result.current.posEnabledToPlay).toBeUndefined();
    expect(result.current.selectedCard).toBeUndefined();
  });

  it('Los atributos se cargan correctamente', () => {
    useGameStore.setState({ game: gameStatus });
    const { result } = renderHook(() => useGame());
    expect(result.current.cardsMovement).toEqual(gameStatus.cardsMovement);
    expect(result.current.posEnabledToPlay).toEqual(
      gameStatus.posEnabledToPlay
    );
  });

  it('Se llama al endpoint de comenzar partida correctamente', async () => {
    const startGameEndpoint = vi.spyOn(GameEndpoints, 'startGame');
    const { result } = renderHook(() => useGame());
    await act(() => result.current.startGame());
    expect(startGameEndpoint).toHaveBeenCalled();
  });

  it('Se llama al endpoint de pasar turno correctamente y se notifica al usuario', async () => {
    useGameStore.setState({ game: gameStatus });
    const turnEndpoint = vi.spyOn(GameEndpoints, 'turn');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGame());
    await act(() => result.current.endTurn());
    expect(turnEndpoint).toHaveBeenCalled();
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it('Al comenzar la partida el jugador no tiene ninguna carta seleccionada', () => {
    useGameStore.setState({ game: gameStatus });
    const { result } = renderHook(() => useGame());
    expect(result.current.selectedCard).toBeUndefined();
  });

  it('Las cartas seleccionadas se guardan correctamente', () => {
    useGameStore.setState({ game: gameStatus });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(gameStatus.cardsMovement[0], 'movement');
    });
    expect(result.current.selectedCard).toEqual({
      cardData: gameStatus.cardsMovement[0],
      type: 'movement',
    });
  });

  it('Un jugador no puede clickear una carta si no es su turno', () => {
    usePlayerStore.setState({ player: { playerID: 3, username: 'Player 3' } });
    useGameStore.setState({ game: gameStatus });
    const sendToast = vi.spyOn(utils, 'sendToast');
    const { result } = renderHook(() => useGame());
    result.current.handleClickCard(gameStatus.cardsMovement[0], 'movement');
    expect(sendToast).toHaveBeenCalledWith('No es tu turno', null, 'error');
  });

  it('Se llama al endpoint de cancelar movimiento correctamente', async () => {
    gameStatus.cardsMovement[0].isUsed = true;
    useGameStore.setState({ game: gameStatus });
    const cancelMoveEndpoint = vi.spyOn(GameEndpoints, 'cancelMove');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGame());
    await act(() => result.current.cancelMove());
    expect(cancelMoveEndpoint).toHaveBeenCalledWith(gameStatus.gameID, {
      playerID: 1,
    });
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it('Al salir de una partida se llama al endpoint y se notifica al usuario', async () => {
    useGameStore.setState({ game: gameStatus });
    const leaveEndpoint = vi.spyOn(GameEndpoints, 'leaveGame');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGame());
    await act(() => result.current.leaveGame());
    expect(leaveEndpoint).toHaveBeenCalled();
    expect(handleNotificationResponse).toHaveBeenCalled();
  });
});
