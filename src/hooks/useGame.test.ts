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
import { ROOM } from '../mocks/data/roomData';
import {
  GAME,
  CARD_FIGURE_VALID,
  CARD_FIGURE_BLOCKED,
  CARD_MOVEMENT_USED,
  CARD_MOVEMENT_VALID,
} from '../mocks/data/gameData';

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
    useRoomStore.setState({ room: ROOM });
    useGameStore.setState({ game: undefined });
    useGameStore.getState().unselectCard();
    useGameStore.getState().unselectTile();
  });

  it('Me devuelve el estado de la partida (caso undefined)', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.cardsMovement).toBeUndefined();
    expect(result.current.currentPlayer).toBeUndefined();
    expect(result.current.posEnabledToPlay).toBeUndefined();
    expect(result.current.selectedCard).toBeUndefined();
    expect(result.current.otherPlayersInPos).toEqual({
      left: undefined,
      right: undefined,
      top: undefined,
    });
  });

  it('Me devuelve el estado de la partida (caso definido)', () => {
    useGameStore.setState({ game: GAME });
    const { result } = renderHook(() => useGame());
    expect(result.current.cardsMovement).toEqual(GAME.cardsMovement);
    expect(result.current.currentPlayer).toEqual({
      position: 2,
      username: 'Player 1',
      playerID: 1,
      isActive: true,
      sizeDeckFigure: 6,
      cardsFigure: GAME.players[0].cardsFigure,
    });
    expect(result.current.posEnabledToPlay).toEqual(GAME.posEnabledToPlay);
    expect(result.current.selectedCard).toBeUndefined();
    expect(result.current.otherPlayersInPos).toEqual({
      left: GAME.players[3],
      right: GAME.players[1],
      top: GAME.players[2],
    });
  });

  it('Se llama al endpoint de comenzar partida correctamente', async () => {
    const startGameEndpoint = vi.spyOn(GameEndpoints, 'startGame');
    const { result } = renderHook(() => useGame());
    await act(() => result.current.startGame());
    expect(startGameEndpoint).toHaveBeenCalled();
  });

  it('Si no soy el dueño de la sala no puedo comenzar la partida', async () => {
    usePlayerStore.setState({ player: { playerID: 2, username: 'test' } });
    const startGameEndpoint = vi.spyOn(GameEndpoints, 'startGame');
    const { result } = renderHook(() => useGame());
    await act(() => result.current.startGame());
    expect(startGameEndpoint).not.toHaveBeenCalled();
  });

  it('Se llama al endpoint de pasar turno correctamente y se notifica al usuario', async () => {
    useGameStore.setState({ game: GAME });
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

  it('Si no es mi turno no puedo pasar el turno', async () => {
    useGameStore.setState({ game: GAME });
    usePlayerStore.setState({ player: { playerID: 3, username: 'test' } });
    const turnEndpoint = vi.spyOn(GameEndpoints, 'turn');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGame());
    await act(() => result.current.endTurn());
    expect(turnEndpoint).not.toHaveBeenCalled();
    expect(handleNotificationResponse).not.toHaveBeenCalled();
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
    useGameStore.setState({ game: GAME });
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

  it('Si no estoy en la partida no puedo salir', async () => {
    useGameStore.setState({ game: GAME });
    usePlayerStore.setState({ player: { playerID: 69, username: 'test' } });
    const leaveEndpoint = vi.spyOn(GameEndpoints, 'leaveGame');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGame());
    await act(() => result.current.leaveGame());
    expect(leaveEndpoint).not.toHaveBeenCalled();
    expect(handleNotificationResponse).not.toHaveBeenCalled();
  });

  it('No puedo seleccionar una carta si no es mi turno', () => {
    useGameStore.setState({ game: GAME });
    usePlayerStore.setState({ player: { playerID: 3, username: 'test' } });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(CARD_FIGURE_VALID);
    });
    expect(result.current.selectedCard).toBeUndefined();
  });

  it('Puedo seleccionar una carta si es mi turno', () => {
    useGameStore.setState({ game: GAME });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(CARD_FIGURE_VALID);
    });
    expect(result.current.selectedCard).toEqual(CARD_FIGURE_VALID);
  });

  it('No puedo selecionar una carta de figura bloqueada', () => {
    useGameStore.setState({ game: GAME });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(CARD_FIGURE_BLOCKED);
    });
    expect(result.current.selectedCard).toBeUndefined();
  });

  it('Puedo deseleccionar una carta', () => {
    useGameStore.setState({ game: GAME });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(CARD_FIGURE_VALID);
    });
    expect(result.current.selectedCard).toEqual(CARD_FIGURE_VALID);
    act(() => {
      result.current.handleClickCard(CARD_FIGURE_VALID);
    });
    expect(result.current.selectedCard).toBeUndefined();
  });

  it('No puedo seleccionar una carta movimiento ya usada', () => {
    useGameStore.setState({ game: GAME });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(CARD_MOVEMENT_USED);
    });
    expect(result.current.selectedCard).toBeUndefined();
  });

  it('Puedo seleccionar una carta movimiento valida', () => {
    useGameStore.setState({ game: GAME });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(CARD_MOVEMENT_VALID);
    });
    expect(result.current.selectedCard).toEqual(CARD_MOVEMENT_VALID);
  });

  it('No puedo seleccionar una carta que no es mia', () => {
    useGameStore.setState({ game: GAME });
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleClickCard(GAME.players[1].cardsFigure[0]);
    });
    expect(result.current.selectedCard).toBeUndefined();
  });
});
