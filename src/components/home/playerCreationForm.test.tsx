import { describe, it, expect, afterEach, vi, beforeEach, Mock, beforeAll, afterAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PlayerCreationForm from "./playerCreationForm";
import { usePlayer } from "../../hooks/usePlayer";
import { server } from "../../mocks/node";

vi.mock("../../hooks/usePlayer");

describe("PlayerCreationForm", () => {
  const mockCreatePlayer = vi.fn();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (usePlayer as Mock).mockReturnValue({
      createPlayer: mockCreatePlayer,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("El modal es visible cuando el usuario no está cargado", () => {
    render(<PlayerCreationForm isPlayerLoaded={false} />);
    expect(screen.getByText("Elige tu nombre")).toBeInTheDocument();
  });

  it("El modal no es visible cuando el usuario está cargado", () => {
    render(<PlayerCreationForm isPlayerLoaded={true} />);
    expect(screen.queryByText("Elige tu nombre")).not.toBeInTheDocument();
  });

  it("Se puede seleccionar un nombre de usuario y se llama a la función de creación", async () => {
    const user = userEvent.setup();
    const username = "Usuario de test";

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), username);
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username);
  });

  it("No se puede seleccionar un nombre con más de 32 caracteres y se muestra un mensaje de error", async () => {
    const user = userEvent.setup();
    const username = "a".repeat(33);

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), username);
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      screen.getByText("El nombre no puede tener más de 32 caracteres")
    ).toBeInTheDocument();
    expect(mockCreatePlayer).not.toHaveBeenCalled();
  });

  it("No se puede seleccionar un nombre con caracteres no ASCII y se muestra un mensaje de error", async () => {
    const user = userEvent.setup();

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), "😀");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      screen.getByText("El nombre solo puede contener caracteres ASCII")
    ).toBeInTheDocument();
    expect(mockCreatePlayer).not.toHaveBeenCalled();
  });

  it("Se puede seleccionar un nombre de usuario con 1 solo caracter", async () => {
    const user = userEvent.setup();
    const username = "a";

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), username);
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username);
  });

  it("Se puede seleccionar un nombre de usuario con 32 caracteres", async () => {
    const user = userEvent.setup();
    const username = "a".repeat(32);

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), username);
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username);
  });

  it("Se puede seleccionar un nombre de usuario con muchos espacios al inicio/final y se remueven", async () => {
    const user = userEvent.setup();
    const username = "                  Usuario de test              ";

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), username);
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username.trim());
  });

  it("No se puede seleccionar un nombre de usuario con solo espacios y se muestra un mensaje de error", async () => {
    const user = userEvent.setup();
    const username = "                  ";

    render(<PlayerCreationForm isPlayerLoaded={false} />);

    await user.type(screen.getByRole("textbox"), username);
    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(
      screen.getByText("El nombre no puede estar vacío")
    ).toBeInTheDocument();
    expect(mockCreatePlayer).not.toHaveBeenCalled();
  });
});
