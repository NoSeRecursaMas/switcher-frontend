import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomData from "./roomData";
import Room from "../../types/roomTypes";

let room: Room;

beforeEach(() => {
  import.meta.env.VITE_MOCK = "true";
  room = {
    roomID: 1,
    roomName: "Sala de test",
    hostID: 1,
    minPlayers: 2,
    maxPlayers: 4,
    players: [
      {
        playerID: 1,
        username: "Player1",
      },
      {
        playerID: 2,
        username: "Player2",
      },
    ],
  };
});

afterEach(() => {
  cleanup();
});

describe("RoomData", () => {
  it("Muestra el nombre de la sala", () => {
    render(<RoomData room={room} />);
    expect(screen.getByText("Sala de test")).toBeInTheDocument();
  });

  it("Muestra el número de jugadores", () => {
    render(<RoomData room={room} />);
    expect(
      screen.getByText("Mínimo de jugadores: 2", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Máximo de jugadores: 4", { exact: false })
    ).toBeInTheDocument();
  });

  it("Muestra los jugadores de la sala", () => {
    render(<RoomData room={room} />);
    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
  });

  it("Muestra una estrella al lado del creador de la sala", () => {
    render(<RoomData room={room} />);
    expect(
      screen.getByText("Player1").parentElement?.querySelector("svg")
    ).toBeInTheDocument();
  });
});