import mockAdapter from "../mock-adapter";
import { CreateRoomRequest } from "../../types/roomTypes";

const roomMock = () => {
  mockAdapter.onPost("mock/rooms").reply((config) => {
    const data = JSON.parse(config.data as string) as CreateRoomRequest;
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
        maxPlayers: 4,
        actualPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 2,
        roomName: "Sala 2",
        maxPlayers: 4,
        actualPlayers: 3,
        started: false,
        private: true,
      },
      {
        roomID: 3,
        roomName: "Somebody once told me",
        maxPlayers: 2,
        actualPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 4,
        roomName: "the world is gonna roll me",
        maxPlayers: 4,
        actualPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 5,
        roomName: ".",
        maxPlayers: 4,
        actualPlayers: 3,
        started: false,
        private: true,
      },
      {
        roomID: 6,
        roomName: "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
        maxPlayers: 4,
        actualPlayers: 2,
        started: false,
        private: false,
      },
      {
        roomID: 7,
        roomName: "SALA EMPEZADA",
        maxPlayers: 4,
        actualPlayers: 2,
        started: true,
        private: false,
      },
      {
        roomID: 8,
        roomName: "Sala llena",
        maxPlayers: 4,
        actualPlayers: 4,
        started: false,
        private: false,
      },
      {
        roomID: 9,
        roomName: "OwO",
        maxPlayers: 3,
        actualPlayers: 2,
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
