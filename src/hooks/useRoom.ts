import { isError } from "../api/types";
import { usePlayerStore } from "../stores/playerStore";
import { useRoomStore } from "../stores/roomStore";
import {
  joinRoom as joinRoomEndpoint,
  leaveRoom as leaveRoomEndpoint,
  createRoom as createRoomEndpoint,
} from "../api/roomEndpoints";
import { sendErrorToast, sendToast } from "../services/utils";
import { useNavigate } from "react-router-dom";
import { Room } from "../types/roomTypes";
import { WebSocketLike } from "react-use-websocket/dist/lib/types";

export const useRoom = (roomID?: number) => {
  const player = usePlayerStore((state) => state.player);
  const room = useRoomStore((state) => state.room);
  const navigate = useNavigate();

  const joinRoom = async () => {
    if (!roomID) {
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
    const data = await joinRoomEndpoint(roomID, {
      playerID: player.playerID,
    });

    if (isError(data)) {
      sendErrorToast(data, "Error al intentar unirse a la sala");
    } else {
      sendToast("Te has unido a la sala", null, "success");
      navigate(`/room/${roomID.toString()}`);
    }
  };

  const leaveRoom = async (websocket: WebSocketLike | null) => {
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
    const data = await leaveRoomEndpoint(room.roomID, {
      playerID: player.playerID,
    });

    if (isError(data)) {
      sendErrorToast(data, "Error al intentar salir de la sala");
    } else {
      sendToast("Has salido de la sala", null, "success");
      if (websocket) websocket.close();
      navigate("/");
    }
  };

  const createRoom = async (
    roomName: string,
    maxPlayers: number,
    minPlayers: number
  ) => {
    if (!player) {
      sendToast(
        "No se ha podido cargar la información del jugador",
        null,
        "error"
      );
      return;
    }
    const data = await createRoomEndpoint({
      playerID: player.playerID,
      roomName,
      minPlayers,
      maxPlayers,
    });
    if (isError(data)) {
      sendErrorToast(data, "Error al crear la sala");
    } else {
      sendToast("Sala creada con éxito", null, "success");
      navigate(`/room/${data.roomID.toString()}`);
    }
  };

  const updateRoom = (room: Room) => {
    useRoomStore.setState({ room: room });
  };

  return {
    room,
    joinRoom,
    leaveRoom,
    createRoom,
    updateRoom,
  };
};
