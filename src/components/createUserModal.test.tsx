import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import Home from "../pages/home";
import { loadUser } from "../services/state/userSlice";
import { createTestStore } from "../services/state/testStore";
import { Store } from "redux";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import userMock from "../api/user/mock";

let store: Store;
let mock: MockAdapter;

beforeEach(() => {
  store = createTestStore();
  mock = new MockAdapter(axios, { onNoMatch: "throwException" });
});

afterEach(() => {
  cleanup();
  mock.restore();
});

describe("CreateUserModal", () => {
  it("should render the modal", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    // Verificar si el modal está presente al ingresar a la página
    expect(screen.getByText("Elige tu nombre")).toBeDefined();

    // Verificar si el botón de crear está presente al ingresar a la página
    expect(screen.getByRole("button", { name: "Crear" })).toBeDefined();

    // Verificar si el input está presente al ingresar a la página
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("should not render the modal if user is loaded", () => {
    const testStore = { ...store };
    testStore.dispatch(
      loadUser({
        id: 3,
        username: "Nombre test",
      })
    );

    render(
      <Provider store={testStore}>
        <Home />
      </Provider>
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

  it("should hide the modal when the user is loaded", async () => {
    userMock(true);

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

    // Verificar si el modal está presente al ingresar a la página
    expect(screen.getByText("Elige tu nombre")).toBeDefined();

  });
});
