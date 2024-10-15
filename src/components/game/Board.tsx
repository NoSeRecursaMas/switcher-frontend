import { SimpleGrid } from "@chakra-ui/react";
import { useGame } from "../../hooks/useGame";
import BoardTile from "./boardTile";

export default function Board() {
  const { board } = useGame();

  return (
    <SimpleGrid
      border="2px"
      borderColor="gray.600"
      borderRadius={20}
      padding={4}
      columns={6}
      spacing={2}
      aria-label="game-board"
    >
      {board &&
        Array.from({ length: 6 }).map((_, y) =>
          Array.from({ length: 6 }).map((_, x) => {
            const tile = board.find(
              (tile) => tile.posX === x && tile.posY === y
            );
            if (!tile) return null;
            const newTile = {
              ...tile,
              isPartial: x === 3 && y === 2 || x === 0 && y === 2,
              isHighlighted: x === 3 && y === 2 || x === 2 && y === 4,
              isSelected: x === 1 && y === 0,
              markTopBorder: x === 3 && y === 2 || x === 4 && y === 3 || x === 2 && y === 3,
              markRightBorder: x === 3 && y === 2 || x === 4 && y === 3 ,
              markBottomBorder: x === 4 && y === 3 || x === 3 && y === 3 || x === 2 && y === 3,
              markLeftBorder: x === 2 && y === 3 || x === 3 && y === 2,
            };
            
            return (
              <BoardTile
                key={`${x.toString()}-${y.toString()}`}
                tile={newTile}
              />
            );
          })
        )}
    </SimpleGrid>
  );
}
