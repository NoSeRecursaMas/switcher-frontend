import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateRoomModal from "./createRoom";
import { useUser } from "../../context/user-context";
import { setRoomEndpoint } from "../../api/room/room-endpoints";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the necessary modules
vi.mock("../../context/user-context", () => ({
    useUser: vi.fn(),
}));

vi.mock("../../api/room/room-endpoints", () => ({
    setRoomEndpoint: vi.fn(),
}));

describe("CreateRoomModal", () => {

    it("Renderiza el componente", () => {
        useUser.mockReturnValue({ user: { id: "123" }, isUserLoaded: true });

        render(
            <Router>
                <CreateRoomModal />
            </Router>
        );

        expect(screen.getByText("Crear partida")).toBeDefined();
    });

    it("Abre el modal cuando se aprieta el botón", () => {
        useUser.mockReturnValue({ user: { id: "123" }, isUserLoaded: true });

        render(
            <Router>
                <CreateRoomModal />
            </Router>
        );

        fireEvent.click(screen.getByText("Crear partida"));
        expect(screen.getByText("Nombre de la sala")).toBeDefined();
    });

    it("Envía el formulario con datos válidos", async () => {
        useUser.mockReturnValue({ user: { id: "123" }, isUserLoaded: true });

        render(
            <Router>
                <CreateRoomModal />
            </Router>
        );

        fireEvent.click(screen.getByText("Crear partida"));

        fireEvent.change(screen.getByLabelText("Nombre de la sala", { exact: false }), { target: { value: "Test Room" } });
        fireEvent.change(screen.getByLabelText("Mínimo de jugadores", { exact: false }), { target: { value: "2" } });
        fireEvent.change(screen.getByLabelText("Máximo de jugadores", { exact: false }), { target: { value: "4" } });

        fireEvent.click(screen.getByText("Aceptar"));

        await waitFor(() => {
            expect(setRoomEndpoint).toHaveBeenCalledWith("123", "Test Room", 2, 4, expect.any(Function));
        });
    });

    it("Muestra errores cuando el nombre es demasiado largo y la cantidad de jugadores es inválida", async () => {
        useUser.mockReturnValue({ user: { id: "123" }, isUserLoaded: true });

        render(
            <Router>
                <CreateRoomModal />
            </Router>
        );

        fireEvent.click(screen.getByText("Crear partida"));

        fireEvent.change(screen.getByLabelText("Nombre de la sala", { exact: false }), { target: { value: "Test Roooooooooooooooooooooooooooooom" } });
        fireEvent.change(screen.getByLabelText("Mínimo de jugadores", { exact: false }), { target: { value: "4" } });
        fireEvent.change(screen.getByLabelText("Máximo de jugadores", { exact: false }), { target: { value: "2" } });

        fireEvent.click(screen.getByText("Aceptar"));

        await waitFor(() => {
            expect(screen.getByText("El nombre no puede tener más de 32 caracteres")).toBeDefined();
            expect(screen.getByText("El mínimo de jugadores debe ser menor o igual al máximo")).toBeDefined();
        });
    });

    it("Muestra errores cuando el nombre contiene caracteres inválidos", async () => {
        useUser.mockReturnValue({ user: { id: "123" }, isUserLoaded: true });

        render(
            <Router>
                <CreateRoomModal />
            </Router>
        );

        fireEvent.click(screen.getByText("Crear partida"));

        fireEvent.change(screen.getByLabelText("Nombre de la sala", { exact: false }), { target: { value: "Tést róóm" } });
        fireEvent.change(screen.getByLabelText("Mínimo de jugadores", { exact: false }), { target: { value: "2" } });
        fireEvent.change(screen.getByLabelText("Máximo de jugadores", { exact: false }), { target: { value: "4" } });

        fireEvent.click(screen.getByText("Aceptar"));

        await waitFor(() => {
            expect(screen.getByText("El nombre solo puede contener caracteres ASCII")).toBeDefined();
        });
    });
});