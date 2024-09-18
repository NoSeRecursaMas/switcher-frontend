import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../../pages/home";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import userMock from "../../api/user/user-mock";
import * as userEndpoints from "../../api/user/user-endpoints";
import * as utils from "../../services/utils";
import UserProvider from "../../context/userContextProvider";
import { UserContext } from "../../context/user-context";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(axios, { onNoMatch: "throwException" });
});

afterEach(() => {
  cleanup();
  mock.restore();
});

describe("CreateUserModal", () => {
  it("Se debe mostrar el modal al ingresar al Home por primera vez", () => {
    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Verificar si el modal está presente al ingresar a la página
    expect(screen.getByText("Elige tu nombre")).toBeDefined();

    // Verificar si el botón de crear está presente al ingresar a la página
    expect(screen.getByRole("button", { name: "Crear" })).toBeDefined();

    // Verificar si el input está presente al ingresar a la página
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("No se debe mostrar el modal si el usuario ya tiene un nombre", () => {
    render(
      <UserContext.Provider
        value={{
          user: { id: 1, username: "Nombre test" },
          setUser: () => null,
          isUserLoaded: true,
        }}
      >
        <Home />
      </UserContext.Provider>
    );

    // Verificar si el modal no está presente al cargar el usuario
    expect(screen.queryByText("Elige tu nombre")).toBeNull();

    // Verificar si el botón de crear no está presente al cargar el usuario
    expect(screen.queryByRole("button", { name: "Crear" })).toBeNull();

    // Verificar si el input no está presente al cargar el usuario
    expect(screen.queryByRole("textbox")).toBeNull();

    // Verificar si el nombre del usuario está presente al cargar el usuario
    expect(screen.getByText("Nombre test")).toBeDefined();
  });

  it("Se debe poder crear un usuario", async () => {
    userMock(true);
    const spy = vi.spyOn(userEndpoints, "createUser");
    const spyToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Verificar si el modal está presente al ingresar a la página
    expect(screen.getByText("Elige tu nombre")).toBeDefined();

    // Agregar un nombre al input
    await waitFor(async () => {
      await user.type(screen.getByRole("textbox"), "Nombre test");
    });

    // Hacer click en el botón de crear
    await waitFor(async () => {
      await user.click(screen.getByRole("button", { name: "Crear" }));
    });

    // Verificar que se haya enviado la petición
    expect(spy).toHaveBeenCalled();

    // Esperar a que el modal se cierre
    await waitForElementToBeRemoved(() => screen.getByText("Elige tu nombre"));

    // Verificar si ahora se reemplazo el nombre de "invitado sin nombre" por el nombre ingresado
    expect(screen.getByText("Nombre test")).toBeDefined();

    // Verificar si el modal no está presente al cargar el usuario
    expect(screen.queryByText("Elige tu nombre")).toBeNull();

    // Verificar si hay un toast de que tuviste éxito
    expect(spyToast).toHaveBeenCalledWith(
      "¡Nombre seleccionado con éxito!",
      null,
      "success"
    );
  });

  it("Se debe mostrar un error si el nombre es muy largo", async () => {
    const spy = vi.spyOn(userEndpoints, "createUser");

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Agregar un nombre al input
    await userEvent.type(
      screen.getByRole("textbox"),
      "Nombre super largo que no deberia ser permitido bajo ninguna circunstancia"
    );

    // Hacer click en el botón de crear
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    // Verificar que se muestre el error en el formulario
    expect(screen.queryByText("32 caracteres")).toBeDefined();

    // Verificar que no se haya enviado la petición
    expect(spy).not.toHaveBeenCalled();
  });

  it("Se debe mostrar un error si el nombre esta vacio", async () => {
    const spy = vi.spyOn(userEndpoints, "createUser");

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Hacer click en el botón de crear
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    // Verificar que se muestre el error en el formulario
    expect(screen.queryByText("vacío")).toBeDefined();

    // Verificar que no se haya enviado la petición
    expect(spy).not.toHaveBeenCalled();
  });

  it("Se debe mostrar un error si el nombre contiene caracteres no permitidos", async () => {
    const spy = vi.spyOn(userEndpoints, "createUser");

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Agregar un nombre al input
    await userEvent.type(screen.getByRole("textbox"), "ñ");

    // Hacer click en el botón de crear
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    // Verificar que se muestre el error en el formulario
    expect(screen.queryByText("ASCII")).toBeDefined();

    // Verificar que no se haya enviado la petición
    expect(spy).not.toHaveBeenCalled();
  });

  it("Se puede crear un usuario con un nombre de 1 caracter", async () => {
    userMock(true);
    const spy = vi.spyOn(userEndpoints, "createUser");
    const spyToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Agregar un nombre al input
    await waitFor(async () => {
      await user.type(screen.getByRole("textbox"), "a");
    });

    // Hacer click en el botón de crear
    await waitFor(async () => {
      await user.click(screen.getByRole("button", { name: "Crear" }));
    });

    // Verificar que se haya enviado la petición
    expect(spy).toHaveBeenCalled();

    // Esperar a que el modal se cierre
    await waitForElementToBeRemoved(() => screen.getByText("Elige tu nombre"));

    // Verificar si ahora se reemplazo el nombre de "invitado sin nombre" por el nombre ingresado
    expect(screen.getByText("a")).toBeDefined();

    // Verificar si el modal no está presente al cargar el usuario
    expect(screen.queryByText("Elige tu nombre")).toBeNull();

    // Verificar si hay un toast de que tuviste éxito
    expect(spyToast).toHaveBeenCalledWith(
      "¡Nombre seleccionado con éxito!",
      null,
      "success"
    );
  });

  it("Se puede crear un usuario con un nombre con 10 espacios en medio", async () => {
    userMock(true);
    const spy = vi.spyOn(userEndpoints, "createUser");
    const spyToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Agregar un nombre al input
    await waitFor(async () => {
      await user.type(screen.getByRole("textbox"), "a          b");
    });

    // Hacer click en el botón de crear
    await waitFor(async () => {
      await user.click(screen.getByRole("button", { name: "Crear" }));
    });

    // Verificar que se haya enviado la petición
    expect(spy).toHaveBeenCalled();

    // Esperar a que el modal se cierre
    await waitForElementToBeRemoved(() => screen.getByText("Elige tu nombre"));

    // Verificar si ahora se reemplazo el nombre de "invitado sin nombre" por el nombre ingresado
    expect(screen.getByText("a b")).toBeDefined();

    // Verificar si el modal no está presente al cargar el usuario
    expect(screen.queryByText("Elige tu nombre")).toBeNull();

    // Verificar si hay un toast de que tuviste éxito
    expect(spyToast).toHaveBeenCalledWith(
      "¡Nombre seleccionado con éxito!",
      null,
      "success"
    );
  });
  it("Se muestra un toast de error si la petición falla", async () => {
    userMock();
    const spy = vi.spyOn(userEndpoints, "createUser");
    const spyToast = vi.spyOn(utils, "sendToast");
    const user = userEvent.setup();

    render(
      <UserProvider>
        <Home />
      </UserProvider>
    );

    // Agregar un nombre al input
    await waitFor(async () => {
      await user.type(screen.getByRole("textbox"), "error");
    });

    // Hacer click en el botón de crear
    await waitFor(async () => {
      await user.click(screen.getByRole("button", { name: "Crear" }));
    });

    // Verificar que se haya enviado la petición
    expect(spy).toHaveBeenCalled();

    // Verificar que se haya mostrado un toast de error
    await waitFor(() => {
      expect(spyToast).toHaveBeenCalled();
    });
    expect(spyToast).toHaveBeenCalledWith(
      "Error al seleccionar nombre",
      "Ejemplo de error en el backend",
      "error"
    );

    // Verificar que el modal siga presente
    expect(screen.getByText("Elige tu nombre")).toBeDefined();

    // Verificar que el nombre siga siendo "invitado sin nombre"
    expect(screen.getByText("invitado sin nombre")).toBeDefined();
  });
});
