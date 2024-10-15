import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "./gameStore";
import Game from "../types/gameTypes";

describe("useGameStore", () => {
  beforeEach(() => {
    useGameStore.setState({ game: undefined });
  });

  it("should have an initial state with game undefined", () => {
    const state = useGameStore.getState();
    expect(state.game).toBeUndefined();
  });

  it("should set a game in the store", () => {
    const game: Game = { 
      gameID: 1,
      players: [],
      posEnabledToPlay: 1,
      board: [],
      figuresToUse: [],
      prohibitedColor: null,
      cardsMovement: [],
    };
    useGameStore.getState().setGame(game);
    const state = useGameStore.getState();
    expect(state.game).toEqual(game);
  });

  it("should delete a game from the store", () => {
    const game: Game = {
      gameID: 1,
      players: [],
      posEnabledToPlay: 1,
      board: [],
      figuresToUse: [],
      prohibitedColor: null,
      cardsMovement: [],
    };
    useGameStore.getState().setGame(game);
    useGameStore.getState().deleteGame();
    const state = useGameStore.getState();
    expect(state.game).toBeUndefined();
  });
});