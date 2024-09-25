import { Box, HStack, Button, VStack } from "@chakra-ui/react";
import FiguraPlaceholder from "/FiguraPlaceholder.png";

function FigureCard({ value }: { value: number }) {
    // Reemplazar por los assets cuando estén hechos
    let img;
    switch (value) {
        case 1:
            img = FiguraPlaceholder;
            break;
        case 2:
            img = FiguraPlaceholder;
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