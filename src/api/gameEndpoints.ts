import handleRequest from "./httpClient";
import { PlayerID } from "../types/playerTypes";

export const startGame = async (roomID: number, playerID: PlayerID) => {
  return handleRequest("POST", playerID, `games/${roomID.toString()}`, 201);
};

export const turn = async (gameID: number, playerID: PlayerID) => {
  return handleRequest("PUT", playerID, `games/${gameID.toString()}/turn`, 200);
};

export const leaveGame = async (gameID: number, playerID: PlayerID) => {
  return handleRequest("PUT", playerID, `games/${gameID.toString()}/leave`, 200);
}