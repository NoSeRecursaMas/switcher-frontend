enum Color {
    R = "R",
    G = "G",
    B = "B",
    Y = "Y",
}

enum Movement {
    mov1 = "mov1",
    mov2 = "mov2",
    mov3 = "mov3",
    mov4 = "mov4",
    mov5 = "mov5",
    mov6 = "mov6",
    mov7 = "mov7",
}

enum Figure {
    fig01 = "fig01",
    fig02 = "fig02",
    fig03 = "fig03",
    fig04 = "fig04",
    fig05 = "fig05",
    fig06 = "fig06",
    fig07 = "fig07",
    fig08 = "fig08",
    fig09 = "fig09",
    fig10 = "fig10",
    fig11 = "fig11",
    fig12 = "fig12",
    fig13 = "fig13",
    fig14 = "fig14",
    fig15 = "fig15",
    fig16 = "fig16",
    fig17 = "fig17",
    fig18 = "fig18",
    fige01 = "fige01",
    fige02 = "fige02",
    fige03 = "fige03",
    fige04 = "fige04",
    fige05 = "fige05",
    fige06 = "fige06",
    fige07 = "fige07",
}

interface Tile {
    posX: number;
    posY: number;
    color: Color;
    isPartial: boolean; // Si la ficha se movió en el turno
}

// Los tipos locales tienen información que no es necesario mandar al servidor
interface LocalTile {
    data: Tile;
    isHighlighted: boolean;
}

interface FigureTiles {
    posX: number;
    posY: number;
}

interface MovementCard {
    type: Movement;
    cardID: number;
    isUsed: boolean; // Usada en el turno actual
}

interface LocalMovementCard {
    data: MovementCard;
    isSelected: boolean;
}

interface FigureCard {
    type: Figure;
    cardID: number;
    isBlocked: boolean;
}

interface LocalFigureCard {
    data: FigureCard;
    isSelected: boolean;
}

interface Player {
    position: number; // Posición en los turnos
    username: string;
    playerID: number;
    isActive: number; // Conectado o no (0 o 1)
    sizeDeckFigure: number; // Tamaño de la pila de figuras
    cardsFigure: FigureCard[];
}

interface Game {
    board: Tile[];
    figureToUse: FigureTiles[]; // Tiles a resaltar
    prohibitedColor: Color | null;
    cardsMovement: MovementCard[];
    posEnabledToPlay: number; // Turno
    players: Player[];
}

export type { Game, Tile, LocalTile, FigureTiles, MovementCard, LocalMovementCard, FigureCard, LocalFigureCard, Player };
export { Color, Movement, Figure };
export default Game;