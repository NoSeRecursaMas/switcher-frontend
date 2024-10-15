import { Button } from "@chakra-ui/react";
import { Color } from "../../types/gameTypes";
import Ficha1 from "/Ficha1.png";
import Ficha2 from "/Ficha2.png";
import Ficha3 from "/Ficha3.png";
import Ficha4 from "/Ficha4.png";

export default function BoardTile({ color }: { color: Color | undefined }) {
  const img = (color: Color | undefined) => {
    switch (color) {
      case Color.Y:
        return Ficha1;
      case Color.R:
        return Ficha2;
      case Color.B:
        return Ficha3;
      case Color.G:
        return Ficha4;
      default:
        throw new Error("Invalid color");
    }
  };

  return (
    <Button
      onClick={() => {
        console.log("Color: ", color);
      }}
      backgroundImage={img(color)}
      backgroundSize="cover"
      variant="unstyled"
      width="9vh"
      height="9vh"
      borderRadius="20px"
      _hover={{
        transform: "scale(1.1)",
      }}
      // boxShadow={tileData.isHighlighted ? "0 0 5px 2px gray" : "none"}
    />
  );
}
