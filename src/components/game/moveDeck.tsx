import { Box, HStack, Button } from '@chakra-ui/react';
import L1 from '/movementCards/L1.png';
import L2 from '/movementCards/L2.png';
import Lineal1 from '/movementCards/Lineal1.png';
import Lineal2 from '/movementCards/Lineal2.png';
import Diagonal1 from '/movementCards/Diagonal1.png';
import Diagonal2 from '/movementCards/Diagonal2.png';
import LineaLateral from '/movementCards/LineaLateral.png';
import { Movement } from '../../types/gameTypes';
import { MovementCard } from '../../types/gameTypes';
import { useGame } from '../../hooks/useGame';

function getImgMoveCard(cardData: MovementCard) {
  let img;
  switch (cardData.type) {
    case Movement.mov1:
      img = Diagonal2;
      break;
    case Movement.mov2:
      img = Lineal2;
      break;
    case Movement.mov3:
      img = Lineal1;
      break;
    case Movement.mov4:
      img = Diagonal1;
      break;
    case Movement.mov5:
      img = L2;
      break;
    case Movement.mov6:
      img = L1;
      break;
    case Movement.mov7:
      img = LineaLateral;
      break;
  }

  return img;
}

export default function MoveDeck({ cards }: { cards: MovementCard[] }) {
  const { handleClickCard, selectedCard } = useGame();
  const RenderMovementCard = ({
    card,
    isSelected,
  }: {
    card: MovementCard;
    isSelected: boolean;
  }) => (
    <Button
      onClick={() => {
        handleClickCard(card, 'movement');
      }}
      backgroundImage={getImgMoveCard(card)}
      backgroundSize="cover"
      variant="unstyled"
      width="8.9vh"
      height="12vh"
      _hover={{
        transform: 'scale(1.1)',
      }}
      transform={isSelected ? 'scale(1.1)' : 'scale(1)'}
      filter={selectedCard && !isSelected ? 'brightness(0.5)' : ''}
    />
  );
  return (
    <>
      <Box height="auto" width="auto" justifyContent="center" padding="10px">
        <HStack spacing={4}>
          {cards.map((card, index) => {
            const isSelected =
              selectedCard &&
              selectedCard.cardData.cardID === card.cardID &&
              selectedCard.type === 'movement';
            return (
              <RenderMovementCard
                key={index}
                card={card}
                isSelected={isSelected ?? false}
              />
            );
          })}
        </HStack>
      </Box>
    </>
  );
}
