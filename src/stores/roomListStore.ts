import { create } from "zustand";
import { RoomDetails } from "../types/roomTypes";

interface RoomListState {
  roomList: RoomDetails[] | undefined;
  setRoomList: (roomList: RoomDetails[]) => void;
  selectedRoomID: number | undefined;
  selectRoomID: (roomID: number) => void;
  deselectRoomID: () => void;
}

export const useRoomListStore = create<RoomListState>((set) => ({
  roomList: undefined,
  setRoomList: (roomList: RoomDetails[] | undefined) => {
    set({ roomList });
  },
  selectedRoomID: undefined,
  selectRoomID: (roomID: number) => {
    set({ selectedRoomID: roomID });
  },
  deselectRoomID: () => {
    set({ selectedRoomID: undefined });
  },
}));
