import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

import { handleNotificationResponse, sendToast } from '../services/utils';
import { getExtendedBoard, isHighlighted } from '../services/tilesUtils';
import { moveCard as moveCardEndpoint } from '../api/gameEndpoints';

export const useGameTile = () => {
  const player = usePlayerStore((state) => state.player);
  const game = useGameStore((state) => state.game);
  const selectedTile = useGameStore((state) => state.selectedTile);
  const selectTile = useGameStore((state) => state.selectTile);
  const unselectTile = useGameStore((state) => state.unselectTile);
  const selectedCard = useGameStore((state) => state.selectedCard);

  const handleClickTile = async (posX: number, posY: number) => {
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
    if (!selectedCard || selectedCard.type !== 'movement') {
      sendToast('No se ha seleccionado una carta de movimiento', null, 'error');
      return;
    }

    if (!selectedTile) {
      selectTile(posX, posY);
      return;
    } else if (selectedTile.posX === posX && selectedTile.posY === posY) {
      unselectTile();
      return;
    } else if (
      isHighlighted({ posX, posY }, selectedTile, selectedCard.cardData)
    ) {
      // La primera ficha está seleccionada
      // Y ahora se selecciona la segunda que estaba highlighteada
      // Se llama al endpoint para mover las fichas
      const data = await moveCardEndpoint(game.gameID, {
        cardID: selectedCard.cardData.cardID,
        playerID: player.playerID,
        origin: selectedTile,
        destination: { posX, posY },
      });
      handleNotificationResponse(
        data,
        'Movimiento realizado con éxito',
        'Error al intercamabiar fichas',
        () => null
      );
    } else {
      // La primera ficha está seleccionada
      // Y ahora se selecciona otra pero no está highlighteada
      // Entonces se selecciona la nueva ficha
      selectTile(posX, posY);
    }
  };

  const board = getExtendedBoard(game, selectedTile, selectedCard?.cardData);

  return {
    board,
    handleClickTile,
    selectedTile,
  };
};
