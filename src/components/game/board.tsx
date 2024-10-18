import { SimpleGrid } from '@chakra-ui/react';
import { useGameTile } from '../../hooks/useGameTile';
import BoardTile from './boardTile';

export default function Board() {
  const { board } = useGameTile();

  return (
    <SimpleGrid
      border="2px"
      borderColor="gray.600"
      borderRadius={20}
      padding={4}
      columns={6}
      spacing={2}
      aria-label="game-board"
      h="60vh"
      w="60vh"
    >
      {Array.from({ length: 6 }).map((_, x) =>
        Array.from({ length: 6 }).map((_, y) => {
          const tile = board.find((tile) => tile.posX === x && tile.posY === y);
          if (!tile) return null;

          return (
            <BoardTile key={`${x.toString()}-${y.toString()}`} tile={tile} />
          );
        })
      )}
    </SimpleGrid>
  );
}
