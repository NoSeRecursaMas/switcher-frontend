import mockAdapter from "../mockAdapter";
import { CreatePlayerRequest } from "../../types/playerTypes";

export default function playerMock() {
  mockAdapter.onPost("mock/players").reply((config) => {
    const data = JSON.parse(config.data as string) as CreatePlayerRequest;
    if (data.username === "error") {
      return [
        422,
        {
          detail: [
            {
              type: "error",
              msg: "Ejemplo de error en el backend",
              input: "username",
            },
          ],
        },
      ];
    }
    const mockResponse = {
      playerID: Math.floor(Math.random() * 100),
      username: data.username,
    };
    return [201, mockResponse];
  });
}
