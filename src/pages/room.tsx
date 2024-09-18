import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Skeleton, Box, Text, VStack, CardBody, HStack, Heading, Card, Center, Button } from "@chakra-ui/react";
import { roomData } from '../api/room/roomTypes';

// Las líneas comentadas se usarán cuando se puedan recibir datos de la sala

export default function Room() {
    const id = useParams().ID;
    // const [roomInfo, setRoomInfo] = useState<roomData>;
    const [loading, setLoading] = useState(false);

    // const isMinReached = roomInfo.currentPlayers >= roomInfo.minPlayers; 
    const isMinReached = true;

    // Lista de jugadores de ejemplo
    const players = [
        { id: 1, username: "Jugador 1" },
        { id: 2, username: "Jugador 2" },
        { id: 3, username: "Jugador 3" },
        { id: 4, username: "Jugador 4" },
    ];

    return (
        <>
            <Center h="100vh">
                <Card w="25em">
                    <CardBody>
                        <Skeleton isLoaded={!loading}>
                            <VStack>
                                {/* <Heading size="4xl">{roomInfo ? roomInfo.name : "Sala"}</Heading> */}

                                {/* Ejemplo hardcodeado*/}
                                <Heading size="3xl" as="b" >Sala</Heading>
                            </VStack>
                            <Center>
                                {/* <Text mt={2} color={isMinReached ? "green.500" : "red.500"}>
                            {currentPlayers}/{maxPlayers}
                            </Text> */}

                                {/* Ejemplo hardcodeado*/}
                                <Text mt={2} mb={2} color={isMinReached ? "green.500" : "red.500"}>
                                    4/4
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
                                        <Text fontSize="lg">{player.username}</Text>
                                    </Box>
                                ))}
                            </VStack>
                        </Skeleton>
                        <HStack justifyContent="space-between">
                            <Button colorScheme="red" mt={5}>
                                Abandonar sala
                            </Button>

                            {/*Falta chequeo para mostrar este botón solamente al administrador*/}
                            <Button colorScheme="teal" mt={5}>
                                Iniciar partida
                            </Button>
                        </HStack>
                    </CardBody>
                </Card >
            </Center>
        </>
    );
}