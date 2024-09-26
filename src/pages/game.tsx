import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Box, Text, VStack, HStack, Button, Flex } from "@chakra-ui/react";
import Board from '../components/game/board';
import MoveDeck from '../components/game/moveDeck';
import FigureDeck from '../components/game/figureDeck';
import { useUser } from "../context/user-context";
import { SlArrowUp, SlArrowDown, SlArrowLeft, SlArrowRight } from "react-icons/sl";

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
    { playerID: 1, name: 'Jugador 1', figureHand: [1, 2, 2], figureLeft: 7 },
    { playerID: 2, name: 'Jugador de Arriba', figureHand: [1, 2, 2], figureLeft: 3 },
    { playerID: 3, name: 'Jugador Izquierdo', figureHand: [1, 2, 2], figureLeft: 2 },
    { playerID: 4, name: 'Jugador Derecho', figureHand: [1, 2, 2], figureLeft: 0 },
];

const randomBoard = (Array(36).fill(0).map(() => Math.floor(Math.random() * 4) + 1));
const statusMock = {
    turn: 1,
    turnOrder: [2, 1, 4, 3],
    lastColor: 2,
    board: randomBoard,
    handMovementCards: [],
    players: playersMock,
};

export default function Game() {
    const { user } = useUser();
    const id = useParams().ID;

    // Reemplazar por llamada a API para obtener información de la sala
    const [roomInfo, setRoomInfo] = useState(roomMock);
    const [gameStatus, setGameStatus] = useState(statusMock);

    // Mock de ID de usuario, reemplazar más adelante todas sus instancias por user.id
    const userID_Mock = 1;

    // Obtener información del jugador que corresponde
    const currentPlayer = gameStatus.players.find(player => player.playerID === userID_Mock);

    // Filtramos al resto de jugadores para renderizarlos
    const otherPlayers = gameStatus.players.filter(player => player.playerID !== userID_Mock);

    // Mock de cartas de movimiento
    const [move, setMove] = useState<number[]>(Array(3).fill(0).map(() => Math.floor(Math.random() * 7) + 1));

    return (
        <>
            <Box bg="#2e3940" height="100vh">
                <Flex direction="column" height="100%" alignItems="center" justifyContent="space-between">

                    {/* Jugador en la parte superior */}
                    <VStack justifyContent="center" alignItems="center">
                        <HStack justifyContent="center" minHeight="150px">
                            {otherPlayers[0] ? (
                                <>
                                    <FigureDeck figure={otherPlayers[0].figureHand} vertical={false} />
                                    <Text color="white" fontWeight="bold">{otherPlayers[0].name}</Text>
                                </>
                            ) : (
                                <Box minHeight="150px" />
                            )}
                        </HStack>
                    </VStack>

                    {/* Contenedor central para el tablero y jugadores laterales */}
                    <Flex justifyContent="center" alignItems="center" flexGrow={1} width="100%">

                        {/* Jugador en el lado izquierdo */}
                        <HStack>
                            <VStack alignItems="center" spacing={4} mr={4} minWidth="150px">
                                {otherPlayers[1] ? (
                                    <>
                                        <Text color="white" fontWeight="bold">{otherPlayers[1].name}</Text>
                                        <FigureDeck figure={otherPlayers[1].figureHand} vertical={true} />
                                    </>
                                ) : (
                                    <Box minHeight="150px" />
                                )}
                            </VStack>
                            {otherPlayers[1] && otherPlayers[1].playerID === gameStatus.turn ? (
                                <>
                                    <SlArrowLeft size={30} color="white" />
                                </>
                            ) : (
                                <Box minWidth="30px" />
                            )}

                        </HStack>

                        {/* Tablero e indicadores de turno para los jugadores en vertical */}
                        <VStack>
                            {otherPlayers[0] && otherPlayers[0].playerID === gameStatus.turn ? (
                                <SlArrowUp size={30} color="white" />
                            ) : (
                                <Box minHeight="30px" />
                            )}
                            <Board tiles={gameStatus.board} />
                            {currentPlayer && currentPlayer.playerID === gameStatus.turn ? (
                                <SlArrowDown size={30} color="white" />
                            ) : (
                                <Box minHeight="30px" />
                            )}
                        </VStack>

                        {/* Jugador en el lado derecho */}
                        <HStack>
                            {otherPlayers[2] && otherPlayers[2].playerID === gameStatus.turn ? (
                                <>
                                    <SlArrowRight size={30} color="white" />
                                </>
                            ) : (
                                <Box minWidth="30px" />
                            )}
                            <VStack alignItems="center" spacing={4} ml={4} minWidth="150px">
                                {otherPlayers[2] ? (
                                    <>
                                        <Text color="white" fontWeight="bold">{otherPlayers[2].name}</Text>
                                        <FigureDeck figure={otherPlayers[2].figureHand} vertical={true} />
                                    </>
                                ) : (
                                    <Box minHeight="150px" />
                                )}
                            </VStack>
                        </HStack>
                    </Flex>

                    {/* Interfaz del jugador actual en la parte inferior */}
                    {currentPlayer && (
                        <Box width="100%" py={4} bg="#2e3940">
                            <HStack spacing={4} justifyContent="center" alignItems="center">
                                <MoveDeck move={move} />
                                <FigureDeck figure={currentPlayer.figureHand} vertical={false} />
                                <Button colorScheme="red">Abandonar partida</Button>
                                <Button colorScheme="teal">Pasar turno</Button>
                                <Text color="white">Cartas restantes: {move.length}</Text>
                            </HStack>
                        </Box>
                    )}
                </Flex>
            </Box>
        </>
    );
}