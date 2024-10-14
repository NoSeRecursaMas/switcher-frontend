import { Button, SimpleGrid } from "@chakra-ui/react";
import type { Tile, LocalTile } from "../../types/gameTypes";
import { Color } from "../../types/gameTypes";
import Ficha1 from "/Ficha1.png";
import Ficha2 from "/Ficha2.png";
import Ficha3 from "/Ficha3.png";
import Ficha4 from "/Ficha4.png";
import { useGame } from "../../hooks/useGame";

function Tile(tileData: LocalTile) {
  let img;
  switch (tileData.color) {
    case Color.Y:
      img = Ficha1;
      break;
    case Color.R:
      img = Ficha2;
      break;
    case Color.B:
      img = Ficha3;
      break;
    case Color.G:
      img = Ficha4;
      break;
  }

  const handleClick = () => {
    console.log("Posición: ", tileData.posX, tileData.posY);
    console.log("Color: ", tileData.color);
  };

  return (
    <Button
      onClick={handleClick}
      backgroundImage={img}
      backgroundSize="cover"
      variant="unstyled"
      width="9vh"
      height="9vh"
      borderRadius="20px"
      _hover={{
        transform: "scale(1.1)",
      }}
      boxShadow={tileData.isHighlighted ? "0 0 5px 2px gray" : "none"}
    ></Button>
  );
}

export default function Board() {
  const { game } = useGame();
  const board = game?.board;

  const findTile = (posX: number, posY: number): LocalTile | null => {
    if (!board) return null;
    const tile = board.find((tile) => tile.posX === posX && tile.posY === posY);
    if (!tile) return null;
    return {
      ...tile,
      isHighlighted: false,
    };
  };

  return (
    <SimpleGrid
      border="2px"
      borderColor="gray.600"
      borderRadius={20}
      padding={4}
      columns={6}
      spacing={2}
    >
      {board &&
        Array.from({ length: 6 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => {
            const tile = findTile(i, j);
            if (!tile) return null;
            return <Tile key={`${i.toString()}-${j.toString()}`} {...tile} />;
          })
        )}
    </SimpleGrid>
  );
}
