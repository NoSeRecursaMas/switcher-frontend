import { useParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  Button,
  Center,
  Box,
  IconButton,
} from '@chakra-ui/react';
import Board from '../components/game/board';
import PlayerInfo from '../components/game/playerInfo';
import MoveDeck from '../components/game/moveDeck';
import FigureDeck from '../components/game/figureDeck';
import CountdownComponent from '../components/game/countdown';
import { SlArrowDown } from 'react-icons/sl';
import { useGame } from '../hooks/useGame';
import { useGameWebSocket } from '../hooks/useGameWebSocket';
import { TfiBackLeft } from 'react-icons/tfi';

export default function Game() {
  const { ID } = useParams();
  const {
    currentPlayer,
    otherPlayersInPos,
    turnTimestamp,
    endTurn,
    cancelMove,
    leaveGame,
    posEnabledToPlay,
    cardsMovement,
  } = useGame();

  useGameWebSocket(parseInt(ID ?? ''));

  return (
    <Center>
      <VStack h="100vh" justifyContent="space-between" py={4}>
        <PlayerInfo player={otherPlayersInPos.top} pos="up" />
        <HStack spacing={4}>
          <PlayerInfo player={otherPlayersInPos.left} pos="left" />
          <Board />
          <PlayerInfo player={otherPlayersInPos.right} pos="right" />
        </HStack>
        {posEnabledToPlay === currentPlayer?.position && (
          <SlArrowDown
            size="4vh"
            color="white"
            aria-label="Bottom player turn"
          />
        )}
        <CountdownComponent timestamp={turnTimestamp} />
        <HStack w="90vw" justifyContent="space-between">
          <Box w="10vw" />
          <HStack spacing={4}>
            <MoveDeck cards={cardsMovement ?? []} />
            <FigureDeck
              figures={currentPlayer?.cardsFigure ?? []}
              vertical={false}
            />
          </HStack>
          <HStack spacing={4}>
            <IconButton
              icon={<TfiBackLeft size="4vh" color="white" />}
              aria-label="Cancelar movimiento"
              variant="ghost"
              isDisabled={
                !cardsMovement?.map((card) => card.isUsed).includes(true) ||
                posEnabledToPlay !== currentPlayer?.position
              }
              onClick={cancelMove}
            />
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
        </HStack>
      </VStack>
    </Center>
  );
}
