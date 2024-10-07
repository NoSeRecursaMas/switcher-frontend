import { Box, HStack, Button, VStack } from "@chakra-ui/react";
import FiguraPlaceholder from "/FiguraPlaceholder.png";
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

const figureImages = [
    FiguraPlaceholder, // index 0 for default
    fig01, fig02, fig03, fig04, fig05, fig06, fig07, fig08, fig09,
    fig10, fig11, fig12, fig13, fig14, fig15, fig16, fig17, fig18,
    fige01, fige02, fige03, fige04, fige05, fige06, fige07
];

function FigureCard({ value }: { value: number }) {
    const img = figureImages[value] || FiguraPlaceholder;

    const handleClick = () => {
        console.log(value);
    }

    return (
        <Button
            onClick={handleClick}
            backgroundImage={img}
            backgroundSize="cover"
            variant="unstyled"
            width="150px"
            height="150px"
            ml="3px"
            mr="3px"
            _hover={{
                transform: "scale(1.1)"
            }}
        >
        </Button>
    );
}


export default function FigureDeck({ figure, vertical }: { figure: number[], vertical: boolean }) {
    return (
        <>
            <Box
                height="auto"
                width="auto"
                justifyContent="center"
                padding="10px"
            >
                {vertical ?
                    <VStack>
                        {figure.map((value, index) => (
                            <FigureCard key={index} value={value} />
                        ))}
                    </VStack>
                    :
                    <HStack>
                        {figure.map((value, index) => (
                            <FigureCard key={index} value={value} />
                        ))}
                    </HStack>
                }
            </Box>
        </>
    )
}