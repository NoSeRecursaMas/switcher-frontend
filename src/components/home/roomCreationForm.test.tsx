import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RoomCreationForm from "./roomCreationForm";
import * as roomEndpoints from "../../api/room/room-endpoints";
import { MemoryRouter as Router } from "react-router-dom";
import * as utils from "../../services/utils";
import { useNavigate } from "react-router-dom";
import { isErrorData } from "../../api/types";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  if (typeof actual === "object" && actual !== null) {
    return {
      ...actual,
      useNavigate: vi.fn(),
    };
  }
  return actual;
});

const useNavigateMock = vi.mocked(useNavigate);

beforeEach(() => {
  import.meta.env.VITE_MOCK = "true";
});

afterEach(() => {
  cleanup();
});

describe("RoomCreationForm", () => {
  it("El modal es visible al abrirse", () => {
    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );
    expect(screen.getByText("Crear partida")).toBeInTheDocument();
  });

  it("El modal no es visible al cerrarse", () => {
    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={false}
          onClose={() => null}
        />
      </Router>
    );
    expect(screen.queryByText("Crear partida")).not.toBeInTheDocument();
  });

  it("El modal se cierra al hacer click en el botón de cerrar", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={onClose}
        />
      </Router>
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("Se puede crear una sala y se muestra un mensaje de éxito", async () => {
    const sendToast = vi.spyOn(utils, "sendToast");
    const setRoomEndpoint = vi.spyOn(roomEndpoints, "setRoomEndpoint");
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la partida" }),
      "Sala de test"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores mínimos" }),
      "2"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores máximos" }),
      "4"
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(async () => {
      expect(setRoomEndpoint).toHaveBeenCalled();
      expect(sendToast).toHaveBeenCalledWith(
        "Partida creada con éxito",
        null,
        "success"
      );

      const data = (await setRoomEndpoint.mock.results[0].value) as
        | { roomID: number }
        | { detail: string; error: boolean };

      if (isErrorData(data)) {
        // Nunca debería pasar por aquí
        expect(true).toBe(false);
      } else {
        expect(navigateMock).toHaveBeenCalledWith(
          `/room/${data.roomID.toString()}`
        );
      }
    });
  });

  it("No se puede crear una sala con un nombre con más de 32 caracteres y se muestra un mensaje de error", async () => {
    const setRoomEndpoint = vi.spyOn(roomEndpoints, "setRoomEndpoint");

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la partida" }),
      "a".repeat(33)
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores mínimos" }),
      "2"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores máximos" }),
      "4"
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      screen.getByText("El nombre no puede tener más de 32 caracteres")
    ).toBeInTheDocument();
    expect(setRoomEndpoint).not.toHaveBeenCalled();
  });

  it("No se puede crear una sala con un nombre con caracteres no ASCII y se muestra un mensaje de error", async () => {
    const setRoomEndpoint = vi.spyOn(roomEndpoints, "setRoomEndpoint");

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la partida" }),
      "😀"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores mínimos" }),
      "2"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores máximos" }),
      "4"
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      screen.getByText("El nombre solo puede contener caracteres ASCII")
    ).toBeInTheDocument();
    expect(setRoomEndpoint).not.toHaveBeenCalled();
  });

  it("No se puede crear una sala con un número de jugadores mínimos mayor que el de jugadores máximos y se muestra un mensaje de error", async () => {
    const setRoomEndpoint = vi.spyOn(roomEndpoints, "setRoomEndpoint");

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la partida" }),
      "Sala de test"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores mínimos" }),
      "4"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores máximos" }),
      "2"
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      screen.getByText(
        "El mínimo de jugadores debe ser menor o igual al máximo"
      )
    ).toBeInTheDocument();
    expect(setRoomEndpoint).not.toHaveBeenCalled();
  });

  it("Se muestra un mensaje de error si el servidor devuelve un error", async () => {
    const sendToast = vi.spyOn(utils, "sendToast");
    const setRoomEndpoint = vi.spyOn(roomEndpoints, "setRoomEndpoint");
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la partida" }),
      "error"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores mínimos" }),
      "2"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores máximos" }),
      "4"
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(setRoomEndpoint).toHaveBeenCalled();
      expect(sendToast).toHaveBeenCalledWith(
        "Error al crear partida",
        "Ejemplo de error en el backend",
        "error"
      );
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it("Se muestra un mensaje de error si el servidor devuelve un error de id_inválida", async () => {
    const sendToast = vi.spyOn(utils, "sendToast");
    const setRoomEndpoint = vi.spyOn(roomEndpoints, "setRoomEndpoint");
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={true}
          user={{ id: 1, username: "test" }}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la partida" }),
      "id_invalida"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores mínimos" }),
      "2"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores máximos" }),
      "4"
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(setRoomEndpoint).toHaveBeenCalled();
      expect(sendToast).toHaveBeenCalledWith(
        "Error al crear partida",
        "No existe jugador con esa ID",
        "error"
      );
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it("Se muestra un mensaje de error si el usuario no está cargado", async () => {
    const sendToast = vi.spyOn(utils, "sendToast");
    const setRoomEndpoint = vi.spyOn(roomEndpoints, "setRoomEndpoint");
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          isUserLoaded={false}
          user={undefined}
          isOpen={true}
          onClose={() => null}
        />
      </Router>
    );

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la partida" }),
      "Sala de test"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores mínimos" }),
      "2"
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Jugadores máximos" }),
      "4"
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(setRoomEndpoint).not.toHaveBeenCalled();
    expect(sendToast).toHaveBeenCalledWith(
      "Error al crear partida",
      "No se pudo obtener tu usuario",
      "error"
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
