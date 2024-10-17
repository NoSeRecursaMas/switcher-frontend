import {
  describe,
  it,
  expect,
  afterEach,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
  Mock,
} from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RoomList from "./roomList";
import { server } from "../../mocks/node";
import { useRoomList } from "../../hooks/useRoomList";
import { useRoomListWebSocket } from "../../hooks/useRoomListWebSocket";

vi.mock("../../hooks/useRoomList");
vi.mock("../../hooks/useRoomListWebSocket");

describe("RoomList", () => {
  const mockHandleSelectRoomID = vi.fn();

  const ROOMS = [
    {
      roomID: 1,
      roomName: "Sala de test",
      maxPlayers: 4,
      actualPlayers: 2,
      started: false,
      private: false,

    },
    {
      roomID: 2,
      roomName: "Sala llena",
      actualPlayers: 4,
      maxPlayers: 4,
      private: false,
      started: false,
    },
    {
      roomID: 3,
      roomName: "Sala privada",
      actualPlayers: 2,
      maxPlayers: 4,
      private: true,
      started: false,
    },
    {
      roomID: 4,
      roomName: "Sala empezada",
      actualPlayers: 2,
      maxPlayers: 4,
      private: false,
      started: true,
    },
  ];

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (useRoomList as Mock).mockReturnValue({
      roomList: ROOMS,
      selectedRoomID: undefined,
      handleSelectRoomID: mockHandleSelectRoomID,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("Se muestra un mensaje personalizado si no hay salas", () => {
    (useRoomList as Mock).mockReturnValue({
      roomList: [],
      selectedRoomID: undefined,
      handleSelectRoomID: mockHandleSelectRoomID,
    });
    render(<RoomList />);
    expect(screen.getByText("No hay salas disponibles")).toBeInTheDocument();
  });

  it("Se muestra un mensaje de carga si no se han cargado las salas", () => {
    (useRoomList as Mock).mockReturnValue({
      roomList: undefined,
      selectedRoomID: undefined,
      handleSelectRoomID: mockHandleSelectRoomID,
    });
    render(<RoomList />);
    expect(screen.getByText("Cargando salas...")).toBeInTheDocument();
  });

  it("Se muestran las salas disponibles", () => {
    render(<RoomList />);
    expect(screen.getByText("Sala de test")).toBeInTheDocument();
    expect(screen.getByText("Sala llena")).toBeInTheDocument();
    expect(screen.getByText("Sala privada")).toBeInTheDocument();
  });

  it("No se muestran las salas empezadas", () => {
    render(<RoomList />);
    expect(screen.queryByText("Sala empezada")).not.toBeInTheDocument();
  });

  it("Se muestra el tag de sala privada/publica correctamente", () => {
    render(<RoomList />);

    expect(
      screen.getByText("Sala de test").parentElement?.querySelector("span")
    ).toHaveTextContent("Pública");
    expect(
      screen.getByText("Sala privada").parentElement?.querySelector("span")
    ).toHaveTextContent("Privada");
  });

  it("Se usa el hook de websockets para actualizar las salas", () => {
    render(<RoomList />);
    expect(useRoomListWebSocket).toHaveBeenCalled();
  });

  it("Al hacer click sobre una sala, se llama a la función de selección de sala", async () => {
    const user = userEvent.setup();

    render(<RoomList />);

    await user.click(screen.getByText("Sala de test"));
    expect(mockHandleSelectRoomID).toHaveBeenCalledWith(1);
  });

  it("El color de fondo cambia al ser la sala seleccionada", () => {
    (useRoomList as Mock).mockReturnValue({
      roomList: ROOMS,
      selectedRoomID: 1,
      handleSelectRoomID: mockHandleSelectRoomID,
    });

    render(<RoomList />);
    expect(screen.getByText("Sala de test")).toHaveStyle("background: teal.100");
  });

  it("Si todas las salas estan iniciadas, se muestra un mensaje personalizado", () => {
    const startedRooms = ROOMS.map((room) => ({ ...room, started: true }));
    (useRoomList as Mock).mockReturnValue({
      roomList: startedRooms,
      selectedRoomID: undefined,
      handleSelectRoomID: mockHandleSelectRoomID,
    });

    render(<RoomList />);
    expect(screen.getByText("No hay salas disponibles")).toBeInTheDocument();
  });
});
