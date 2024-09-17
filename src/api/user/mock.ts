import mockAdapter from "../mockAdapter";
import { setUserRequest } from "./types";

if (import.meta.env.VITE_MOCK === "true") {
  mockAdapter.onPost("players").reply((config) => {
    const data = JSON.parse(config.data as string) as setUserRequest;
    const username = data.username;

    return [
      201,
      {
        playerID: Math.floor(Math.random() * 100),
        username: username,
      },
    ];
  });
}
