import { CoordsTile } from "../types/gameTypes";
import { Game } from "../types/gameTypes";

export const isHighlighted = (coords: CoordsTile, coordsSelected: CoordsTile) => {
  // Hacer la lógica de si la ficha está highlighteada
  return (
    coordsSelected.posX === coords.posX + 1 &&
    coordsSelected.posY === coords.posY + 1
  );
};

const isBorderFigure = (coords: CoordsTile, figures: CoordsTile[][]) => {
  // Hacer la lógica de si la ficha es borde
  return { top: false, right: false, bottom: false, left: false };
};

export const getExtendedBoard = (
  game: Game | undefined,
  selectedTile: CoordsTile | undefined
) => {
  if (!game) {
    return [];
  }
  return game.board.map((tile) => {
    const isHighlightedTile = isHighlighted(
      { posX: tile.posX, posY: tile.posY },
      { posX: selectedTile?.posX ?? -1 , posY: selectedTile?.posY ?? -1 }
    );
    const { top, right, bottom, left } = isBorderFigure(
      { posX: tile.posX, posY: tile.posY },
      game.figuresToUse
    );

    return {
      ...tile,
      isHighlighted: isHighlightedTile,
      markTopBorder: top,
      markRightBorder: right,
      markBottomBorder: bottom,
      markLeftBorder: left,
    };
  });
};
