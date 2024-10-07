import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlayer } from "./usePlayer";
import { usePlayerStore } from "../stores/playerStore";
import * as playerEndpoints from "../api/playerEndpoints";
import * as utils from "../services/utils";
import { server } from "../mocks/node";

describe("usePlayer", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    usePlayerStore.setState({ player: undefined });
  });

  it("Me devuelve el estado del jugador (caso undefined)", () => {
    const { result } = renderHook(() => usePlayer());
    expect(result.current.player).toBeUndefined();
  });

  it("Me devuelve el estado del jugador (caso jugador cargado)", () => {
    const player = { playerID: 1, username: "test" };
    usePlayerStore.setState({ player });
    const { result } = renderHook(() => usePlayer());
    expect(result.current.player).toEqual(player);
  });

  it("Al crear un jugador, se llama al endpoint de creación", async () => {
    const createPlayerEndpoint = vi.spyOn(playerEndpoints, "createPlayer");
    const username = "test de jugador";
    const { result } = renderHook(() => usePlayer());

    await act(async () => {
      await result.current.createPlayer(username);
    });
    expect(createPlayerEndpoint).toHaveBeenCalledWith({ username });
  });

  it("Me permite crear un jugador y le asigna bien el nombre", async () => {
    const username = "test de jugador";
    const { result } = renderHook(() => usePlayer());

    await act(async () => {
      await result.current.createPlayer(username);
    });
    expect(result.current.player).toBeDefined();
    expect(result.current.player?.username).toEqual(username);
  });

  it("En caso de éxito, muestra un toast de éxito", async () => {
    const sendToast = vi.spyOn(utils, "sendToast");
    const username = "test de jugador";
    const { result } = renderHook(() => usePlayer());

    await act(async () => {
      await result.current.createPlayer(username);
    });
    expect(sendToast).toHaveBeenCalledWith(
      "¡Nombre seleccionado con éxito!",
      null,
      "success"
    );
  });

  it("En caso de error, no asigna el nombre al jugador", async () => {
    const username = "error";
    const { result } = renderHook(() => usePlayer());

    await act(async () => {
      await result.current.createPlayer(username);
    });

    expect(result.current.player).toBeUndefined();
  });

  it("En caso de error, muestra un toast de error", async () => {
    const sendErrorToast = vi.spyOn(utils, "sendErrorToast");
    const username = "error";
    const { result } = renderHook(() => usePlayer());

    await act(async () => {
      await result.current.createPlayer(username);
    });
    expect(sendErrorToast).toHaveBeenCalledWith(
      {
        detail: [
          {
            input: "error",
            msg: "Ejemplo de error en el backend",
            type: "ValidationError",
          },
        ],
      },
      "Error al seleccionar nombre"
    );
  });
});
