import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Skeleton, Box, Text, VStack, CardBody, HStack, Heading, Card, Center, Button, Flex } from "@chakra-ui/react";
import { roomData } from '../api/room/room-types';
import Board from '../components/game/Board';

export default function Game() {
    const id = useParams().ID;
    // const [roomInfo, setRoomInfo] = useState<roomData>;

    // Tablero mockeado, randomizado con numeros del 1 al 4, hay que cambiar el estado inicial por el que se reciba ya randomizado del backend
    const [tiles, setTiles] = useState<number[]>(Array(36).fill(0).map(() => Math.floor(Math.random() * 4) + 1));

    // Orden de turnos mockeado, hay que cambiar el estado inicial por el que se reciba del backend
    //const [turnOrder, setTurnOrder] = useState<number[]>([1, 2, 3, 4]);

    return (
        <>
        <Box bg="#2e3940">
            <Center h="100vh">
                <Board tiles={tiles} />
            </Center>
        </Box>
        </>
    )
}