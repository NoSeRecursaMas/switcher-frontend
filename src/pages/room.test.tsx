import {
  describe,
  it,
  expect,
  afterEach,
  vi,
  beforeEach,
  Mock,
  beforeAll,
  afterAll,
} from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Room from "./room";
import { useRoom } from "../hooks/useRoom";
import { useGame } from "../hooks/useGame";
import { useRoomWebSocket } from "../hooks/useRoomWebSocket";

import RoomData from "../components/room/roomData";
import { server } from "../mocks/node";
import { startGame } from "../api/gameEndpoints";

vi.mock("../hooks/useRoom");
vi.mock("../hooks/useRoomWebSocket");
vi.mock("../components/room/roomData");
vi.mock("../hooks/useGame");

describe("Room", () => {
  const mockLeaveRoom = vi.fn();
  const room = {
    roomID: 1,
    hostID: 2,
    roomName: "Room Test",
    maxPlayers: 4,
    minPlayers: 2,
    players: [
      { playerID: 1, username: "Player 1" },
      { playerID: 2, username: "Player 2" },
    ],
  };

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (useRoom as Mock).mockReturnValue({
      leaveRoom: mockLeaveRoom,
      room: room,
    });
    (RoomData as Mock).mockReturnValue(<div>RoomDataMock</div>);
    (useGame as Mock).mockReturnValue({
      startGame: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("Render the room component", () => {
    render(<Room />);
    // Check if hooks are called
    expect(useRoom).toHaveBeenCalled();
    expect(useRoomWebSocket).toHaveBeenCalled();

    // Check if the buttons are rendered
    expect(screen.getByText("Abandonar sala")).toBeInTheDocument();

    // Check if the room data is rendered
    expect(screen.getByText("RoomDataMock")).toBeInTheDocument();    
  });
});
