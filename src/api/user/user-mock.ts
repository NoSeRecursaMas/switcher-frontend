import mockAdapter from "../mock-adapter";
import { loadUserRequest } from "./user-types";

const userMock = (isTest = false) => {
  if (import.meta.env.VITE_MOCK === "true" || isTest) {
    mockAdapter.onPost("players").reply((config) => {
      const data = JSON.parse(config.data as string) as loadUserRequest;
      const username = data.username;
      if (username === "error") {
        return [400, { detail: "Ejemplo de error en el backend" }];
      }
      const mockResponse = {
        playerID: Math.floor(Math.random() * 100),
        username: username,
      };

      return [201, mockResponse];
    });
  }
};

export default userMock;
