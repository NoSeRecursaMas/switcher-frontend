import { Box, HStack, Button } from "@chakra-ui/react";
import L1 from "/movementCards/L1.png";
import L2 from "/movementCards/L2.png";
import Lineal1 from "/movementCards/Lineal1.png";
import Lineal2 from "/movementCards/Lineal2.png";
import Diagonal1 from "/movementCards/Diagonal1.png";
import Diagonal2 from "/movementCards/Diagonal2.png";
import LineaLateral from "/movementCards/LineaLateral.png";
import { Movement } from "../../types/gameTypes";
import type { LocalMovementCard } from "../../types/gameTypes";

function MoveCard(cardData: LocalMovementCard) {
    let img;
    switch (cardData.data.type) {
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

    const handleClick = () => {
        console.log(cardData.data.type);
    }

    return (
        <Button
            onClick={handleClick}
            backgroundImage={img}
            backgroundSize="cover"
            variant="unstyled"
            width="130px"
            height="176px"
            ml="3px"
            mr="3px"
            _hover={{
                transform: "scale(1.1)"
            }}
        >
            {/* Temporal */}
            {cardData.isSelected ? <Box top="0" right="0" color="red">X</Box> : null}
        </Button>
    );
}

export default function MoveDeck({cards} : {cards: LocalMovementCard[]}) {
    return (
        <>
            <Box
                height="auto"
                width="auto"
                justifyContent="center"
                padding="10px"
            >
                <HStack>
                    {cards.map((card, index) => (
                        <MoveCard key={index} {...card} />
                    ))}
                </HStack>
            </Box>
        </>
    )
}