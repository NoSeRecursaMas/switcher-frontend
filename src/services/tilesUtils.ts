import {
  Game,
  MovementCard,
  FigureCard,
  Movement,
  CoordsTile,
  isMovementCard,
} from '../types/gameTypes';

const checkCoords = (
  coords: CoordsTile,
  coordsSelected: CoordsTile,
  offsets: [number, number][]
) => {
  return offsets.some(
    ([offsetX, offsetY]) =>
      coords.posX === coordsSelected.posX + offsetX &&
      coords.posY === coordsSelected.posY + offsetY
  );
};

const movementChecks: {
  [key in Movement]: (
    coords: CoordsTile,
    coordsSelected: CoordsTile
  ) => boolean;
} = {
  [Movement.mov1]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [2, 2],
      [-2, -2],
      [2, -2],
      [-2, 2],
    ]),
  [Movement.mov2]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [2, 0],
      [-2, 0],
      [0, -2],
      [0, 2],
    ]),
  [Movement.mov3]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [1, 0],
      [-1, 0],
      [0, -1],
      [0, 1],
    ]),
  [Movement.mov4]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ]),
  [Movement.mov5]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [-2, 1],
      [1, 2],
      [2, -1],
      [-1, -2],
    ]),
  [Movement.mov6]: (coords, coordsSelected) =>
    checkCoords(coords, coordsSelected, [
      [-1, 2],
      [-2, -1],
      [1, -2],
      [2, 1],
    ]),
  [Movement.mov7]: (coords, coordsSelected) => {
    if (
      coordsSelected.posX === coords.posX &&
      coordsSelected.posY === coords.posY
    ) {
      return false;
    }
    return (
      (coords.posX === coordsSelected.posX &&
        (coords.posY === 5 || coords.posY === 0)) ||
      (coords.posY === coordsSelected.posY &&
        (coords.posX === 0 || coords.posX === 5))
    );
  },
};

export const isHighlighted = (
  coords: CoordsTile,
  coordsSelected: CoordsTile,
  card: MovementCard | FigureCard | undefined
) => {
  if (!card || !isMovementCard(card)) {
    return false;
  }
  return movementChecks[card.type](coords, coordsSelected);
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
