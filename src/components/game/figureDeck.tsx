import { Box, HStack, Button, VStack } from "@chakra-ui/react";
import fig01 from "/figureCards/fig01.png";
import fig02 from "/figureCards/fig02.png";
import fig03 from "/figureCards/fig03.png";
import fig04 from "/figureCards/fig04.png";
import fig05 from "/figureCards/fig05.png";
import fig06 from "/figureCards/fig06.png";
import fig07 from "/figureCards/fig07.png";
import fig08 from "/figureCards/fig08.png";
import fig09 from "/figureCards/fig09.png";
import fig10 from "/figureCards/fig10.png";
import fig11 from "/figureCards/fig11.png";
import fig12 from "/figureCards/fig12.png";
import fig13 from "/figureCards/fig13.png";
import fig14 from "/figureCards/fig14.png";
import fig15 from "/figureCards/fig15.png";
import fig16 from "/figureCards/fig16.png";
import fig17 from "/figureCards/fig17.png";
import fig18 from "/figureCards/fig18.png";
import fige01 from "/figureCards/fige01.png";
import fige02 from "/figureCards/fige02.png";
import fige03 from "/figureCards/fige03.png";
import fige04 from "/figureCards/fige04.png";
import fige05 from "/figureCards/fige05.png";
import fige06 from "/figureCards/fige06.png";
import fige07 from "/figureCards/fige07.png";
import { Figure } from "../../types/gameTypes";
import type { FigureCard, LocalFigureCard } from "../../types/gameTypes";

function RenderFigureCard(cardData: LocalFigureCard) {
  let img;
  switch (cardData.type) {
    case Figure.fig01:
      img = fig01;
      break;
    case Figure.fig02:
      img = fig02;
      break;
    case Figure.fig03:
      img = fig03;
      break;
    case Figure.fig04:
      img = fig04;
      break;
    case Figure.fig05:
      img = fig05;
      break;
    case Figure.fig06:
      img = fig06;
      break;
    case Figure.fig07:
      img = fig07;
      break;
    case Figure.fig08:
      img = fig08;
      break;
    case Figure.fig09:
      img = fig09;
      break;
    case Figure.fig10:
      img = fig10;
      break;
    case Figure.fig11:
      img = fig11;
      break;
    case Figure.fig12:
      img = fig12;
      break;
    case Figure.fig13:
      img = fig13;
      break;
    case Figure.fig14:
      img = fig14;
      break;
    case Figure.fig15:
      img = fig15;
      break;
    case Figure.fig16:
      img = fig16;
      break;
    case Figure.fig17:
      img = fig17;
      break;
    case Figure.fig18:
      img = fig18;
      break;
    case Figure.fige01:
      img = fige01;
      break;
    case Figure.fige02:
      img = fige02;
      break;
    case Figure.fige03:
      img = fige03;
      break;
    case Figure.fige04:
      img = fige04;
      break;
    case Figure.fige05:
      img = fige05;
      break;
    case Figure.fige06:
      img = fige06;
      break;
    case Figure.fige07:
      img = fige07;
      break;
  }

  const handleClick = () => {
    console.log(cardData.type);
  };

  return (
    <Button
      onClick={handleClick}
      backgroundImage={img}
      backgroundSize="cover"
      variant="unstyled"
      w="12vh"
      h="12vh"
      _hover={{
        transform: "scale(1.1)",
      }}
      disabled={cardData.isBlocked}
      borderColor={cardData.isSelected ? "red" : "transparent"}
    ></Button>
  );
}

export default function FigureDeck({
  figures,
  vertical,
}: {
  figures: FigureCard[];
  vertical: boolean;
}) {
  return (
    <>
      {vertical ? (
        <VStack spacing={4}>
          {figures.map((card, index) => (
            <RenderFigureCard isSelected={false} key={index} {...card} />
          ))}
        </VStack>
      ) : (
        <HStack spacing={4}>
          {figures.map((card, index) => (
            <RenderFigureCard isSelected={false} key={index} {...card} />
          ))}
        </HStack>
      )}
    </>
  );
}
