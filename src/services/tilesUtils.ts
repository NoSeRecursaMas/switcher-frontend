import { CoordsTile } from '../types/gameTypes';
import { Game, MovementCard, FigureCard, Movement } from '../types/gameTypes';

export const isHighlighted = (
  coords: CoordsTile,
  coordsSelected: CoordsTile,
  card: MovementCard | FigureCard | undefined
) => {
  if (!card) {
    return false;
  }
  card = card as MovementCard;
  switch (card.type) {
    case Movement.mov1: // Diagonal 2
      return (
        (coords.posX === coordsSelected.posX + 2 &&
          coords.posY === coordsSelected.posY + 2) ||
        (coords.posX === coordsSelected.posX - 2 &&
          coords.posY === coordsSelected.posY - 2) ||
        (coords.posX === coordsSelected.posX + 2 &&
          coords.posY === coordsSelected.posY - 2) ||
        (coords.posX === coordsSelected.posX - 2 &&
          coords.posY === coordsSelected.posY + 2)
      );

    case Movement.mov2: // Lineal 2
      return (
        (coords.posX === coordsSelected.posX + 2 &&
          coords.posY === coordsSelected.posY) ||
        (coords.posX === coordsSelected.posX - 2 &&
          coords.posY === coordsSelected.posY) ||
        (coords.posX === coordsSelected.posX &&
          coords.posY === coordsSelected.posY - 2) ||
        (coords.posX === coordsSelected.posX &&
          coords.posY === coordsSelected.posY + 2)
      );

    case Movement.mov3: // Lineal 1
      return (
        (coords.posX === coordsSelected.posX + 1 &&
          coords.posY === coordsSelected.posY) ||
        (coords.posX === coordsSelected.posX - 1 &&
          coords.posY === coordsSelected.posY) ||
        (coords.posX === coordsSelected.posX &&
          coords.posY === coordsSelected.posY - 1) ||
        (coords.posX === coordsSelected.posX &&
          coords.posY === coordsSelected.posY + 1)
      );

    case Movement.mov4: // Diagonal 1
      return (
        (coords.posX === coordsSelected.posX + 1 &&
          coords.posY === coordsSelected.posY + 1) ||
        (coords.posX === coordsSelected.posX - 1 &&
          coords.posY === coordsSelected.posY - 1) ||
        (coords.posX === coordsSelected.posX + 1 &&
          coords.posY === coordsSelected.posY - 1) ||
        (coords.posX === coordsSelected.posX - 1 &&
          coords.posY === coordsSelected.posY + 1)
      );

    case Movement.mov5: // L 2
      return (
        (coords.posX === coordsSelected.posX - 2 &&
          coords.posY === coordsSelected.posY + 1) ||
        (coords.posX === coordsSelected.posX + 1 &&
          coords.posY === coordsSelected.posY + 2) ||
        (coords.posX === coordsSelected.posX + 2 &&
          coords.posY === coordsSelected.posY - 1) ||
        (coords.posX === coordsSelected.posX - 1 &&
          coords.posY === coordsSelected.posY - 2)
      );
    case Movement.mov6: // L 1
      return (
        (coords.posX === coordsSelected.posX - 1 &&
          coords.posY === coordsSelected.posY + 2) ||
        (coords.posX === coordsSelected.posX - 2 &&
          coords.posY === coordsSelected.posY - 1) ||
        (coords.posX === coordsSelected.posX + 1 &&
          coords.posY === coordsSelected.posY - 2) ||
        (coords.posX === coordsSelected.posX + 2 &&
          coords.posY === coordsSelected.posY + 1)
      );

    case Movement.mov7: // Linea lateral
      if (
        coordsSelected.posX === coords.posX &&
        coordsSelected.posY === coords.posY
      ) {
        return false;
      }
      return (
        (coords.posX === coordsSelected.posX && coords.posY === 5) ||
        (coords.posX === coordsSelected.posX && coords.posY === 0) ||
        (coords.posX === 0 && coords.posY === coordsSelected.posY) ||
        (coords.posX === 5 && coords.posY === coordsSelected.posY)
      );
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isBorderFigure = (coords: CoordsTile, figures: CoordsTile[][]) => {
  // Hacer la lógica de si la ficha es borde
  return { top: false, right: false, bottom: false, left: false };
};

export const getExtendedBoard = (
  game: Game | undefined,
  selectedTile: CoordsTile | undefined,
  selectedCard: MovementCard | FigureCard | undefined
) => {
  if (!game) {
    return [];
  }
  return game.board.map((tile) => {
    const isHighlightedTile = isHighlighted(
      { posX: tile.posX, posY: tile.posY },
      { posX: selectedTile?.posX, posY: selectedTile?.posY } as CoordsTile,
      selectedCard
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
