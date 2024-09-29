import handleRequest from "../httpClient";
import { ErrorResponse } from "../types";
import { CreatePlayerRequest, Player } from "../../types/playerTypes";
import playerMock from "./playerEndpoints.mock";

playerMock();

export const createPlayer = async (
  data: CreatePlayerRequest
): Promise<Player | ErrorResponse> => {
  return handleRequest<Player>("POST", data, "players", 201);
};
