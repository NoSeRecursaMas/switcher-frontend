import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
  Mock,
} from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRoom } from "./useRoom";
import { usePlayerStore } from "../stores/playerStore";
import { useRoomStore } from "../stores/roomStore";
import { useRoomListStore } from "../stores/roomListStore";
import * as roomEndpoints from "../api/roomEndpoints";
import * as utils from "../services/utils";
import { server } from "../mocks/node";

const mockNavigate = vi.fn();

vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);

  return {
    ...actual,
    useNavigate: (): Mock => mockNavigate,
  };
});

describe("useRoom", () => {


  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    usePlayerStore.setState({ player: { playerID: 1, username: "test" } });
    useRoomStore.setState({ room: undefined });
    useRoomListStore.setState({ selectedRoomID: 1 });
  });

  it("Me devuelve el estado de la sala (caso undefined)", () => {
    const { result } = renderHook(() => useRoom());
    expect(result.current.room).toBeUndefined();
  });

  it("Me devuelve el estado de la sala (caso sala cargada)", () => {
    const room = {
      roomID: 1,
      roomName: "test",
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: "test" }],
    };
    useRoomStore.setState({ room });
    const { result } = renderHook(() => useRoom());
    expect(result.current.room).toEqual(room);
  });

  it("Al unirse a una sala, si no hay sala seleccionada, muestra un toast de error", async () => {
    useRoomListStore.setState({ selectedRoomID: undefined });
    const sendToast = vi.spyOn(utils, "sendToast");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(sendToast).toHaveBeenCalledWith(
      "La información de la sala no es válida",
      null,
      "error"
    );
  });

  it("Al unirse a una sala, si no hay jugador cargado, muestra un toast de error", async () => {
    usePlayerStore.setState({ player: undefined });
    const sendToast = vi.spyOn(utils, "sendToast");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(sendToast).toHaveBeenCalledWith(
      "No se ha podido cargar la información del jugador",
      null,
      "error"
    );
  });

  it("Al unirse a una sala llama a handleNotificationResponse con éxito", async () => {
    const handleNotificationResponse = vi.spyOn(utils, "handleNotificationResponse");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it("Al unirse a una sala se llama al endpoint de unirse a la sala", async () => {
    const joinRoomEndpoint = vi.spyOn(roomEndpoints, "joinRoom");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.joinRoom());
    expect(joinRoomEndpoint).toHaveBeenCalled();
  });

  it("Al salir de una sala, si no hay sala cargada, muestra un toast de error", async () => {
    useRoomStore.setState({ room: undefined });
    const sendToast = vi.spyOn(utils, "sendToast");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(sendToast).toHaveBeenCalledWith(
      "La información de la sala no es válida",
      null,
      "error"
    );
  });

  it("Al salir de una sala, si no hay jugador cargado, muestra un toast de error", async () => {
    usePlayerStore.setState({ player: undefined });
    const room = {
      roomID: 1,
      roomName: "test",
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: "test" }],
    };
    useRoomStore.setState({ room });
    const sendToast = vi.spyOn(utils, "sendToast");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(sendToast).toHaveBeenCalledWith(
      "No se ha podido cargar la información del jugador",
      null,
      "error"
    );
  });

  it("Al salir de una sala llama a handleNotificationResponse con éxito", async () => {
    const room = {
      roomID: 1,
      roomName: "test",
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: "test" }],
    };
    useRoomStore.setState({ room });
    const handleNotificationResponse = vi.spyOn(utils, "handleNotificationResponse");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it("Al salir de una sala se llama al endpoint de salir de la sala", async () => {
    const room = {
      roomID: 1,
      roomName: "test",
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [{ playerID: 1, username: "test" }],
    };
    useRoomStore.setState({ room });
    const leaveRoomEndpoint = vi.spyOn(roomEndpoints, "leaveRoom");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.leaveRoom());
    expect(leaveRoomEndpoint).toHaveBeenCalled();
  });

  it("Al crear una sala, si no hay jugador cargado, muestra un toast de error", async () => {
    usePlayerStore.setState({ player: undefined });
    const sendToast = vi.spyOn(utils, "sendToast");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.createRoom("test", 4, 2));
    expect(sendToast).toHaveBeenCalledWith(
      "No se ha podido cargar la información del jugador",
      null,
      "error"
    );
  });

  it("Al crear una sala llama a handleNotificationResponse con éxito", async () => {
    const handleNotificationResponse = vi.spyOn(utils, "handleNotificationResponse");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.createRoom("test", 4, 2));
    expect(handleNotificationResponse).toHaveBeenCalled();
  });

  it("Al crear una sala se llama al endpoint de crear sala", async () => {
    const createRoomEndpoint = vi.spyOn(roomEndpoints, "createRoom");
    const { result } = renderHook(() => useRoom());
    await act(() => result.current.createRoom("test", 4, 2));
    expect(createRoomEndpoint).toHaveBeenCalled();
  });

  
});
