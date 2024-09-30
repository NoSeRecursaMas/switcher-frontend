import handleRequest from "./httpClient";
import { RoomDetails, CreateRoomRequest, RoomID } from "../types/roomTypes";
import { PlayerID } from "../types/playerTypes";


export const getRooms = async () => {
  return handleRequest<RoomDetails[]>("GET", null, "rooms", 200);
};

export const createRoom = async (data: CreateRoomRequest) => {
  return handleRequest<RoomID>("POST", data, "rooms", 201);
};

export const joinRoom = async (roomID: number, playerID: PlayerID) => {
  return handleRequest<RoomDetails>(
    "PUT",
    playerID,
    `rooms/${roomID.toString()}/join`,
    200
  );
};

export const leaveRoom = async (roomID: number, playerID: PlayerID) => {
  return handleRequest<RoomDetails>(
    "PUT",
    playerID,
    `rooms/${roomID.toString()}/leave`,
    200
  );
};
