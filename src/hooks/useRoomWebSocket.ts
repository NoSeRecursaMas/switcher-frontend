import { useEffect } from "react";
import { RoomStatusMessage } from "../types/roomTypes";
import { usePlayerStore } from "../stores/playerStore";
import { useRoomStore } from "../stores/roomStore";
import { useNavigate } from "react-router-dom";
import { sendToast } from "../services/utils";

export function useRoomWebSocket(roomID: number) {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const setRoom = useRoomStore((state) => state.setRoom);
  const webSocketUrl = `ws://localhost:8000/rooms/${playerID.toString()}/${roomID.toString()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      console.log(`Socket con sala ${roomID.toString()} establecido`);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as RoomStatusMessage;
      console.log(
        `Mensaje de tipo '${message.type}' recibido:`,
        message.payload
      );
      if (message.type === "status") {
        setRoom(message.payload);
      }
    };

    socket.onclose = (e) => {
      console.log(`Socket con sala ${roomID.toString()} cerrado`);
      if (e.code === 4004) {
        console.log("Jugador o sala no encontradas");
        navigate("/");
      } else if (e.code === 4005) {
        console.log("Conexión iniciada en otro dispositivo");
        sendToast("Conexión iniciada en otro dispositivo", "Solo puedes tener una conexión a la vez", "warning");
        navigate("/");
      }
    };

    return () => {
      switch (socket.readyState) {
        case WebSocket.CONNECTING:
          socket.onclose = () => {
            console.log(
              `Socket con sala ${roomID.toString()} interrumpido por desmontaje`
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
};
