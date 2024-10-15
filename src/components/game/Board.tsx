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
        Array.from({ length: 6 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => {
            const tile = board.find(
              (tile) => tile.posX === j && tile.posY === i
            );
            return <BoardTile key={`${i.toString()}-${j.toString()}`} color={tile?.color} />;
          })
        )}
    </SimpleGrid>
  );
}
