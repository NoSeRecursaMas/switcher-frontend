import { describe, it, expect, afterEach, vi, beforeAll, afterAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Board from "../components/game/board";
import MoveDeck from "../components/game/moveDeck";
import FigureDeck from "../components/game/figureDeck";
import { server } from "../mocks/node";
import { Game, Color, Figure, Movement, FigureTiles, MovementCard, FigureCard, Tile } from "../types/gameTypes";

// Mock de la información de juego
const playersMock = [
    {
        position: 1,
        username: "Jugador local",
        playerID: 1,
        isActive: 1,
        sizeDeckFigure: 6,
        cardsFigure: randomFigureHand(),
    },
    {
        position: 2,
        username: "Player 2",
        playerID: 2,
        isActive: 1,
        sizeDeckFigure: 5,
        cardsFigure: randomFigureHand(),
    },
    {
        position: 3,
        username: "Player 3",
        playerID: 3,
        isActive: 1,
        sizeDeckFigure: 4,
        cardsFigure: randomFigureHand(),
    },
    {
        position: 4,
        username: "Player 4",
        playerID: 4,
        isActive: 1,
        sizeDeckFigure: 3,
        cardsFigure: randomFigureHand(),
    },
];

function randomMovementHand(): MovementCard[] {
    const movements = [Movement.mov1, Movement.mov2, Movement.mov3, Movement.mov4, Movement.mov5, Movement.mov6, Movement.mov7];
    return Array(3).fill(0).map(() => ({ type: movements[Math.floor(Math.random() * movements.length)], cardID: 0, isUsed: false }));
}

function randomFigureHand(): FigureCard[] {
    const figures = [Figure.fig01, Figure.fig02, Figure.fig03, Figure.fig04, Figure.fig05, Figure.fig06, Figure.fig07, Figure.fig08, Figure.fig09, Figure.fig10,
    Figure.fig11, Figure.fig12, Figure.fig13, Figure.fig14, Figure.fig15, Figure.fig16, Figure.fig17, Figure.fig18, Figure.fige01, Figure.fige02, Figure.fige03,
    Figure.fige04, Figure.fige05, Figure.fige06, Figure.fige07];
    return Array(3).fill(0).map(() => ({ type: figures[Math.floor(Math.random() * figures.length)], cardID: 0, isBlocked: false }));
}

function getRandomColor(): Color {
    const colors = [Color.R, Color.G, Color.B, Color.Y];
    return colors[Math.floor(Math.random() * colors.length)];
}

const boardMock: Tile[] = Array(36).fill(0).map((_, i) => ({ posX: i % 6, posY: Math.floor(i / 6), color: getRandomColor(), isPartial: false }));

const figureToUseMock: FigureTiles[] = [];

const gameStatus: Game = {
    board: boardMock,
    figureToUse: figureToUseMock,
    prohibitedColor: null,
    cardsMovement: randomMovementHand(),
    posEnabledToPlay: 3,
    players: playersMock,
};

const move = gameStatus.cardsMovement.map(card => ({ data: card, isSelected: false }));
const figure = playersMock[0].cardsFigure.map(card => ({ data: card, isSelected: false }));
const otherPlayersFigures = playersMock.slice(1, 4).map(player => ({ cardsFigure: player.cardsFigure.map(card => ({ data: card, isSelected: false })) }));
const board = gameStatus.board.map(tile => ({ data: tile, isHighlighted: false }));


describe("Game", () => {

    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
    });

    afterEach(() => {
        cleanup();
    });

    it("El tablero se renderiza correctamente", () => {
        render(<Board tiles={board} />);
        expect(screen.getAllByRole("button")).toHaveLength(36);
    });

    it("Se renderizan correctamente las cartas de figura propias", () => {
        render(<FigureDeck figures={figure} vertical={false} />);
        expect(screen.getAllByRole("button")).toHaveLength(3);
    });

    it("Se renderizan correctamente las cartas de movimiento", () => {
        render(<MoveDeck cards={move} />);
        expect(screen.getAllByRole("button")).toHaveLength(3);
    });

    it("Se renderizan las cartas de figura de otros jugadores", () => {
        render(<FigureDeck figures={otherPlayersFigures[0].cardsFigure} vertical={true} />);
        render(<FigureDeck figures={otherPlayersFigures[1].cardsFigure} vertical={true} />);
        render(<FigureDeck figures={otherPlayersFigures[2].cardsFigure} vertical={false} />);
        expect(screen.getAllByRole("button")).toHaveLength(9);
    });
});
