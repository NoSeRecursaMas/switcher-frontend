import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PlayerCreationForm from "./playerCreationForm";
import * as playerEndpoints from "../../api/player/playerEndpoints";
import * as utils from "../../services/utils";
import { usePlayerStore } from "../../store/playerStore";

beforeEach(() => {
  import.meta.env.VITE_MOCK = "true";
});

afterEach(() => {
  act(() => {
    usePlayerStore.setState({ player: undefined });
  });
  cleanup();
});

describe("PlayerCreationForm", () => {
  it("El modal es visible cuando el usuario no está cargado", () => {
    render(<PlayerCreationForm isPlayerLoaded={false} />);
    expect(screen.getByText("Elige tu nombre")).toBeInTheDocument();
  });

  it("El modal no es visible cuando el usuario está cargado", () => {
    render(<PlayerCreationForm isPlayerLoaded={true} />);
    expect(screen.queryByText("Elige tu nombre")).not.toBeInTheDocument();
  });

  it("Se puede seleccionar un nombre de usuario y se muestra un mensaje de éxito", async () => {
    const createPlayer = vi.spyOn(playerEndpoints, "createPlayer");
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), "Usuario de test");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(createPlayer).toHaveBeenCalledWith({
        username: "Usuario de test",
      });
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
      expect(usePlayerStore.getState().player?.username).toEqual(
        "Usuario de test"
      );
    });
  });

  it("No se puede seleccionar un nombre con más de 32 caracteres y se muestra un mensaje de error", async () => {
    const createPlayer = vi.spyOn(playerEndpoints, "createPlayer");
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), "a".repeat(33));
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(
        screen.getByText("El nombre no puede tener más de 32 caracteres")
      ).toBeInTheDocument();
      expect(createPlayer).not.toHaveBeenCalled();
      expect(usePlayerStore.getState().player).toBeUndefined();
    });
  });

  it("No se puede seleccionar un nombre con caracteres no ASCII y se muestra un mensaje de error", async () => {
    const createPlayer = vi.spyOn(playerEndpoints, "createPlayer");
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), "😀");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(
        screen.getByText("El nombre solo puede contener caracteres ASCII")
      ).toBeInTheDocument();
      expect(createPlayer).not.toHaveBeenCalled();
      expect(usePlayerStore.getState().player).toBeUndefined();
    });
  });

  it("Se muestra un mensaje de error si el servidor devuelve un error", async () => {
    const sendErrorToast = vi.spyOn(utils, "sendErrorToast");
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), "error");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(sendErrorToast).toHaveBeenCalledWith(
        {
          status: 422,
          detail: [{
            msg: "Ejemplo de error en el backend",
            type: "error",
            input: "username",
          }],
        },
        "Error al seleccionar nombre"
      );
      expect(usePlayerStore.getState().player).toBeUndefined();
    });
  });

  it("Se puede seleccionar un nombre de usuario con 1 solo caracter", async () => {
    const createPlayer = vi.spyOn(playerEndpoints, "createPlayer");
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), "a");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(createPlayer).toHaveBeenCalledWith({ username: "a" });
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
      expect(usePlayerStore.getState().player?.username).toEqual("a");
    });
  });

  it("Se puede seleccionar un nombre de usuario con 32 caracteres", async () => {
    const createPlayer = vi.spyOn(playerEndpoints, "createPlayer");
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), "a".repeat(32));
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(createPlayer).toHaveBeenCalledWith({ username: "a".repeat(32) });
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
      expect(usePlayerStore.getState().player?.username).toEqual(
        "a".repeat(32)
      );
    });
  });

  it("Se puede seleccionar un nombre de usuario con muchos espacios al inicio/final y se remueven", async () => {
    const createPlayer = vi.spyOn(playerEndpoints, "createPlayer");
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(
      screen.getByRole("textbox"),
      "                  Usuario de test              "
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(createPlayer).toHaveBeenCalledWith({
        username: "Usuario de test",
      });
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
      expect(usePlayerStore.getState().player?.username).toEqual(
        "Usuario de test"
      );
    });
  });
});
