import { useParams } from "react-router-dom";
import { VStack, HStack, Button, Center, Spacer, Box } from "@chakra-ui/react";
import Board from "../components/game/board";
import OtherPlayer from "../components/game/otherPlayer";
import MoveDeck from "../components/game/moveDeck";
import FigureDeck from "../components/game/figureDeck";
import { SlArrowUp } from "react-icons/sl";
import { useGame } from "../hooks/useGame";
import { useGameWebSocket } from "../hooks/useGameWebSocket";

export default function Game() {
  const { ID } = useParams();
  const { game, currentPlayer, getPlayerInPosition, endTurn, leaveGame } =
    useGame();

  useGameWebSocket(parseInt(ID ?? ""));

  return (
    <Center>
      <VStack h="100vh" justifyContent="space-between" py={4}>
        <OtherPlayer player={getPlayerInPosition("up")} pos="up" />
        <HStack spacing={4}>
          <OtherPlayer player={getPlayerInPosition("left")} pos="left" />
          <Board />
          <OtherPlayer player={getPlayerInPosition("right")} pos="right" />
        </HStack>
        {game?.posEnabledToPlay === currentPlayer?.position && (
          <SlArrowUp size="4vh" color="white" />
        )}
        <HStack w="90vw" justifyContent="space-between">
          <Box w="10vw" />
          <HStack spacing={4}>
            <MoveDeck cards={game?.cardsMovement ?? []} />
            <FigureDeck
              figures={currentPlayer?.cardsFigure ?? []}
              vertical={false}
            />
          </HStack>
          <VStack spacing={4}>
            <Button
              colorScheme="teal"
              isDisabled={game?.posEnabledToPlay !== currentPlayer?.position}
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
