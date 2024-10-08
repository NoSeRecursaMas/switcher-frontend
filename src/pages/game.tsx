import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Button, Flex } from "@chakra-ui/react";
import Board from '../components/game/board';
import MoveDeck from '../components/game/moveDeck';
import FigureDeck from '../components/game/figureDeck';
import { usePlayerStore } from "../stores/playerStore";
import { SlArrowUp, SlArrowDown, SlArrowLeft, SlArrowRight } from "react-icons/sl";
import useWebSocket from "react-use-websocket";
import SocketMessage from "../types/socketTypes";
import { useGame } from "../hooks/useGame"; // Asumiendo que va a haber un hook de Game
import { Game, LocalTile, LocalMovementCard, LocalFigureCard, Color, Figure, Movement, FigureTiles, MovementCard, FigureCard, Tile } from "../types/gameTypes";


// Mocks de datos para pruebas, eliminar
const playersMock = [
    {
        position: 1,
        username: "Jugador local",
        playerID: 1,
        isActive: 1,
        sizeDeckFigure: 6,
        cardsFigure: randomFigureHand(),
    },
    {
        position: 2,
        username: "Player 2",
        playerID: 2,
        isActive: 1,
        sizeDeckFigure: 5,
        cardsFigure: randomFigureHand(),
    },
    {
        position: 3,
        username: "Player 3",
        playerID: 3,
        isActive: 1,
        sizeDeckFigure: 4,
        cardsFigure: randomFigureHand(),
    },
    {
        position: 4,
        username: "Player 4",
        playerID: 4,
        isActive: 1,
        sizeDeckFigure: 3,
        cardsFigure: randomFigureHand(),
    },
];

function randomMovementHand(): MovementCard[] {
    const movements = [Movement.mov1, Movement.mov2, Movement.mov3, Movement.mov4, Movement.mov5, Movement.mov6, Movement.mov7];
    return Array(3).fill(0).map(() => ({ type: movements[Math.floor(Math.random() * movements.length)], cardID: 0, isUsed: false }));
}

function randomFigureHand(): FigureCard[] {
    const figures = [Figure.fig01, Figure.fig02, Figure.fig03, Figure.fig04, Figure.fig05, Figure.fig06, Figure.fig07, Figure.fig08, Figure.fig09, Figure.fig10, Figure.fig11, Figure.fig12, Figure.fig13, Figure.fig14, Figure.fig15, Figure.fig16, Figure.fig17, Figure.fig18, Figure.fige01, Figure.fige02, Figure.fige03, Figure.fige04, Figure.fige05, Figure.fige06, Figure.fige07];
    return Array(3).fill(0).map(() => ({ type: figures[Math.floor(Math.random() * figures.length)], cardID: 0, isBlocked: false }));
}

function getRandomColor(): Color {
    const colors = [Color.R, Color.G, Color.B, Color.Y];
    return colors[Math.floor(Math.random() * colors.length)];
}

const boardMock: Tile[] = Array(36).fill(0).map((_, i) => ({ posX: i % 6, posY: Math.floor(i / 6), color: getRandomColor(), isPartial: false }));

let figureToUseMock: FigureTiles[] = [];

const statusMock: Game = {
    board: boardMock,
    figureToUse: figureToUseMock,
    prohibitedColor: null,
    cardsMovement: randomMovementHand(),
    posEnabledToPlay: 3,
    players: playersMock,
};



export default function Game() {
    const { player } = usePlayerStore();
    const { ID } = useParams();
    // const { game, leaveGame, updateGame } = useGame(parseInt(ID ?? ""));
    const gameID = ID ?? "0";
    const playerID = player?.playerID.toString() ?? "0";

    const socketUrl = `ws://localhost:8000/ws/${gameID}/${playerID}`;
    const { lastMessage, getWebSocket } = useWebSocket(socketUrl);
    console.log("Intenando conectarse a: ", socketUrl);

    useEffect(() => {
        if (lastMessage) {
            const message = JSON.parse(lastMessage.data as string) as SocketMessage;
            if (message.type === "UPDATE_GAME"){
                updateGame(message.payload.status);
            }
        }
    }, [lastMessage]);

    // Mock de estado del juego, reemplazar por el estado de game obtenido del websocket
    const [game, setGameStatus] = useState(statusMock);

    // Mock de ID de usuario, reemplazar más adelante todas sus instancias por player.id y eliminarla
    const userID_Mock = 1;

    // Obtener información del jugador que corresponde
    const currentPlayer = game.players.find(player => player.playerID === userID_Mock);

    // Filtramos al resto de jugadores para renderizarlos
    const otherPlayers = game.players.filter(player => player.playerID !== userID_Mock);

    
    // Extendemos el estado del juego con la información local
    let move = game.cardsMovement.map(card => ({ data: card, isSelected: false }));
    let figure = currentPlayer.cardsFigure.map(card => ({ data: card, isSelected: false }));
    let otherPlayersFigures = otherPlayers.map(player => ({ cardsFigure: player.cardsFigure.map(card => ({ data: card, isSelected: false })) }));
    let board = game.board.map(tile => ({ data: tile, isHighlighted: false }));

    // Pruebas de cosas seleccionadas, eliminar
    board[2].isHighlighted = true;
    move[1].isSelected = true;

    const [localMove, setLocalMove] = useState<LocalMovementCard[]>(move);
    const [localFigure, setLocalFigure] = useState<LocalFigureCard[]>(figure);
    const [localBoard, setLocalBoard] = useState<LocalTile[]>(board);

    return (
        <>
            <Box bg="#2e3940" height="100vh">
                <Flex direction="column" height="100%" alignItems="center" justifyContent="space-between">

                    {/* Jugador en la parte superior */}
                    <VStack justifyContent="center" alignItems="center">
                        <HStack justifyContent="center" minHeight="150px">
                            {otherPlayers[0] ? (
                                <>
                                    <FigureDeck figures={otherPlayersFigures[0].cardsFigure} vertical={false} />
                                    <Text color="white" fontWeight="bold">{otherPlayers[0].username}</Text>
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
                                        <Text color="white" fontWeight="bold">{otherPlayers[1].username}</Text>
                                        <FigureDeck figures={otherPlayersFigures[1].cardsFigure} vertical={true} />
                                    </>
                                ) : (
                                    <Box minHeight="150px" />
                                )}
                            </VStack>
                            {otherPlayers[1] && otherPlayers[1].position === game.posEnabledToPlay ? (
                                <>
                                    <SlArrowLeft size={30} color="white" />
                                </>
                            ) : (
                                <Box minWidth="30px" />
                            )}

                        </HStack>

                        {/* Tablero e indicadores de turno para los jugadores en vertical */}
                        <VStack>
                            {otherPlayers[0] && otherPlayers[0].position === game.posEnabledToPlay ? (
                                <SlArrowUp size={30} color="white" />
                            ) : (
                                <Box minHeight="30px" />
                            )}
                            <Board tiles={localBoard} />
                            {currentPlayer && currentPlayer.position === game.posEnabledToPlay ? (
                                <SlArrowDown size={30} color="white" />
                            ) : (
                                <Box minHeight="30px" />
                            )}
                        </VStack>

                        {/* Jugador en el lado derecho */}
                        <HStack>
                            {otherPlayers[2] && otherPlayers[2].playerID === game.posEnabledToPlay ? (
                                <>
                                    <SlArrowRight size={30} color="white" />
                                </>
                            ) : (
                                <Box minWidth="30px" />
                            )}
                            <VStack alignItems="center" spacing={4} ml={4} minWidth="150px">
                                {otherPlayers[2] ? (
                                    <>
                                        <Text color="white" fontWeight="bold">{otherPlayers[2].username}</Text>
                                        <FigureDeck figures={otherPlayersFigures[2].cardsFigure} vertical={true} />
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
                                <MoveDeck cards={localMove} />
                                <FigureDeck figures={localFigure} vertical={false} />
                                <Button colorScheme="red">Abandonar partida</Button>
                                <Button colorScheme="teal">Pasar turno</Button>
                            </HStack>
                        </Box>
                    )}
                </Flex>
            </Box>
        </>
    );
}