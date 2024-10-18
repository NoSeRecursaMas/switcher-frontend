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
import { useGameTile } from './useGameTile';
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
  // Un solo tipo de carta para simplificar la prueba
  return Array(3)
    .fill(0)
    .map(() => ({ type: Movement.mov4, cardID: 0, isUsed: false }));
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

describe('useGameTile', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: 'Player 1' } });
    useRoomStore.setState({ room: roomMock });
    useGameStore.setState({ game: gameStatus });
  });

  it('Al comenzar el turno ningún tile está seleccionado', () => {
    const { result } = renderHook(() => useGameTile());
    expect(result.current.selectedTile).toBeUndefined();
  });

  it('Se selecciona un tile al clickearlo', async () => {
    useGameStore.getState().selectCard(gameStatus.cardsMovement[0], 'movement');
    const { result } = renderHook(() => useGameTile());
    await act(() =>
      result.current.handleClickTile(boardMock[7].posX, boardMock[7].posY)
    );
    expect(result.current.selectedTile).toEqual({ posX: 1, posY: 1 });
  });

  it('No se puede seleccionar un tile sin tener una carta seleccionada', async () => {
    useGameStore.getState().unselectCard();
    const sendToast = vi.spyOn(utils, 'sendToast');
    const { result } = renderHook(() => useGameTile());
    await act(() =>
      result.current.handleClickTile(boardMock[7].posX, boardMock[7].posY)
    );
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha seleccionado una carta de movimiento',
      null,
      'error'
    );
  });

  it('No se puede seleccionar un tile si no es tu turno', async () => {
    usePlayerStore.setState({ player: { playerID: 3, username: 'Player 3' } });
    const sendToast = vi.spyOn(utils, 'sendToast');
    const { result } = renderHook(() => useGameTile());
    await act(() =>
      result.current.handleClickTile(boardMock[7].posX, boardMock[7].posY)
    );
    expect(sendToast).toHaveBeenCalledWith('No es tu turno', null, 'error');
  });

  it('Al seleccionar una segunda ficha, se llama al endpoint de jugar carta de movimiento', async () => {
    useGameStore.getState().selectCard(gameStatus.cardsMovement[0], 'movement');
    useGameStore.getState().selectTile(1, 1);
    const moveEndpoint = vi.spyOn(GameEndpoints, 'moveCard');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGameTile());
    await act(() => result.current.handleClickTile(2, 2));
    expect(moveEndpoint).toHaveBeenCalled();
    expect(handleNotificationResponse).toHaveBeenCalled();
  });
});
