import mockAdapter from "../mockAdapter";
import { loadUserRequest } from "./userTypes";

const userMock = (isTest = false) => {
  if (import.meta.env.VITE_MOCK === "true" || isTest) {
    mockAdapter.onPost("players").reply((config) => {
      const data = JSON.parse(config.data as string) as loadUserRequest;
      const username = data.username;

      const mockResponse = {
        playerID: Math.floor(Math.random() * 100),
        username: username,
      };

      return [201, mockResponse];
    });
  }
};

export default userMock;