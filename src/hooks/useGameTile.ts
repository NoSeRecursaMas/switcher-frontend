import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

import { handleNotificationResponse, sendToast } from '../services/utils';
import { getExtendedBoard, isHighlighted } from '../services/tilesUtils';
import { moveCard as moveCardEndpoint } from '../api/gameEndpoints';
import { validatePlayerTurn } from '../services/validation/validators';
import { isMovementCard } from '../types/gameTypes';

export const useGameTile = () => {
  const player = usePlayerStore((state) => state.player);
  const game = useGameStore((state) => state.game);
  const selectedTile = useGameStore((state) => state.selectedTile);
  const selectTile = useGameStore((state) => state.selectTile);
  const unselectTile = useGameStore((state) => state.unselectTile);
  const selectedCard = useGameStore((state) => state.selectedCard);

  const handleClickTile = async (posX: number, posY: number) => {
    if (!validatePlayerTurn(player, game)) return;
    if (!selectedCard) {
      sendToast('No se ha seleccionado una carta', null, 'error');
      return;
    }

    if (!selectedTile) {
      selectTile(posX, posY);
      return;
    }
    if (selectedTile.posX === posX && selectedTile.posY === posY) {
      unselectTile();
      return;
    }
    if (
      isHighlighted({ posX, posY }, selectedTile, selectedCard) &&
      isMovementCard(selectedCard)
    ) {
      const data = await moveCardEndpoint(game!.gameID, {
        cardID: selectedCard.cardID,
        playerID: player!.playerID,
        origin: selectedTile,
        destination: { posX, posY },
      });
      handleNotificationResponse(
        data,
        'Movimiento realizado con éxito',
        'Error al intentar realizar el movimiento',
        () => null
      );
      return;
    }
    selectTile(posX, posY);
  };

  const board = getExtendedBoard(game, selectedTile, selectedCard);

  return {
    board,
    selectedTile,
    handleClickTile,
  };
};
