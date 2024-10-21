import { useEffect } from 'react';
import { GameMessage } from '../types/gameTypes';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { useNavigate } from 'react-router-dom';
import { sendToast } from '../services/utils';

export function useGameWebSocket(gameID: number) {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const setGame = useGameStore((state) => state.setGame);
  const deleteGame = useGameStore((state) => state.deleteGame);
  const unselectCard = useGameStore((state) => state.unselectCard);
  const unselectTile = useGameStore((state) => state.unselectTile);
  const webSocketUrl = `ws://localhost:8000/games/${playerID.toString()}/${gameID.toString()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as GameMessage;
      if (message.type === 'status') {
        setGame(message.payload);
        unselectCard();
        unselectTile();
      }

      if (message.type === 'end') {
        navigate('/');
        sendToast(
          'Partida finalizada',
          `El ganador es ${message.payload.username}`,
          'info'
        );
        deleteGame();
      }
    };

    socket.onclose = (e) => {
      if (e.code === 4004) {
        sendToast(
          'No se pudo conectar a la partida',
          'Partida no encontrada',
          'error'
        );
        navigate('/');
      } else if (e.code === 4005) {
        sendToast(
          'Conexión iniciada en otro dispositivo',
          'Solo puedes tener una conexión por partida a la vez',
          'warning'
        );
        navigate('/');
      } else if (e.code === 4003) {
        sendToast('No se pudo conectar a la partida', e.reason, 'error');
        navigate('/');
      }
    };

    return () => {
      switch (socket.readyState) {
        case WebSocket.CONNECTING:
          socket.close();
          break;
        case WebSocket.OPEN:
          socket.close();
          break;
        default:
          break;
      }
    };
  }, []);
}
