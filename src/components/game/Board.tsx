import { Button, HStack, VStack, Box } from '@chakra-ui/react';
import Ficha1 from "/Ficha1.png";
import Ficha2 from "/Ficha2.png";
import Ficha3 from "/Ficha3.png";
import Ficha4 from "/Ficha4.png";

function Tile({ value }: { value: number }) {
    
    let img;
    switch (value) {
        case 1:
            img = Ficha1;
            break;
        case 2:
            img = Ficha2;
            break;
        case 3:
            img = Ficha3;
            break;
        case 4:
            img = Ficha4;
            break;
    }

    // Por ahora, clickear un tile indica el valor del tile
    const handleClick = () => {
        console.log(value);
    }

    return (
        <Button
        onClick={handleClick}
        backgroundImage={img}
        backgroundSize="cover"
        variant="unstyled"
        width="80px"
        height="80px"
        _hover={{
            transform: "scale(1.1)"
        }}
    >
        </Button>
    );
}


export default function Board({ tiles }: { tiles: number[] }) {
    return (
        <>
        {/* Borde que delimita el tablero */}
            <Box
                border="2px"
                borderColor="#5e666a"
                borderRadius="10px"
                width="auto"
                height="auto"
                justifyContent="center"
                padding="20px"
            >
                <VStack>
                    <HStack>
                        {tiles.slice(0, 6).map((tile, i) => (
                            <Tile key={i} value={tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(6, 12).map((tile, i) => (
                            <Tile key={i} value={tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(12, 18).map((tile, i) => (
                            <Tile key={i} value={tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(18, 24).map((tile, i) => (
                            <Tile key={i} value={tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(24, 30).map((tile, i) => (
                            <Tile key={i} value={tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(30, 36).map((tile, i) => (
                            <Tile key={i} value={tile} />
                        ))}
                    </HStack>
                </VStack>
            </Box>
        </>
    )
}