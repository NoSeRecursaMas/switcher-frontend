import mockAdapter from "../mock-adapter";
import { CreatePlayerRequest } from "../../types/playerTypes";

export default function playerMock() {
  mockAdapter.onPost("mock/players").reply((config) => {
    const data = JSON.parse(config.data as string) as CreatePlayerRequest;
    const mockResponse = {
      playerID: Math.floor(Math.random() * 100),
      username: data.username,
    };
    return [201, mockResponse];
  });
};
