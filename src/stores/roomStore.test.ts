import { describe, it, expect, beforeEach } from "vitest";
import { useRoomStore } from "./roomStore";
import Room from "../types/roomTypes";

describe("useRoomStore", () => {
  beforeEach(() => {
    useRoomStore.setState({ room: undefined });
  });

  it("should have initial state with room undefined", () => {
    const state = useRoomStore.getState();
    expect(state.room).toBeUndefined();
  });

  it("should set room correctly", () => {
    const room: Room = { roomID: 1, name: "testRoom" };
    useRoomStore.getState().setRoom(room);
    const state = useRoomStore.getState();
    expect(state.room).toEqual(room);
  });

  it("should delete room correctly", () => {
    const room: Room = {
      roomID: 1,
      roomName: "testRoom",
      hostID: 1,
      maxPlayers: 4,
      minPlayers: 2,
      players: [],
    };
    useRoomStore.getState().setRoom(room);
    useRoomStore.getState().deleteRoom();
    const state = useRoomStore.getState();
    expect(state.room).toBeUndefined();
  });
});
