import { usePlayerStore } from "../stores/playerStore";
import { useRoomStore } from "../stores/roomStore";
import { useGameStore } from "../stores/gameStore";
import {
  startGame as startGameEndpoint,
  turn as turnEndpoint,
} from "../api/gameEndpoints";

import { handleNotificationResponse, sendToast } from "../services/utils";

export const useGame = () => {
  const player = usePlayerStore((state) => state.player);
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);

  const currentPlayer = game?.players.find(
    (playerInGame) => playerInGame.playerID === player?.playerID
  );
  const otherPlayers = game?.players.filter(
    (playerInGame) => playerInGame.playerID !== player?.playerID
  );

  const startGame = async () => {
    if (!room) {
      sendToast("La información de la sala no es válida", null, "error");
      return;
    }
    if (!player) {
      sendToast(
        "No se ha podido cargar la información del jugador",
        null,
        "error"
      );
      return;
    }
    if (room.hostID !== player.playerID) {
      sendToast(
        "Solo el creador de la sala puede iniciar la partida",
        null,
        "error"
      );
      return;
    }
    const data = await startGameEndpoint(room.roomID, {
      playerID: player.playerID,
    });
    handleNotificationResponse(
      data,
      "Partida iniciada con éxito",
      "Error al intentar iniciar la partida",
      () => null
    );
  };

  const turn = async () => {
    if (!game) {
      sendToast("La información de la partida no es válida", null, "error");
      return;
    }
    if (!player) {
      sendToast(
        "No se ha podido cargar la información del jugador",
        null,
        "error"
      );
      return;
    }
    const playerInfoGame = game.players.find(
      (playerInGame) => playerInGame.playerID === player.playerID
    );
    if (!playerInfoGame) {
      sendToast(
        "No se ha podido cargar la información del jugador",
        null,
        "error"
      );
      return;
    }
    if (game.posEnabledToPlay !== playerInfoGame.position) {
      sendToast("No es tu turno", null, "error");
      return;
    }

    const data = await turnEndpoint(game.gameID, {
      playerID: player.playerID,
    });
    handleNotificationResponse(
      data,
      "Turno realizado con éxito",
      "Error al intentar realizar el turno",
      () => null
    );
  };

  return {
    game,
    startGame,
    turn,
    currentPlayer,
    otherPlayers,
  };
};
