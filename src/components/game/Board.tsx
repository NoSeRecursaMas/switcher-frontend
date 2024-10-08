import { Button, HStack, VStack, Box } from '@chakra-ui/react';
import type { Tile, LocalTile } from "../../types/gameTypes";
import { Color } from "../../types/gameTypes";
import Ficha1 from "/Ficha1.png";
import Ficha2 from "/Ficha2.png";
import Ficha3 from "/Ficha3.png";
import Ficha4 from "/Ficha4.png";

function Tile(tileData: LocalTile) {

    let img;
    switch (tileData.data.color) {
        case Color.R:
            img = Ficha1;
            break;
        case Color.G:
            img = Ficha2;
            break;
        case Color.B:
            img = Ficha3;
            break;
        case Color.Y:
            img = Ficha4;
            break;
    }

    // Por ahora, clickear un tile indica el valor del tile
    const handleClick = () => {
        console.log(tileData.data.color);
    }

    return (
        <Button
            onClick={handleClick}
            backgroundImage={img}
            backgroundSize="cover"
            variant="unstyled"
            width="80px"
            height="80px"
            borderRadius="20px"
            _hover={{
                transform: "scale(1.1)"
            }}
            boxShadow={tileData.isHighlighted ? "0 0 5px 2px gray" : "none"}
        >
        </Button>
    );
}


export default function Board({ tiles }: { tiles: LocalTile[] }) {
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
                            <Tile key={i} {...tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(6, 12).map((tile, i) => (
                            <Tile key={i} {...tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(12, 18).map((tile, i) => (
                            <Tile key={i} {...tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(18, 24).map((tile, i) => (
                            <Tile key={i} {...tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(24, 30).map((tile, i) => (
                            <Tile key={i} {...tile} />
                        ))}
                    </HStack>
                    <HStack>
                        {tiles.slice(30, 36).map((tile, i) => (
                            <Tile key={i} {...tile} />
                        ))}
                    </HStack>
                </VStack>
            </Box>
        </>
    )
}