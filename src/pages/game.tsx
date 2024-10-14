import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  Spacer,
  Center,
} from "@chakra-ui/react";
import Board from "../components/game/board";
import OtherPlayer from "../components/game/otherPlayer";
import MoveDeck from "../components/game/moveDeck";
import FigureDeck from "../components/game/figureDeck";
import { usePlayerStore } from "../stores/playerStore";
import {
    SlArrowUp,
  
  } from "react-icons/sl";
import { useGame } from "../hooks/useGame";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import {
  GameInfo,
  LocalTile,
  LocalMovementCard,
  LocalFigureCard,
  Color,
  Figure,
  Movement,
  FigureTiles,
  MovementCard,
  FigureCard,
  Tile,
} from "../types/gameTypes";

export default function Game() {
  const { player } = usePlayerStore();
  const { ID } = useParams();
  const { game, currentPlayer, otherPlayers } = useGame();

  useGameWebSocket(parseInt(ID ?? ""));

  const get_player_in_position = (pos: "up" | "left" | "right") => {
    if (!otherPlayers) return null;
    if (otherPlayers.length == 1) {
      if (pos === "up")
        return <OtherPlayer player={otherPlayers[0]} pos="up" />;
      else return null;
    } else if (otherPlayers.length == 2) {
      if (pos === "right")
        return <OtherPlayer player={otherPlayers[0]} pos="right" />;
      if (pos === "left")
        return <OtherPlayer player={otherPlayers[1]} pos="left" />;
      else return null;
    } else if (otherPlayers.length == 3) {
      if (pos === "right")
        return <OtherPlayer player={otherPlayers[0]} pos="right" />;
      if (pos === "up")
        return <OtherPlayer player={otherPlayers[1]} pos="up" />;
      else return <OtherPlayer player={otherPlayers[2]} pos="left" />;
    }
    return null;
  };

  // Extendemos el estado del juego con la información local
  // const move = game?.cardsMovement.map(card => ({ data: card, isSelected: false }));
  // const figure = currentPlayer?.cardsFigure.map(card => ({ data: card, isSelected: false }));
  // const otherPlayersFigures = otherPlayers?.map(player => ({ cardsFigure: player.cardsFigure.map(card => ({ data: card, isSelected: false })) }));
  // const board = game?.board.map(tile => ({ data: tile, isHighlighted: false }));

  // const [localMove, setLocalMove] = useState<LocalMovementCard[]>(move);
  // const [localFigure, setLocalFigure] = useState<LocalFigureCard[]>(figure);
  // const [localBoard, setLocalBoard] = useState<LocalTile[]>(board);

  return (
    <Center my={4}>
      <VStack spacing={4}>
        {get_player_in_position("up")}
        <HStack spacing={4}>
          {get_player_in_position("left")}
          <Board />
          {get_player_in_position("right")}
        </HStack>
        { game?.posEnabledToPlay === currentPlayer?.position && (
          <SlArrowUp size={30} color="white" />
        )}
        <HStack spacing={32}>
        <HStack spacing={8}>
            <MoveDeck cards={game?.cardsMovement ?? []} />
          <FigureDeck
            figures={currentPlayer?.cardsFigure ?? []}
            vertical={false}
          />
            </HStack>

          <HStack spacing={4}>
            <Button colorScheme="red">Abandonar partida</Button>
            <Button colorScheme="teal">Pasar turno</Button>
          </HStack>
        </HStack>
      </VStack>
    </Center>
  );
  //       <Box bg="#2e3940" height="100vh">
  //         <Flex
  //           direction="column"
  //           height="100%"
  //           alignItems="center"
  //           justifyContent="space-between"
  //         >
  //           {/* Jugador en la parte superior */}
  //           <VStack justifyContent="center" alignItems="center">
  //             <HStack justifyContent="center" minHeight="150px">
  //               {otherPlayers[0] ? (
  //                 <>
  //                   <FigureDeck
  //                     figures={otherPlayersFigures[0].cardsFigure}
  //                     vertical={false}
  //                   />
  //                   <Text color="white" fontWeight="bold">
  //                     {otherPlayers[0].username}
  //                   </Text>
  //                 </>
  //               ) : (
  //                 <Box minHeight="150px" />
  //               )}
  //             </HStack>
  //           </VStack>

  //           {/* Contenedor central para el tablero y jugadores laterales */}
  //           <Flex
  //             justifyContent="center"
  //             alignItems="center"
  //             flexGrow={1}
  //             width="100%"
  //           >
  //             {/* Jugador en el lado izquierdo */}
  //             <HStack>
  //               <VStack alignItems="center" spacing={4} mr={4} minWidth="150px">
  //                 {otherPlayers[1] ? (
  //                   <>
  //                     <Text color="white" fontWeight="bold">
  //                       {otherPlayers[1].username}
  //                     </Text>
  //                     <FigureDeck
  //                       figures={otherPlayersFigures[1].cardsFigure}
  //                       vertical={true}
  //                     />
  //                   </>
  //                 ) : (
  //                   <Box minHeight="150px" />
  //                 )}
  //               </VStack>
  //               {otherPlayers[1] &&
  //               otherPlayers[1].position === game.posEnabledToPlay ? (
  //                 <>
  //                   <SlArrowLeft size={30} color="white" />
  //                 </>
  //               ) : (
  //                 <Box minWidth="30px" />
  //               )}
  //             </HStack>

  //             {/* Tablero e indicadores de turno para los jugadores en vertical */}
  //             <VStack>
  //               {otherPlayers[0] &&
  //               otherPlayers[0].position === game.posEnabledToPlay ? (
  //                 <SlArrowUp size={30} color="white" />
  //               ) : (
  //                 <Box minHeight="30px" />
  //               )}
  //               <Board tiles={localBoard} />
  //               {currentPlayer &&
  //               currentPlayer.position === game.posEnabledToPlay ? (
  //                 <SlArrowDown size={30} color="white" />
  //               ) : (
  //                 <Box minHeight="30px" />
  //               )}
  //             </VStack>

  //             {/* Jugador en el lado derecho */}
  //             <HStack>
  //               {otherPlayers[2] &&
  //               otherPlayers[2].playerID === game.posEnabledToPlay ? (
  //                 <>
  //                   <SlArrowRight size={30} color="white" />
  //                 </>
  //               ) : (
  //                 <Box minWidth="30px" />
  //               )}
  //               <VStack alignItems="center" spacing={4} ml={4} minWidth="150px">
  //                 {otherPlayers[2] ? (
  //                   <>
  //                     <Text color="white" fontWeight="bold">
  //                       {otherPlayers[2].username}
  //                     </Text>
  //                     <FigureDeck
  //                       figures={otherPlayersFigures[2].cardsFigure}
  //                       vertical={true}
  //                     />
  //                   </>
  //                 ) : (
  //                   <Box minHeight="150px" />
  //                 )}
  //               </VStack>
  //             </HStack>
  //           </Flex>

  //           {/* Interfaz del jugador actual en la parte inferior */}
  //           {currentPlayer && (
  //             <Box width="100%" py={4} bg="#2e3940">
  //               <HStack spacing={4} justifyContent="center" alignItems="center">
  //                 <MoveDeck cards={localMove} />
  //                 <FigureDeck figures={localFigure} vertical={false} />
  //                 <Button colorScheme="red">Abandonar partida</Button>
  //                 <Button colorScheme="teal">Pasar turno</Button>
  //               </HStack>
  //             </Box>
  //           )}
  //         </Flex>
  //       </Box>
  //     </>
  //   );
}
