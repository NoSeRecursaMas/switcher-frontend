import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RoomCreationForm from "./roomCreationForm";
import * as roomEndpoints from "../../api/room/roomEndpoints";
import { MemoryRouter as Router } from "react-router-dom";
import * as utils from "../../services/utils";
import { useNavigate } from "react-router-dom";
import { ErrorResponse, isErrorDetail } from "../../api/types";
import { RoomID } from "../../types/roomTypes";

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
          player={{ playerID: 1, username: "test" }}
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
          player={{ playerID: 1, username: "test" }}
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
          player={{ playerID: 1, username: "test" }}
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
    const createRoomEndpoint = vi.spyOn(roomEndpoints, "createRoomEndpoint");
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          player={{ playerID: 1, username: "test" }}
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
      expect(createRoomEndpoint).toHaveBeenCalledWith({
        playerID: 1,
        roomName: "Sala de test",
        minPlayers: 2,
        maxPlayers: 4,
      });
      expect(sendToast).toHaveBeenCalledWith(
        "Partida creada con éxito",
        null,
        "success"
      );

      const data = (await createRoomEndpoint.mock.results[0].value) as
        | RoomID
        | ErrorResponse;

      if (isErrorDetail(data)) {
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
    const createRoomEndpoint = vi.spyOn(roomEndpoints, "createRoomEndpoint");
    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          player={{ playerID: 1, username: "test" }}
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
    expect(createRoomEndpoint).not.toHaveBeenCalled();
  });

  it("No se puede crear una sala con un nombre con caracteres no ASCII y se muestra un mensaje de error", async () => {
    const createRoomEndpoint = vi.spyOn(roomEndpoints, "createRoomEndpoint");
    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          player={{ playerID: 1, username: "test" }}
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
    expect(createRoomEndpoint).not.toHaveBeenCalled();
  });

  it("No se puede crear una sala con un número de jugadores mínimos mayor que el de jugadores máximos y se muestra un mensaje de error", async () => {
    const createRoomEndpoint = vi.spyOn(roomEndpoints, "createRoomEndpoint");
    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          player={{ playerID: 1, username: "test" }}
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
    expect(createRoomEndpoint).not.toHaveBeenCalled();
  });

  it("Se muestra un mensaje de error si el servidor devuelve un error", async () => {
    const sendErrorToast = vi.spyOn(utils, "sendErrorToast");
    const createRoomEndpoint = vi.spyOn(roomEndpoints, "createRoomEndpoint");
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          player={{ playerID: 1, username: "test" }}
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
      expect(createRoomEndpoint).toHaveBeenCalled();
      expect(sendErrorToast).toHaveBeenCalledWith(
        {
          status: 422,
          detail: [
            {
              msg: "Ejemplo de error en el backend",
              type: "error",
              input: "roomName",
            },
          ],
        },
        "Error al crear partida"
      );
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it("Se muestra un mensaje de error si el usuario no está cargado", async () => {
    const sendToast = vi.spyOn(utils, "sendToast");
    const createRoomEndpoint = vi.spyOn(roomEndpoints, "createRoomEndpoint");
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const user = userEvent.setup();

    render(
      <Router>
        <RoomCreationForm
          player={undefined}
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

    expect(createRoomEndpoint).not.toHaveBeenCalledWith();
    expect(sendToast).toHaveBeenCalledWith(
      "Error al crear partida",
      "No se pudo obtener tu usuario",
      "error"
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
