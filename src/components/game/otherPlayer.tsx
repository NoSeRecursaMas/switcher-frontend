import { PlayerInGame } from '../../types/gameTypes';
import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import FigureDeck from './figureDeck';
import { SlArrowUp, SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { useGame } from '../../hooks/useGame';

interface OtherPlayerProps {
  player: PlayerInGame | undefined;
  pos: 'up' | 'left' | 'right';
}

export default function OtherPlayer(props: OtherPlayerProps) {
  const { player, pos } = props;
  const { posEnabledToPlay } = useGame();

  if (!player) return null;

  return (
    <>
      {pos === 'left' || pos === 'right' ? (
        <HStack spacing={2}>
          {pos === 'right' && posEnabledToPlay === player.position && (
            <SlArrowRight size="4vh" color="white" aria-label="ArrowLeft" />
          )}
          <VStack spacing={4}>
            <HStack>
              <Avatar size="md" as="b" name={player.username} />
              <Text>{player.isActive ? player.username : 'Desconectado'}</Text>
            </HStack>
            <FigureDeck figures={player.cardsFigure} vertical={true} />
          </VStack>
          {pos === 'left' && posEnabledToPlay === player.position && (
            <SlArrowLeft size="4vh" color="white" aria-label="ArrowRight" />
          )}
        </HStack>
      ) : (
        <>
          <HStack spacing={4}>
            <VStack>
              <Avatar size="md" as="b" name={player.username} />
              <Text>{player.isActive ? player.username : 'Desconectado'}</Text>
            </VStack>
            <FigureDeck figures={player.cardsFigure} vertical={false} />
          </HStack>
          {posEnabledToPlay === player.position && (
            <SlArrowUp size="4vh" color="white" aria-label="ArrowDown" />
          )}
        </>
      )}
    </>
  );
}
