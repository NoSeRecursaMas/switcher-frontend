import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CreateUserForm from "./createUserForm";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import userMock from "../../api/user/user-mock";
import * as userEndpoints from "../../api/user/user-endpoints";
import * as utils from "../../services/utils";
import UserProvider from "../../context/userContextProvider";
import { UserContext } from "../../context/user-context";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

beforeEach(() => {
  import.meta.env.VITE_MOCK = "true";
});

afterEach(() => {
  cleanup();
});

describe("CreateUserForm", () => {
  it("El modal es visible cuando el usuario no está cargado", () => {
    render(<CreateUserForm isUserLoaded={false} setUser={() => null} />);
    expect(screen.getByText("Elige tu nombre")).toBeInTheDocument();
  });

  it("El modal no es visible cuando el usuario está cargado", () => {
    render(<CreateUserForm isUserLoaded={true} setUser={() => null} />);
    expect(screen.queryByText("Elige tu nombre")).not.toBeInTheDocument();
  });

  it("Se puede seleccionar un nombre de usuario y se muestra un mensaje de éxito", async () => {
    const setUser = vi.fn();
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={setUser} />);

    await user.type(screen.getByRole("textbox"), "Usuario de test");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(setUser).toHaveBeenCalled();
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
    });
  });

  it("No se puede seleccionar un nombre con más de 32 caracteres y se muestra un mensaje de error", async () => {
    const setUser = vi.fn();
    const createUser = vi.spyOn(userEndpoints, "createUser");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={setUser} />);

    await user.type(screen.getByRole("textbox"), "a".repeat(33));
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(
        screen.getByText("El nombre no puede tener más de 32 caracteres")
      ).toBeInTheDocument();
      expect(createUser).not.toHaveBeenCalled();
    });
  });

  it("No se puede seleccionar un nombre vacío y se muestra un mensaje de error", async () => {
    const setUser = vi.fn();
    const createUser = vi.spyOn(userEndpoints, "createUser");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={setUser} />);

    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(
        screen.getByText("El nombre no puede estar vacío")
      ).toBeInTheDocument();
      expect(createUser).not.toHaveBeenCalled();
    });
  });

  it("No se puede seleccionar un nombre con caracteres no ASCII y se muestra un mensaje de error", async () => {
    const setUser = vi.fn();
    const createUser = vi.spyOn(userEndpoints, "createUser");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={setUser} />);

    await user.type(screen.getByRole("textbox"), "😀");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(
        screen.getByText("El nombre solo puede contener caracteres ASCII")
      ).toBeInTheDocument();
      expect(createUser).not.toHaveBeenCalled();
    });
  });

  it("Se muestra un mensaje de error si el servidor devuelve un error", async () => {
    const setUser = vi.fn();
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={setUser} />);

    await user.type(screen.getByRole("textbox"), "error");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(sendToast).toHaveBeenCalledWith(
        "Error al seleccionar nombre",
        "Ejemplo de error en el backend",
        "error"
      );
    });
  });

  it("Se puede seleccionar un nombre de usuario con 1 solo caracter", async () => {
    const setUser = vi.fn();
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={setUser} />);

    await user.type(screen.getByRole("textbox"), "a");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(setUser).toHaveBeenCalled();
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
    });
  });

  it("Se puede seleccionar un nombre de usuario con 32 caracteres", async () => {
    const setUser = vi.fn();
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={setUser} />);

    await user.type(screen.getByRole("textbox"), "a".repeat(32));
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(setUser).toHaveBeenCalled();
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
    });
  });

  it("Se puede seleccionar un nombre de usuario con muchos espacios al inicio/final y se remueven", async () => {
    const createUser = vi.spyOn(userEndpoints, "createUser");
    const sendToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(<CreateUserForm isUserLoaded={false} setUser={() => null} />);

    await user.type(
      screen.getByRole("textbox"),
      "                  Usuario de test              "
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith("Usuario de test");
      expect(sendToast).toHaveBeenCalledWith(
        "¡Nombre seleccionado con éxito!",
        null,
        "success"
      );
    });
  });
});
