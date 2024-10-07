import { Box, HStack, Button } from "@chakra-ui/react";
import L1 from "/movementCards/L1.png";
import L2 from "/movementCards/L2.png";
import Lineal1 from "/movementCards/Lineal1.png";
import Lineal2 from "/movementCards/Lineal2.png";
import Diagonal1 from "/movementCards/Diagonal1.png";
import Diagonal2 from "/movementCards/Diagonal2.png";
import LineaLateral from "/movementCards/LineaLateral.png";

function MoveCard({ value }: { value: number }) {
    let img;
    switch (value) {
        case 1:
            img = L1;
            break;
        case 2:
            img = L2;
            break;
        case 3:
            img = Lineal1;
            break;
        case 4:
            img = Lineal2;
            break;
        case 5:
            img = Diagonal1;
            break;
        case 6:
            img = Diagonal2;
            break;
        case 7:
            img = LineaLateral;
            break;
    }


    const handleClick = () => {
        console.log(value);
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
        </Button>
    );
}

export default function MoveDeck({ move }: { move: number[] }) {
    return (
        <>
            <Box
                height="auto"
                width="auto"
                justifyContent="center"
                padding="10px"
            >
                <HStack>
                    {move.map((value, index) => (
                        <MoveCard key={index} value={value} />
                    ))}
                </HStack>
            </Box>
        </>
    )
}