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
import Home from "./home";
import { useRoom } from "../hooks/useRoom";
import { useRoomList } from "../hooks/useRoomList";
import { usePlayer } from "../hooks/usePlayer";
import RoomCreationForm from "../components/home/roomCreationForm";
import RoomList from "../components/home/roomList";
import { server } from "../mocks/node";


vi.mock("../hooks/useRoom");
vi.mock("../hooks/useRoomList");
vi.mock("../hooks/usePlayer");
vi.mock("../components/home/roomCreationForm");
vi.mock("../components/home/roomList");

describe("Home", () => {
  const mockJoinRoom = vi.fn();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (useRoom as Mock).mockReturnValue({
      joinRoom: mockJoinRoom,
    });
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: 1,
    });
    (usePlayer as Mock).mockReturnValue({
      player: {
        playerID: 1,
        username: "Username Test",
      },
    });
    (RoomCreationForm as Mock).mockReturnValue(<div>RoomCreationFormMock</div>);
    (RoomList as Mock).mockReturnValue(<div>RoomListMock</div>);
  });

  afterEach(() => {
    cleanup();
  });

  it("Render the home component", () => {
    render(<Home />);
    // Check if hooks are called
    expect(usePlayer).toHaveBeenCalled();
    expect(useRoomList).toHaveBeenCalled();
    expect(useRoom).toHaveBeenCalled();

    // Check if the username is displayed
    expect(screen.getByText("Username Test")).toBeInTheDocument();

    // Check if the room creation form is rendered
    expect(screen.getByText("RoomCreationFormMock")).toBeInTheDocument();

    // Check if the room list is rendered
    expect(screen.getByText("RoomListMock")).toBeInTheDocument();

    // Check if the buttons are rendered
    expect(screen.getByLabelText("Create Room")).toBeInTheDocument();
    expect(screen.getByLabelText("Join Room")).toBeInTheDocument();
  });

  it("Join room button is disabled", () => {
    (useRoomList as Mock).mockReturnValue({
      selectedRoomID: undefined,
    });
    render(<Home />);
    expect(screen.getByLabelText("Join Room")).toBeDisabled();
  });

    it("Join room button is enabled", () => {
        (useRoomList as Mock).mockReturnValue({
        selectedRoomID: 1,
        });
        render(<Home />);
        expect(screen.getByLabelText("Join Room")).not.toBeDisabled();
    });
});
