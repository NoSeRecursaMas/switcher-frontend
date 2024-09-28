import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RoomList from "./roomList";
import * as utils from "../../services/utils";
import { roomDetails } from "../../api/room/room-types";

let rooms: roomDetails[];

beforeEach(() => {
  import.meta.env.VITE_MOCK = "true";
  rooms = [
    {
      roomID: 1,
      roomName: "Sala de test",
      currentPlayers: 3,
      minPlayers: 2,
      maxPlayers: 4,
      private: false,
      started: false,
    },
    {
      roomID: 2,
      roomName: "Sala llena",
      currentPlayers: 4,
      minPlayers: 3,
      maxPlayers: 4,
      private: false,
      started: false,
    },
    {
      roomID: 3,
      roomName: "Sala privada",
      currentPlayers: 2,
      minPlayers: 2,
      maxPlayers: 4,
      private: true,
      started: false,
    },
    {
      roomID: 4,
      roomName: "Sala empezada",
      currentPlayers: 2,
      minPlayers: 2,
      maxPlayers: 4,
      private: false,
      started: true,
    },
  ];
});

afterEach(() => {
  cleanup();
});

describe("RoomList", () => {
  it("Al cargar el componente se refresca la lista de salas", () => {
    const refreshRoomList = vi.fn();
    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        refreshRoomList={refreshRoomList}
        rooms={[]}
      />
    );
    expect(refreshRoomList).toHaveBeenCalled();
  });

  it("Se muestra un mensaje personalizado si no hay salas", () => {
    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        refreshRoomList={() => null}
        rooms={[]}
      />
    );
    expect(screen.getByText("No hay salas disponibles")).toBeInTheDocument();
  });

  it("Se muestra un mensaje de carga si no se ha cargado el usuario", () => {
    render(
      <RoomList
        isUserLoaded={false}
        selectedRoom={1}
        setSelectedRoom={() => null}
        refreshRoomList={() => null}
        rooms={[]}
      />
    );
    expect(screen.getByText("Cargando salas...")).toBeInTheDocument();
  });

  it("Se muestra un mensaje de carga si no se han cargado las salas", () => {
    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        refreshRoomList={() => null}
        rooms={undefined}
      />
    );
    expect(screen.getByText("Cargando salas...")).toBeInTheDocument();
  });

  it("Se muestran las salas disponibles", () => {
    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        refreshRoomList={() => null}
        rooms={rooms}
      />
    );
    expect(screen.getByText("Sala de test")).toBeInTheDocument();
    expect(screen.getByText("Sala llena")).toBeInTheDocument();
    expect(screen.getByText("Sala privada")).toBeInTheDocument();
  });

  it("No se muestran las salas empezadas", () => {
    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        refreshRoomList={() => null}
        rooms={rooms}
      />
    );
    expect(screen.queryByText("Sala empezada")).not.toBeInTheDocument();
  });

  it("Se muestra el tag de sala privada/publica correctamente", () => {
    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        refreshRoomList={() => null}
        rooms={rooms}
      />
    );

    expect(
      screen.getByText("Sala de test").parentElement?.querySelector("span")
    ).toHaveTextContent("Pública");
    expect(
      screen.getByText("Sala privada").parentElement?.querySelector("span")
    ).toHaveTextContent("Privada");
  });

  it("El usuario no puede seleccionar una sala llena", async () => {
    const setSelectedRoom = vi.fn();
    const user = userEvent.setup();
    const sendToast = vi.spyOn(utils, "sendToast");

    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={1}
        setSelectedRoom={setSelectedRoom}
        refreshRoomList={() => null}
        rooms={rooms}
      />
    );
    await user.click(screen.getByText("Sala llena"));
    expect(sendToast).toHaveBeenCalledWith(
      "La sala está llena",
      "No puedes unirte a una que ya alcanzó su límite de jugadores",
      "warning"
    );
    expect(setSelectedRoom).not.toHaveBeenCalled();
  });

  it("El usuario puede seleccionar una sala no llena", async () => {
    const setSelectedRoom = vi.fn();
    const user = userEvent.setup();

    render(
      <RoomList
        isUserLoaded={true}
        selectedRoom={3}
        setSelectedRoom={setSelectedRoom}
        refreshRoomList={() => null}
        rooms={rooms}
      />
    );

    await user.click(screen.getByText("Sala de test"));
    expect(setSelectedRoom).toHaveBeenCalledWith(1);
  });
});
