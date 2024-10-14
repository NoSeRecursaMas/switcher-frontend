import { describe, it, expect, beforeEach } from "vitest";
import { useRoomListStore } from "./roomListStore";
import { RoomDetails } from "../types/roomTypes";

describe("useRoomListStore", () => {

  beforeEach(() => {
    useRoomListStore.setState({ roomList: undefined, selectedRoomID: undefined });
  });

  it("should have initial state with roomList and selectedRoomID undefined", () => {
    const state = useRoomListStore.getState();
    expect(state.roomList).toBeUndefined();
    expect(state.selectedRoomID).toBeUndefined();
  });

  it("should set roomList correctly", () => {
    const roomList: RoomDetails[] = [{
        roomID: 1, roomName: "Room 1",
        maxPlayers: 4,
        actualPlayers: 2,
        started: false,
        private: false
    }];
    useRoomListStore.getState().setRoomList(roomList);
    const state = useRoomListStore.getState();
    expect(state.roomList).toEqual(roomList);
  });

  it("should select roomID correctly", () => {
    const roomID = 1;
    useRoomListStore.getState().selectRoomID(roomID);
    const state = useRoomListStore.getState();
    expect(state.selectedRoomID).toBe(roomID);
  });

  it("should deselect roomID correctly", () => {
    const roomID = 1;
    useRoomListStore.getState().selectRoomID(roomID);
    useRoomListStore.getState().deselectRoomID();
    const state = useRoomListStore.getState();
    expect(state.selectedRoomID).toBeUndefined();
  });
});