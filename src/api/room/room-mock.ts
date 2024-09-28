import mockAdapter from "../mock-adapter";
import { createRoomRequest } from "./room-types";

const roomMock = () => {
  mockAdapter.onPost("mock/rooms").reply((config) => {
    const data = JSON.parse(config.data as string) as createRoomRequest;
    const roomName = data.roomName;
    if (roomName === "error") {
      return [400, { detail: "Ejemplo de error en el backend" }];
    }
    if (roomName === "id_invalida") {
      return [404, { detail: "No existe jugador con esa ID" }];
    }
    const mockResponse = {
      roomID: Math.floor(Math.random() * 100),
    };

    return [201, mockResponse];
  });

  mockAdapter.onGet("mock/rooms").reply(() => {
    const mockResponse = [
      {
        roomID: 1,
        roomName: "Sala 1",
        minPlayers: 2,
        maxPlayers: 4,
        currentPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 2,
        roomName: "Sala 2",
        minPlayers: 3,
        maxPlayers: 4,
        currentPlayers: 3,
        started: false,
        private: true,
      },
      {
        roomID: 3,
        roomName: "Somebody once told me",
        minPlayers: 2,
        maxPlayers: 2,
        currentPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 4,
        roomName: "the world is gonna roll me",
        minPlayers: 2,
        maxPlayers: 4,
        currentPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 5,
        roomName: ".",
        minPlayers: 3,
        maxPlayers: 4,
        currentPlayers: 3,
        started: false,
        private: true,
      },
      {
        roomID: 6,
        roomName: "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        minPlayers: 2,
        maxPlayers: 4,
        currentPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 7,
        roomName: "SALA EMPEZADA",
        minPlayers: 2,
        maxPlayers: 4,
        currentPlayers: 2,
        started: true,
        private: false,
      },
      {
        roomID: 8,
        roomName: "Sala llena",
        minPlayers: 3,
        maxPlayers: 4,
        currentPlayers: 4,
        started: false,
        private: false,
      },
      {
        roomID: 9,
        roomName: "OwO",
        minPlayers: 2,
        maxPlayers: 3,
        currentPlayers: 2,
        started: false,
        private: false,
      },
    ];

    // return [200, []]; // Testear caso de que no haya rooms
    // return [400, { detail: "Ejemplo de error en el backend" }]; // Testear caso de error en el backend
    return [200, mockResponse];
  });
};

export default roomMock;
