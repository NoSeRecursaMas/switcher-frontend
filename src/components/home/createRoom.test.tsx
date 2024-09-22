import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import Home from "../../pages/home";
import MockAdapter from "axios-mock-adapter";
import roomMock from "../../api/room/room-mock";
import axios from "axios";
import * as utils from "../../services/utils";
import * as roomEndpoints from "../../api/room/room-endpoints";

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(axios, { onNoMatch: "throwException" });
});

afterEach(() => {
  cleanup();
  mock.restore();
});

describe("CreateRoom", () => {
  it("Abre el modal cuando se aprieta el botón y se puede cerrar", async () => {
    render(
      <Router>
        <UserContext.Provider
          value={{
            user: { id: 1, username: "Nombre test" },
            setUser: () => null,
            isUserLoaded: true,
          }}
        >
          <Home />
        </UserContext.Provider>
      </Router>
    );

    // El botón de crear partida debería estar presente
    expect(screen.getByText("Crear partida")).toBeDefined();

    // El modal no debería estar presente
    expect(screen.queryByText("Creación de partida")).toBeNull();

    // Se aprieta el botón de crear partida y el modal debería aparecer
    fireEvent.click(screen.getByRole("button", { name: "Crear partida" }));

    await waitFor(() => {
      expect(screen.getByText("Creación de partida")).toBeDefined();
    });

    // Se aprieta el botón X y el modal debería desaparecer
    fireEvent.click(screen.getByLabelText("Close"));

    await waitFor(() => {
      expect(screen.queryByText("Creación de partida")).toBeNull();
    });

    // Se aprieta el botón de crear partida de vuelta y el modal debería aparecer
    fireEvent.click(screen.getByRole("button", { name: "Crear partida" }));

    await waitFor(() => {
      expect(screen.getByText("Creación de partida")).toBeDefined();
    });

    // Se aprieta el segundo botón para cerrar y el modal debería desaparecer
    fireEvent.click(screen.getByText("Cancelar"));

    await waitFor(() => {
      expect(screen.queryByText("Creación de partida")).toBeNull();
    });
  });

  it("Se crea una partida con los datos correctos", async () => {
    const spy = vi.spyOn(roomEndpoints, "setRoomEndpoint");
    const spyToast = vi.spyOn(utils, "sendToast");

    roomMock(true);

    render(
      <Router>
        <UserContext.Provider
          value={{
            user: { id: 1, username: "Nombre test" },
            setUser: () => null,
            isUserLoaded: true,
          }}
        >
          <Home />
        </UserContext.Provider>
      </Router>
    );

    // Se aprieta el botón de crear partida
    fireEvent.click(screen.getByRole("button", { name: "Crear partida" }));

    // Se llena el formulario con los datos correctos
    fireEvent.change(
      screen.getByLabelText("Nombre de la sala", { exact: false }),
      { target: { value: "Sala de prueba" } }
    );
    fireEvent.change(
      screen.getByLabelText("Mínimo de jugadores", { exact: false }),
      { target: { value: "2" } }
    );
    fireEvent.change(
      screen.getByLabelText("Máximo de jugadores", { exact: false }),
      { target: { value: "4" } }
    );

    // Se aprieta el botón de aceptar
    fireEvent.click(screen.getByText("Aceptar"));

    // Se debería haber llamado a la función de crear sala
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    // Se debería haber mostrado un toast de éxito
    await waitFor(() => {
      expect(spyToast).toHaveBeenCalledWith(
        "Sala creada exitosamente",
        null,
        "success"
      );
    });
  });

  it("Muestra error cuando el nombre es demasiado largo", async () => {
    render(
      <Router>
        <UserContext.Provider
          value={{
            user: { id: 1, username: "Nombre test" },
            setUser: () => null,
            isUserLoaded: true,
          }}
        >
          <Home />
        </UserContext.Provider>
      </Router>
    );

    // Se aprieta el botón de crear partida
    fireEvent.click(screen.getByRole("button", { name: "Crear partida" }));

    // Se llena el formulario con un nombre demasiado largo
    fireEvent.change(
      screen.getByLabelText("Nombre de la sala", { exact: false }),
      { target: { value: "a".repeat(33) } }
    );

    // Se ponen los jugadores mínimos y máximos
    fireEvent.change(
      screen.getByLabelText("Mínimo de jugadores", { exact: false }),
      { target: { value: "2" } }
    );
    fireEvent.change(
      screen.getByLabelText("Máximo de jugadores", { exact: false }),
      { target: { value: "4" } }
    );

    // Se aprieta el botón de aceptar
    fireEvent.click(screen.getByText("Aceptar"));

    // Debería mostrar un error
    await waitFor(() => {
      expect(
        screen.getByText("El nombre no puede tener más de 32 caracteres")
      ).toBeDefined();
    });
  });

  it("Muestra errores cuando el nombre contiene caracteres inválidos", async () => {
    render(
      <Router>
        <UserContext.Provider
          value={{
            user: { id: 1, username: "Nombre test" },
            setUser: () => null,
            isUserLoaded: true,
          }}
        >
          <Home />
        </UserContext.Provider>
      </Router>
    );

    // Se aprieta el botón de crear partida
    fireEvent.click(screen.getByRole("button", { name: "Crear partida" }));

    // Se llena el formulario con un nombre con caracteres inválidos
    fireEvent.change(
      screen.getByLabelText("Nombre de la sala", { exact: false }),
      { target: { value: "🤔" } }
    );

    // Se ponen los jugadores mínimos y máximos
    fireEvent.change(
      screen.getByLabelText("Mínimo de jugadores", { exact: false }),
      { target: { value: "2" } }
    );
    fireEvent.change(
      screen.getByLabelText("Máximo de jugadores", { exact: false }),
      { target: { value: "4" } }
    );

    // Se aprieta el botón de aceptar
    fireEvent.click(screen.getByText("Aceptar"));

    // Debería mostrar un error
    await waitFor(() => {
      expect(
        screen.getByText("El nombre solo puede contener caracteres ASCII")
      ).toBeDefined();
    });
  });

  it("Muestra error cuando el mínimo de jugadores es mayor al máximo", async () => {
    render(
      <Router>
        <UserContext.Provider
          value={{
            user: { id: 1, username: "Nombre test" },
            setUser: () => null,
            isUserLoaded: true,
          }}
        >
          <Home />
        </UserContext.Provider>
      </Router>
    );

    // Se aprieta el botón de crear partida
    fireEvent.click(screen.getByRole("button", { name: "Crear partida" }));

    // Se llena el formulario con un mínimo de jugadores mayor al máximo
    fireEvent.change(
      screen.getByLabelText("Nombre de la sala", { exact: false }),
      { target: { value: "Sala de prueba" } }
    );
    fireEvent.change(
      screen.getByLabelText("Mínimo de jugadores", { exact: false }),
      { target: { value: "4" } }
    );
    fireEvent.change(
      screen.getByLabelText("Máximo de jugadores", { exact: false }),
      { target: { value: "2" } }
    );

    // Se aprieta el botón de aceptar
    fireEvent.click(screen.getByText("Aceptar"));

    // Debería mostrar un error
    await waitFor(() => {
      expect(
        screen.getByText("El mínimo de jugadores debe ser menor o igual al máximo")
      ).toBeDefined();
    });
  });
});
