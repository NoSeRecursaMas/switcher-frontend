import { describe, it, expect, afterEach, vi, beforeAll, afterAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RoomList from "./roomList";
import { server } from "../../mocks/node";

const rooms = [
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



describe("RoomList", () => {

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    cleanup();
  });

  it("Se muestra un mensaje personalizado si no hay salas", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoomID={1}
        handleSelectRoomID={() => null}
        rooms={[]}
      />
    );
    expect(screen.getByText("No hay salas disponibles")).toBeInTheDocument();
  });

  it("Se muestra un mensaje de carga si no se ha cargado el usuario", () => {
    render(
      <RoomList
        isPlayerLoaded={false}
        selectedRoomID={1}
        handleSelectRoomID={() => null}
        rooms={[]}
      />
    );
    expect(screen.getByText("Cargando salas...")).toBeInTheDocument();
  });

  it("Se muestra un mensaje de carga si no se han cargado las salas", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoomID={1}
        handleSelectRoomID={() => null}
        rooms={undefined}
      />
    );
    expect(screen.getByText("Cargando salas...")).toBeInTheDocument();
  });

  it("Se muestran las salas disponibles", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoomID={1}
        handleSelectRoomID={() => null}
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
        selectedRoomID={1}
        handleSelectRoomID={() => null}
        rooms={rooms}
      />
    );
    expect(screen.queryByText("Sala empezada")).not.toBeInTheDocument();
  });

  it("Se muestra el tag de sala privada/publica correctamente", () => {
    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoomID={1}
        handleSelectRoomID={() => null}
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

  it("Al hacer click sobre una sala, se llama a la función de selección de sala", async () => {
    const handleSelectRoomID = vi.fn();
    const user = userEvent.setup();

    render(
      <RoomList
        isPlayerLoaded={true}
        selectedRoomID={3}
        handleSelectRoomID={handleSelectRoomID}
        rooms={rooms}
      />
    );

    await user.click(screen.getByText("Sala de test"));
    expect(handleSelectRoomID).toHaveBeenCalledWith(1, 3, 4);
  });
});
