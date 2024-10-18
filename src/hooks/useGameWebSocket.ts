import { useEffect } from 'react';
import { GameMessage } from '../types/gameTypes';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { useNavigate } from 'react-router-dom';
import { sendToast } from '../services/utils';

export function useGameWebSocket(gameID: number) {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const setGame = useGameStore((state) => state.setGame);
  const webSocketUrl = `ws://localhost:8000/games/${playerID.toString()}/${gameID.toString()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      console.log(`Socket con partida ${gameID.toString()} establecido`);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as GameMessage;
      console.log(
        `Mensaje de tipo '${message.type}' recibido:`,
        message.payload
      );
      if (message.type === 'status') {
        setGame(message.payload);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (message.type === 'end') {
        console.log('Partida finalizada');
        navigate('/');
        sendToast(
          'Partida finalizada',
          `El ganador es ${message.payload.username}`,
          'info'
        );
      }
    };

    socket.onclose = (e) => {
      console.log(`Socket con partida ${gameID.toString()} cerrado`);
      if (e.code === 4004) {
        console.log('Jugador o partida no encontradas');
        sendToast(
          'No se pudo conectar a la partida',
          'Partida no encontrada',
          'error'
        );
        navigate('/');
      } else if (e.code === 4005) {
        console.log('Conexión iniciada en otro dispositivo');
        sendToast(
          'Conexión iniciada en otro dispositivo',
          'Solo puedes tener una conexión a la vez',
          'warning'
        );
        navigate('/');
      } else if (e.code === 4003) {
        console.log('Desconexión forzada por el servidor, razón:', e.reason);
        sendToast('No se pudo conectar a la partida', e.reason, 'error');
        navigate('/');
      }
    };

    return () => {
      switch (socket.readyState) {
        case WebSocket.CONNECTING:
          socket.onclose = () => {
            console.log(
              `Socket con sala ${gameID.toString()} interrumpido por desmontaje`
            );
          };
          socket.onopen = () => {
            socket.close();
          };
          break;
        case WebSocket.OPEN:
          socket.close();
          break;
        case WebSocket.CLOSING:
          break;
        case WebSocket.CLOSED:
          break;
      }
    };
  }, []);
}
