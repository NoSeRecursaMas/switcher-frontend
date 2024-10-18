import { usePlayerStore } from '../stores/playerStore';
import { useRoomStore } from '../stores/roomStore';
import { useGameStore } from '../stores/gameStore';
import {
  startGame as startGameEndpoint,
  turn as turnEndpoint,
  leaveGame as leaveGameEndpoint,
} from '../api/gameEndpoints';

import { handleNotificationResponse, sendToast } from '../services/utils';
import { useNavigate } from 'react-router-dom';
import { getPlayerInGame, getPlayersPositions } from '../services/gameUtils';
import {
  MovementCard,
  FigureCard,
  isFigureCard,
  isMovementCard,
} from '../types/gameTypes';
import {
  validatePlayerInGame,
  validatePlayerTurn,
  validatePlayerOwnerRoom,
} from '../services/validation/validators';

export const useGame = () => {
  const player = usePlayerStore((state) => state.player);
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const selectedCard = useGameStore((state) => state.selectedCard);
  const selectCard = useGameStore((state) => state.selectCard);
  const unselectCard = useGameStore((state) => state.unselectCard);
  const unselectTile = useGameStore((state) => state.unselectTile);
  const navigate = useNavigate();

  const handleClickCard = (card: MovementCard | FigureCard) => {
    if (!validatePlayerTurn(player, game)) return;

    if (isMovementCard(card) && card.isUsed) {
      sendToast('La carta ya ha sido utilizada', null, 'error');
      return;
    }
    console.log('card', card);
    if (isFigureCard(card) && card.isBlocked) {
      sendToast('La carta está bloqueada', null, 'error');
      return;
    }

    unselectTile();
    if (!selectedCard) {
      selectCard(card);
      return;
    }
    if (
      selectedCard.cardID === card.cardID &&
      selectedCard.type === card.type
    ) {
      unselectCard();
      return;
    }
    selectCard(card);
  };

  const currentPlayer = validatePlayerInGame(player, game)
    ? getPlayerInGame(player!, game!)
    : undefined;
  const otherPlayersUnordered = game?.players.filter(
    (playerInGame) => playerInGame.playerID !== player?.playerID
  );

  const otherPlayersInPos = getPlayersPositions(
    otherPlayersUnordered,
    currentPlayer?.position ?? -1
  );

  const posEnabledToPlay = game?.posEnabledToPlay;

  const cardsMovement = game?.cardsMovement;

  const startGame = async () => {
    if (!validatePlayerOwnerRoom(player, room)) return;

    const data = await startGameEndpoint(room!.roomID, {
      playerID: player!.playerID,
    });
    handleNotificationResponse(
      data,
      'Partida iniciada con éxito',
      'Error al intentar iniciar la partida',
      () => null
    );
  };

  const endTurn = async () => {
    if (!validatePlayerTurn(player, game)) return;

    const data = await turnEndpoint(game!.gameID, {
      playerID: player!.playerID,
    });

    handleNotificationResponse(
      data,
      'Turno pasado con éxito',
      'Error al intentar pasar el turno',
      () => {
        unselectCard();
        unselectTile();
      }
    );
  };

  const leaveGame = async () => {
    if (!validatePlayerInGame(player, game)) return;

    const data = await leaveGameEndpoint(game!.gameID, {
      playerID: player!.playerID,
    });

    handleNotificationResponse(
      data,
      'Abandonado la partida con éxito',
      'Error al intentar abandonar la partida',
      () => {
        navigate('/');
      }
    );
  };

  return {
    otherPlayersInPos,
    currentPlayer,
    posEnabledToPlay,
    cardsMovement,
    selectedCard,
    startGame,
    endTurn,
    leaveGame,
    handleClickCard,
  };
};
