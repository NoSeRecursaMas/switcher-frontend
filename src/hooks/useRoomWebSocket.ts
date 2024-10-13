import { useEffect } from "react";
import { RoomStatusMessage } from "../types/roomTypes";
import { usePlayerStore } from "../stores/playerStore";
import { useRoomStore } from "../stores/roomStore";
import { redirect } from "react-router-dom";

export function useRoomWebSocket(roomID: number) {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const setRoom = useRoomStore((state) => state.setRoom);
  const webSocketUrl = `ws://localhost:8000/rooms/${playerID.toString()}/${roomID.toString()}`;

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
        redirect("/");
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
