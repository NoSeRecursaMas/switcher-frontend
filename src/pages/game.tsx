import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Skeleton, Box, Text, VStack, CardBody, HStack, Heading, Card, Center, Button, Flex } from "@chakra-ui/react";
import { roomData } from '../api/room/room-types';
import Board from '../components/game/board';
import MoveDeck from '../components/game/moveDeck';
import { useUser } from "../context/user-context";

// Mocks de datos para pruebas

const roomMock = {
    roomID: 11,
    roomName: 'Sala de prueba',
    minPlayers: 3,
    maxPlayers: 4,
    currentPlayers: 4,
    started: true,
    private: false,
    hostID: 1
};

const playersMock = [
    { playerID: 0, name: 'Jugador 1', move: [1, 2, 3] },
    { playerID: 1, name: 'Jugador 2', move: [4, 5, 6] },
    { playerID: 2, name: 'Jugador 3', move: [7, 1, 3] },
    { playerID: 3, name: 'Jugador 4', move: [7, 1, 3] }
];

const randomBoard = (Array(36).fill(0).map(() => Math.floor(Math.random() * 4) + 1))
const statusMock = {
    turn: 1,
    turnOrder: [2, 1, 0, 3],
    lastColor: 2,
    board: randomBoard,
    handMovementCards: [],
    players: playersMock,
};



export default function Game() {
    const { user } = useUser();
    const id = useParams().ID;
    const [roomInfo, setRoomInfo] = useState(roomMock);
    const [gameStatus, setGameStatus] = useState(statusMock);


    // Mano de cartas de movimiento mockeada, hay que cambiar el estado inicial por la que se reciba del backend ya randomizada, ID de las cartas va del 1 al 7
    const [move, setMove] = useState<number[]>(Array(3).fill(0).map(() => Math.floor(Math.random() * 7) + 1));
    
    return (
        <>
        <Box bg="#2e3940" height="100vh">
            {/* Contenedor general */}
            <Flex direction="column" height="100%" alignItems="center" justifyContent="space-between">

                {/* Nombres de los jugadores en la parte superior */}
                <HStack justifyContent="center" mb={4}>
                    {gameStatus.players.slice(0, 1).map((player, index) => (
                        <VStack key={index} spacing={2}>
                            <Text color="white" fontWeight="bold">{player.name}</Text>
                            <MoveDeck move={player.move} />
                        </VStack>
                    ))}
                </HStack>

                {/* Contenedor central para el tablero y jugadores laterales */}
                <Flex justifyContent="center" alignItems="center" flexGrow={1} width="100%">
                    {/* Jugador en el lado izquierdo */}
                    <VStack alignItems="center" spacing={4} mr={4}>
                        {gameStatus.players.slice(1, 2).map((player, index) => (
                            <>
                                <Text color="white" fontWeight="bold">{player.name}</Text>
                                <MoveDeck move={player.move} />
                            </>
                        ))}
                    </VStack>

                    {/* Tablero centrado */}
                    <Board tiles={gameStatus.board} />

                    {/* Jugador en el lado derecho */}
                    <VStack alignItems="center" spacing={4} ml={4}>
                        {gameStatus.players.slice(2, 3).map((player, index) => (
                            <>
                                <Text color="white" fontWeight="bold">{player.name}</Text>
                                <MoveDeck move={player.move} />
                            </>
                        ))}
                    </VStack>
                </Flex>

                {/* Interfaz del jugador actual en la parte inferior */}
                <Box width="100%" py={4} bg="#2e3940">
                    <VStack spacing={4}>
                        {/* Mano de cartas de movimiento del jugador actual */}
                        <MoveDeck move={move} />

                        {/* Botones para las acciones del jugador */}
                        <HStack spacing={4}>
                            <Button colorScheme="red">Abandonar partida</Button>
                            <Button colorScheme="teal">Pasar turno</Button>
                        </HStack>

                        {/* Contador de cartas de movimiento */}
                        <Text color="white">Cartas restantes: {move.length}</Text>
                    </VStack>
                </Box>
            </Flex>
        </Box>
        </>
    )
}