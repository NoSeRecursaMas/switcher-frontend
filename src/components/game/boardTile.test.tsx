import { describe, it, expect } from "vitest";
import { Color } from "../../types/gameTypes";
import Ficha1 from "/Ficha1.png";
import Ficha2 from "/Ficha2.png";
import Ficha3 from "/Ficha3.png";
import Ficha4 from "/Ficha4.png";
import BoardTile from "./boardTile";

describe("BoardTile img function", () => {
    it("should return Ficha1 for Color.Y", () => {
        const result = BoardTile({ color: Color.Y }) as { props: { backgroundImage: string } };
        expect(result.props.backgroundImage).toBe(Ficha1);
    });

    it("should return Ficha2 for Color.R", () => {
        const result = BoardTile({ color: Color.R }) as { props: { backgroundImage: string } };
        expect(result.props.backgroundImage).toBe(Ficha2);
    });

    it("should return Ficha3 for Color.B", () => {
        const result = BoardTile({ color: Color.B }) as { props: { backgroundImage: string } };
        expect(result.props.backgroundImage).toBe(Ficha3);
    });

    it("should return Ficha4 for Color.G", () => {
        const result = BoardTile({ color: Color.G }) as { props: { backgroundImage: string } };
        expect(result.props.backgroundImage).toBe(Ficha4);
    });

    it("should throw an error for an invalid color", () => {
        expect(() => BoardTile({ color: undefined })).toThrow("Invalid color");
    });
});