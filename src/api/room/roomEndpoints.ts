import handleRequest from "../httpClient";
import { ErrorResponse } from "../types";
import { RoomDetails, CreateRoomRequest, RoomID } from "../../types/roomTypes";
import { PlayerID } from "../../types/playerTypes";
import roomMock from "./roomEndpoints.mock";

roomMock();

export const createRoomEndpoint = async (
  data: CreateRoomRequest
): Promise<RoomID | ErrorResponse> => {
  return handleRequest<RoomID>("POST", data, "rooms", 201);
};

export const getRooms = async (): Promise<RoomDetails[] | ErrorResponse> => {
  return handleRequest<RoomDetails[]>("GET", null, "rooms", 200);
};

export const joinRoom = async (roomID: number, playerID: PlayerID): Promise<RoomDetails | ErrorResponse> => {
  return handleRequest<RoomDetails>("PUT", playerID, `rooms/${roomID.toString()}/join`, 200);
}
