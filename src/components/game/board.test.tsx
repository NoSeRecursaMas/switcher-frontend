import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "./board";
import { useGame } from "../../hooks/useGame";

// Mock the useGame hook
vi.mock("../../hooks/useGame");

describe("Board component", () => {
  const BOARD = [
    { posX: 0, posY: 0, color: "G", isPartial: false },
    { posX: 0, posY: 1, color: "Y", isPartial: false },
    { posX: 0, posY: 2, color: "G", isPartial: false },
    { posX: 0, posY: 3, color: "G", isPartial: false },
    { posX: 0, posY: 4, color: "B", isPartial: false },
    { posX: 0, posY: 5, color: "Y", isPartial: false },
    { posX: 1, posY: 0, color: "G", isPartial: false },
    { posX: 1, posY: 1, color: "B", isPartial: false },
    { posX: 1, posY: 2, color: "B", isPartial: false },
    { posX: 1, posY: 3, color: "Y", isPartial: false },
    { posX: 1, posY: 4, color: "B", isPartial: false },
    { posX: 1, posY: 5, color: "Y", isPartial: false },
    { posX: 2, posY: 0, color: "R", isPartial: false },
    { posX: 2, posY: 1, color: "Y", isPartial: false },
    { posX: 2, posY: 2, color: "R", isPartial: false },
    { posX: 2, posY: 3, color: "R", isPartial: false },
    { posX: 2, posY: 4, color: "B", isPartial: false },
    { posX: 2, posY: 5, color: "G", isPartial: false },
    { posX: 3, posY: 0, color: "R", isPartial: false },
    { posX: 3, posY: 1, color: "R", isPartial: false },
    { posX: 3, posY: 2, color: "B", isPartial: false },
    { posX: 3, posY: 3, color: "G", isPartial: false },
    { posX: 3, posY: 4, color: "R", isPartial: false },
    { posX: 3, posY: 5, color: "Y", isPartial: false },
    { posX: 4, posY: 0, color: "Y", isPartial: false },
    { posX: 4, posY: 1, color: "G", isPartial: false },
    { posX: 4, posY: 2, color: "Y", isPartial: false },
    { posX: 4, posY: 3, color: "R", isPartial: false },
    { posX: 4, posY: 4, color: "B", isPartial: false },
    { posX: 4, posY: 5, color: "R", isPartial: false },
    { posX: 5, posY: 0, color: "Y", isPartial: false },
    { posX: 5, posY: 1, color: "G", isPartial: false },
    { posX: 5, posY: 2, color: "B", isPartial: false },
    { posX: 5, posY: 3, color: "B", isPartial: false },
    { posX: 5, posY: 4, color: "R", isPartial: false },
    { posX: 5, posY: 5, color: "G", isPartial: false },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    (useGame as Mock).mockReturnValue({
      board: BOARD,
    });
  });

  it("should render correctly with a given board state", () => {
    render(<Board />);
    expect(screen.getByLabelText("game-board")).toBeInTheDocument();
  });

  it("should render the correct number of tiles", () => {
    render(<Board />);
    expect(screen.getByLabelText("game-board").children).toHaveLength(36);
  });

});
