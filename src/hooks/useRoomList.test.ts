import { describe, it, expect, beforeEach, vi, Mock, beforeAll, afterAll } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRoomList } from "./useRoomList";
import { usePlayerStore } from "../stores/playerStore";
import { useNavigate } from "react-router-dom";
import * as roomEndpoints from "../api/roomEndpoints";
import * as utils from "../services/utils";
import { server } from "../mocks/node";

vi.mock("react-router-dom");

describe("useRoomList", () => {
  const mockNavigate = vi.fn();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    usePlayerStore.setState({ player: undefined });
    vi.resetAllMocks();
    (useNavigate as Mock).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it("Me devuelve una lista de salas undefined por defecto", () => {
    const { result } = renderHook(() => useRoomList());
    expect(result.current.rooms).toBeUndefined();
  });

  it("Me permite refrescar la lista de salas", async () => {
    const { result } = renderHook(() => useRoomList());
    expect(result.current.rooms).toBeUndefined();
    await act(async () => {
      await result.current.refreshRoomList();
    });
    expect(result.current.rooms).toBeDefined();
  });

  it("Al refrescar la lista de salas, se llama al endpoint de obtener salas", async () => {
    const getRooms = vi.spyOn(roomEndpoints, "getRooms");
    const { result } = renderHook(() => useRoomList());
    await act(async () => {
      await result.current.refreshRoomList();
    });
    expect(getRooms).toHaveBeenCalled();
  });

  it("La sala seleccionada por defecto es undefined", () => {
    const { result } = renderHook(() => useRoomList());
    expect(result.current.selectedRoomID).toBeUndefined();
  });

  it("Puedo seleccionar una sala", () => {
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(1, 2, 4);
    });
    expect(result.current.selectedRoomID).toBe(1);
  });

  it("No puedo seleccionar una sala que esta llena", () => {
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(1, 2, 2);
    });
    expect(result.current.selectedRoomID).toBeUndefined();
  });

  it("Al seleccionar una sala llena, muestra un toast de warning", () => {
    const sendToast = vi.spyOn(utils, "sendToast");
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(1, 2, 2);
    });
    expect(sendToast).toHaveBeenCalledWith(
      "La sala está llena",
      "No puedes unirte a una que ya alcanzó su límite de jugadores",
      "warning"
    );
  });

  it("Al seleccionar una sala, si ya estaba seleccionada, la deselecciona", () => {
    const { result } = renderHook(() => useRoomList());
    act(() => {
      result.current.handleSelectRoomID(1, 2, 4);
    });
    expect(result.current.selectedRoomID).toBe(1);
    act(() => {
      result.current.handleSelectRoomID(1, 2, 4);
    });
    expect(result.current.selectedRoomID).toBeUndefined();
  });
});
