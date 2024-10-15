import { useParams } from "react-router-dom";
import { VStack, HStack, Button, Center, Box } from "@chakra-ui/react";
import Board from "../components/game/board";
import OtherPlayer from "../components/game/otherPlayer";
import MoveDeck from "../components/game/moveDeck";
import FigureDeck from "../components/game/figureDeck";
import { SlArrowUp } from "react-icons/sl";
import { useGame } from "../hooks/useGame";
import { useGameWebSocket } from "../hooks/useGameWebSocket";

export default function Game() {
  const { ID } = useParams();
  const { currentPlayer, otherPlayersInPos, endTurn, leaveGame, posEnabledToPlay, cardsMovement } =
    useGame();

  useGameWebSocket(parseInt(ID ?? ""));

  return (
    <Center>
      <VStack h="100vh" justifyContent="space-between" py={4}>
        <OtherPlayer player={otherPlayersInPos.top} pos="up" />
        <HStack spacing={4}>
          <OtherPlayer player={otherPlayersInPos.left} pos="left" />
          <Board />
          <OtherPlayer player={otherPlayersInPos.right} pos="right" />
        </HStack>
        {posEnabledToPlay === currentPlayer?.position && (
          <SlArrowUp size="4vh" color="white" />
        )}
        <HStack w="90vw" justifyContent="space-between">
          <Box w="10vw" />
          <HStack spacing={4}>
            <MoveDeck cards={cardsMovement ?? []} />
            <FigureDeck
              figures={currentPlayer?.cardsFigure ?? []}
              vertical={false}
            />
          </HStack>
          <VStack spacing={4}>
            <Button
              colorScheme="teal"
              isDisabled={posEnabledToPlay !== currentPlayer?.position}
              onClick={endTurn}
            >
              Pasar turno
            </Button>
            <Button colorScheme="red" onClick={leaveGame}>
              Abandonar partida
            </Button>
          </VStack>
        </HStack>
      </VStack>
    </Center>
  );
}
