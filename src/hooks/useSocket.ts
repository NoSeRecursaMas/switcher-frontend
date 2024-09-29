import useWebSocket from "react-use-websocket";
import { sendToast } from "../services/utils";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SocketMessage from "../types/socketTypes";
import { useRoomStore } from "../store/roomStore";

export default function useSocket(
  roomID: number | undefined,
  playerID: number | undefined
) {
  const { setRoom, room } = useRoomStore();
  const navigate = useNavigate();
  let socketUrl = undefined;

  if (!roomID || isNaN(roomID)) {
    sendToast(
      "Error al cargar la sala",
      "La información de la sala no es válida",
      "error"
    );
    navigate("/");
  } else if (!playerID || isNaN(playerID)) {
    sendToast(
      "Error al cargar la sala",
      "No se ha podido cargar la información del usuario",
      "error"
    );
    navigate("/");
  } else {
    socketUrl = `ws://localhost:8000/ws/${roomID.toString()}/${playerID.toString()}`;
  }
  const { lastMessage } = useWebSocket(socketUrl ?? "", {
    shouldReconnect: () => true,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data as string) as SocketMessage;
      if (message.type === "UPDATE_ROOM") {
        sendToast(message.payload.msg, null, "info");
        setRoom(message.payload.status);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  return { room };
}
