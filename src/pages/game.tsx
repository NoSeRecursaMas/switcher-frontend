import { useParams } from "react-router-dom";
import { VStack, HStack, Button, Center } from "@chakra-ui/react";
import Board from "../components/game/board";
import OtherPlayer from "../components/game/otherPlayer";
import MoveDeck from "../components/game/moveDeck";
import FigureDeck from "../components/game/figureDeck";
import { usePlayerStore } from "../stores/playerStore";
import { SlArrowUp } from "react-icons/sl";
import { useGame } from "../hooks/useGame";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import {
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
  const { ID } = useParams();
  const { game, currentPlayer, getPlayerInPosition, endTurn } = useGame();

  useGameWebSocket(parseInt(ID ?? ""));

  return (
    <Center my={4}>
      <VStack spacing={4}>
        <OtherPlayer player={getPlayerInPosition("up")} pos="up" />
        <HStack spacing={4}>
          <OtherPlayer player={getPlayerInPosition("left")} pos="left" />
          <Board />
          <OtherPlayer player={getPlayerInPosition("right")} pos="right" />
        </HStack>
        {game?.posEnabledToPlay === currentPlayer?.position && (
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
            {/* <Button colorScheme="red">Abandonar partida</Button> */}
            <Button
              colorScheme="teal"
              isDisabled={game?.posEnabledToPlay !== currentPlayer?.position}
              onClick={endTurn}
            >
              Pasar turno
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Center>
  );
}
