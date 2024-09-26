import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Skeleton, Box, Text, VStack, CardBody, HStack, Heading, Card, Center, Button } from "@chakra-ui/react";
import { roomData } from '../api/room/room-types';
import { useUser } from "../context/user-context";
import { FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { startGameEndpoint } from "../api/room/room-startGame-endpoints";

// Lista de jugadores de ejemplo
const playersMock = [
    { id: 1, name: "Jugador 1" },
    { id: 2, name: "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW" },
    { id: 3, name: "Jugador 3" },
    { id: 4, name: "Jugador 4" },
];

const roomMock = {
    roomID: 11,
    roomName: 'Sala de Pruebas',
    minPlayers: 3,
    maxPlayers: 4,
    currentPlayers: 4,
    started: false,
    private: false,
    hostID: 3
};

export default function Room() {
    const { user } = useUser();
    const id = useParams().ID; // Quizás no sea necesaria, ya accedemos a la info de la sala de otra forma
    const navigate = useNavigate();

    // Mock de ID de usuario, reemplazar más adelante todas sus instancias por user.id
    const userID_Mock = 1;

    // Reemplazar por llamada a API para obtener información de la sala
    const [roomInfo, setRoomInfo] = useState(roomMock);
    const [players, setPlayers] = useState(playersMock);
    const [loading, setLoading] = useState(false);

    const isMinReached = roomInfo.currentPlayers >= roomInfo.minPlayers;

    const startGame = async () => {
        await startGameEndpoint(roomInfo.hostID, roomInfo.roomID, navigate);
    };

    return (
        <>
            <Center h="100vh">
                <Card w="25em">
                    <CardBody>
                        <Skeleton isLoaded={!loading}>
                            <VStack>
                                <Heading
                                    size="lg"
                                    textAlign="center"
                                    wordBreak="break-word"
                                    whiteSpace="normal"
                                    overflowWrap="break-word">
                                    {roomInfo.roomName}
                                </Heading>
                            </VStack>
                            <Center>
                                <Text mt={2} color={isMinReached ? "green.500" : "red.500"}>
                                    {roomInfo.currentPlayers}/{roomInfo.maxPlayers}
                                </Text>
                            </Center>
                            <VStack spacing={4} align="start" w="100%">
                                {players.map((player) => (
                                    <Box
                                        key={player.id}
                                        p={4}
                                        w="100%"
                                        borderWidth="1px"
                                        borderRadius="md"
                                    >
                                        <HStack>
                                            <Text fontSize="lg"
                                                textAlign="left"
                                                wordBreak="break-word"
                                                whiteSpace="normal"
                                                overflowWrap="break-word">{player.name}</Text> {roomInfo.hostID === player.id && <FaCrown color="gold" />}
                                        </HStack>
                                    </Box>
                                ))}
                            </VStack>
                        </Skeleton>
                        <HStack justifyContent="space-between">
                            <Button colorScheme="red" mt={5}>
                                Abandonar sala
                            </Button>
                            {roomInfo.hostID === userID_Mock && (
                                <Button colorScheme="teal" mt={5} onClick={startGame}>
                                    Iniciar partida
                                </Button>)
                            }
                        </HStack>
                    </CardBody>
                </Card >
            </Center>
        </>
    );
}