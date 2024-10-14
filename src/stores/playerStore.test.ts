import { describe, it, expect, beforeEach } from "vitest";
import { usePlayerStore } from "./playerStore";
import Player from "../types/playerTypes";

describe("usePlayerStore", () => {

  beforeEach(() => {
    usePlayerStore.setState({ player: undefined });

  });

  it("should have initial state with player undefined", () => {
    const state = usePlayerStore.getState();
    expect(state.player).toBeUndefined();
  });

  it("should set player correctly", () => {
    const player: Player = { playerID: 1, username: "test" };
    usePlayerStore.getState().setPlayer(player);
    const state = usePlayerStore.getState();
    expect(state.player).toEqual(player);
  });

  it("should delete player and redirect correctly", () => {
    const player: Player = { playerID: 1, username: "test" };
    usePlayerStore.getState().setPlayer(player);
    usePlayerStore.getState().deletePlayer();
    const state = usePlayerStore.getState();
    expect(state.player).toBeUndefined();
  });
});