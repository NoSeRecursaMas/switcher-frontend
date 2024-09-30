import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RoomList from "./roomList";
import * as utils from "../../services/utils";
import { RoomDetails } from "../../types/roomTypes";

let rooms: RoomDetails[];

beforeEach(() => {
  import.meta.env.VITE_MOCK = "true";
  rooms = [
    {
      roomID: 1,
      roomName: "Sala de test",
      actualPlayers: 3,
      maxPlayers: 4,
      private: false,
      started: false,
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
});

afterEach(() => {
  cleanup();
});

describe("RoomList", () => {
  it("Se muestra un mensaje personalizado si no hay salas", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        rooms={[]}
      />
    );
    expect(screen.getByText("No hay salas disponibles")).toBeInTheDocument();
  });

  it("Se muestra un mensaje de carga si no se ha cargado el usuario", () => {
    render(
      <RoomList
        isPlayerLoaded={false}
        selectedRoom={1}
        setSelectedRoom={() => null}
        rooms={[]}
      />
    );
    expect(screen.getByText("Cargando salas...")).toBeInTheDocument();
  });

  it("Se muestra un mensaje de carga si no se han cargado las salas", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        rooms={undefined}
      />
    );
    expect(screen.getByText("Cargando salas...")).toBeInTheDocument();
  });

  it("Se muestran las salas disponibles", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
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
        isPlayerLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
        rooms={rooms}
      />
    );
    expect(screen.queryByText("Sala empezada")).not.toBeInTheDocument();
  });

  it("Se muestra el tag de sala privada/publica correctamente", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoom={1}
        setSelectedRoom={() => null}
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
        isPlayerLoaded={true}
        selectedRoom={1}
        setSelectedRoom={setSelectedRoom}
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
        isPlayerLoaded={true}
        selectedRoom={3}
        setSelectedRoom={setSelectedRoom}
        rooms={rooms}
      />
    );

    await user.click(screen.getByText("Sala de test"));
    expect(setSelectedRoom).toHaveBeenCalledWith(1);
  });
});
