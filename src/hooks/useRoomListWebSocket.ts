import { useEffect, useRef } from "react";
import { RoomListStatusMessage } from "../types/roomTypes";
import { usePlayerStore } from "../stores/playerStore";
import { useRoomListStore } from "../stores/roomListStore";

export const useRoomListWebSocket = () => {
  const playerID = usePlayerStore((state) => state.player?.playerID ?? 0);
  const deletePlayer = usePlayerStore((state) => state.deletePlayer);
  const selectedRoomID = useRoomListStore((state) => state.selectedRoomID);
  const refSelectedRoomID = useRef(selectedRoomID);
  refSelectedRoomID.current = selectedRoomID;
  const deselectRoomID = useRoomListStore((state) => state.deselectRoomID);
  const setRoomList = useRoomListStore((state) => state.setRoomList);
  const webSocketUrl = `ws://localhost:8000/rooms/${playerID.toString()}`;

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      console.log("Socket con lista de salas establecido");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as RoomListStatusMessage;
      console.log(`Mensaje de tipo '${message.type}' recibido:`, message.payload);
      if (message.type === "status") {
        setRoomList(message.payload);
        // Si la sala seleccionada ya no está disponible, deseleccionarla
        const selectedRoom = message.payload.find(
          (room) => room.roomID === refSelectedRoomID.current
        );
        if (
          !selectedRoom ||
          selectedRoom.started ||
          selectedRoom.actualPlayers >= selectedRoom.maxPlayers
        ) {
          deselectRoomID();
        }
      }
    };

    socket.onclose = (e) => {
      console.log("Socket con lista de salas cerrado");
      if (e.code === 4004) {
        console.log("Jugador con este ID no encontrado, borrando jugador");
        deletePlayer();
      }
    };

    return () => {
      switch (socket.readyState) {
        case WebSocket.CONNECTING:
          socket.onclose = () => {
            console.log(
              "Socket con lista de salas interrumpido por desmontaje"
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
