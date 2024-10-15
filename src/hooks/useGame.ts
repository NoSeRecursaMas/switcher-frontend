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
import { getPlayersPositions } from '../services/gameUtils';

export const useGame = () => {
  const player = usePlayerStore((state) => state.player);
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const selectedCard = useGameStore((state) => state.selectedCard);
  const selectCard = useGameStore((state) => state.selectCard);
  const unselectCard = useGameStore((state) => state.unselectCard);
  const unselectTile = useGameStore((state) => state.unselectTile);
  const navigate = useNavigate();

  const handleClickCard = (cardID: number, type: 'movement' | 'figure') => {
    if (!game) {
      sendToast('La información de la partida no es válida', null, 'error');
      return;
    }
    if (!player) {
      sendToast(
        'No se ha podido cargar la información del jugador',
        null,
        'error'
      );
      return;
    }
    const playerInfoGame = game.players.find(
      (playerInGame) => playerInGame.playerID === player.playerID
    );
    if (!playerInfoGame) {
      sendToast(
        'No se ha podido cargar la información del jugador',
        null,
        'error'
      );
      return;
    }

    if (game.posEnabledToPlay !== playerInfoGame.position) {
      sendToast('No es tu turno', null, 'error');
      return;
    }

    if (
      selectedCard &&
      selectedCard.cardID === cardID &&
      selectedCard.type === type
    ) {
      unselectCard();
      unselectTile();
    } else {
      selectCard(cardID, type);
      unselectTile();
    }
  };

  const currentPlayer = game?.players.find(
    (playerInGame) => playerInGame.playerID === player?.playerID
  );
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
    if (!room) {
      sendToast('La información de la sala no es válida', null, 'error');
      return;
    }
    if (!player) {
      sendToast(
        'No se ha podido cargar la información del jugador',
        null,
        'error'
      );
      return;
    }
    if (room.hostID !== player.playerID) {
      sendToast(
        'Solo el creador de la sala puede iniciar la partida',
        null,
        'error'
      );
      return;
    }
    const data = await startGameEndpoint(room.roomID, {
      playerID: player.playerID,
    });
    handleNotificationResponse(
      data,
      'Partida iniciada con éxito',
      'Error al intentar iniciar la partida',
      () => null
    );
  };

  const endTurn = async () => {
    if (!game) {
      sendToast('La información de la partida no es válida', null, 'error');
      return;
    }
    if (!player) {
      sendToast(
        'No se ha podido cargar la información del jugador',
        null,
        'error'
      );
      return;
    }
    const playerInfoGame = game.players.find(
      (playerInGame) => playerInGame.playerID === player.playerID
    );
    if (!playerInfoGame) {
      sendToast(
        'No se ha podido cargar la información del jugador',
        null,
        'error'
      );
      return;
    }
    if (game.posEnabledToPlay !== playerInfoGame.position) {
      sendToast('No es tu turno', null, 'error');
      return;
    }

    const data = await turnEndpoint(game.gameID, {
      playerID: player.playerID,
    });
    handleNotificationResponse(
      data,
      'Turno pasado con éxito',
      'Error al intentar pasar el turno',
      () => null
    );
  };

  const leaveGame = async () => {
    if (!game) {
      sendToast('La información de la partida no es válida', null, 'error');
      return;
    }
    if (!player) {
      sendToast(
        'No se ha podido cargar la información del jugador',
        null,
        'error'
      );
      return;
    }
    const playerInfoGame = game.players.find(
      (playerInGame) => playerInGame.playerID === player.playerID
    );
    if (!playerInfoGame) {
      sendToast(
        'No se ha podido cargar la información del jugador',
        null,
        'error'
      );
      return;
    }

    const data = await leaveGameEndpoint(game.gameID, {
      playerID: player.playerID,
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
    startGame,
    endTurn,
    leaveGame,
    currentPlayer,
    posEnabledToPlay,
    handleClickCard,
    cardsMovement,
    selectedCard,
  };
};
