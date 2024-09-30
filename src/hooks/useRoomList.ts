import { useEffect, useState } from "react";
import { getRooms, joinRoom } from "../api/room/roomEndpoints";
import { isErrorDetail } from "../api/types";
import { sendErrorToast, sendToast } from "../services/utils";
import { RoomDetails } from "../types/roomTypes";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/playerStore";

export default function useRoomList() {
  const [rooms, setRooms] = useState<RoomDetails[] | undefined>(undefined);
  const [selectedRoomID, setSelectedRoomID] = useState<number | undefined>(
    undefined
  );
  const navigate  = useNavigate();
const player = usePlayerStore((state) => state.player);

  const refreshRoomList = async () => {
    setSelectedRoomID(undefined);
    setRooms(undefined);
    const data = await getRooms();
    if (isErrorDetail(data)) {
      sendErrorToast(data, "Error al obtener la lista de salas");
    } else {
      setRooms(data);
    }
  };

  const handleJoinRoom = async () => {
    if (!selectedRoomID || !player) return;
    const data = await joinRoom(selectedRoomID, { playerID: player.playerID });
    if (isErrorDetail(data)) {
      sendErrorToast(data, "Error al crear partida");
    } else {
      sendToast("Partida creada con éxito", null, "success");
      navigate(`/room/${selectedRoomID.toString()}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await refreshRoomList();
    };
    fetchData().catch((err: unknown) => {
      sendToast(
        "Error al obtener la lista de salas",
        JSON.stringify(err),
        "error"
      );
    });
  }, []);
  return { rooms, selectedRoomID, setSelectedRoomID, refreshRoomList, handleJoinRoom };
}
