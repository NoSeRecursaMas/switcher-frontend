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
import { ROOM } from '../mocks/data/roomData';
import { GAME } from '../mocks/data/gameData';

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
    useRoomStore.setState({ room: ROOM });
    useGameStore.setState({ game: GAME });
    useGameStore.getState().unselectCard();
    useGameStore.getState().unselectTile();
  });

  it('Me devuelve el estado de las fichas (caso undefined)', () => {
    useGameStore.setState({ game: undefined });
    const { result } = renderHook(() => useGameTile());
    expect(result.current.board.length).toBe(0);
    expect(result.current.selectedTile).toBeUndefined();
  });

  it('Me devuelve el estado de las fichas (caso definido)', () => {
    const { result } = renderHook(() => useGameTile());
    expect(result.current.board).toBeDefined();
    expect(result.current.board.length).toBe(36);
    expect(result.current.selectedTile).toBeUndefined();
  });

  it('Se selecciona un tile al clickearlo', async () => {
    useGameStore.getState().selectCard(GAME.cardsMovement[0]);
    const { result } = renderHook(() => useGameTile());
    await act(() => result.current.handleClickTile(1, 1));
    expect(result.current.selectedTile).toEqual({ posX: 1, posY: 1 });
  });

  it('No se puede seleccionar un tile sin tener una carta seleccionada', async () => {
    const sendToast = vi.spyOn(utils, 'sendToast');
    const { result } = renderHook(() => useGameTile());
    await act(() => result.current.handleClickTile(1, 1));
    expect(sendToast).toHaveBeenCalledWith(
      'No se ha seleccionado una carta',
      null,
      'error'
    );
  });

  it('No se puede seleccionar un tile si no es tu turno', async () => {
    usePlayerStore.setState({ player: { playerID: 3, username: 'Player 3' } });
    const { result } = renderHook(() => useGameTile());
    await act(() => result.current.handleClickTile(1, 1));
    expect(result.current.selectedTile).toBeUndefined();
  });

  it('Al seleccionar una segunda ficha valida, se llama al endpoint de jugar carta de movimiento', async () => {
    useGameStore.getState().selectCard(GAME.cardsMovement[0]);
    useGameStore.getState().selectTile(1, 1);
    const moveEndpoint = vi.spyOn(GameEndpoints, 'moveCard');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGameTile());
    await act(() => result.current.handleClickTile(3, 3));
    expect(moveEndpoint).toHaveBeenCalled();
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it('Al seleccionar una segunda ficha invalida, se selecciona la nueva ficha', async () => {
    useGameStore.getState().selectCard(GAME.cardsMovement[0]);
    useGameStore.getState().selectTile(1, 1);
    const moveEndpoint = vi.spyOn(GameEndpoints, 'moveCard');
    const handleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const { result } = renderHook(() => useGameTile());
    await act(() => result.current.handleClickTile(2, 2));
    expect(result.current.selectedTile).toEqual({ posX: 2, posY: 2 });
    expect(moveEndpoint).not.toHaveBeenCalled();
    expect(handleNotificationResponse).not.toHaveBeenCalled();
  });
});
