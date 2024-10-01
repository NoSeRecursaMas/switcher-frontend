import { useEffect, useState } from "react";
import { getRooms } from "../api/roomEndpoints";
import { isError } from "../api/types";
import { sendErrorToast, sendToast } from "../services/utils";
import { RoomDetails } from "../types/roomTypes";

export const useRoomList = () => {
  const [rooms, setRooms] = useState<RoomDetails[] | undefined>(undefined);
  const [selectedRoomID, selectRoomID] = useState<number | undefined>(
    undefined
  );
  const deleteSelectedRoom = () => {
    selectRoomID(undefined);
  };

  const refreshRoomList = async () => {
    selectRoomID(undefined);
    setRooms(undefined);
    const data = await getRooms();
    if (isError(data)) {
      sendErrorToast(data, "Error al obtener la lista de salas");
    } else {
      setRooms(data);
    }
  };

  useEffect(() => {
    refreshRoomList().catch((error: unknown) => {
      console.error("Failed to refresh room list:", error);
    });
  }, []);

  const handleSelectRoomID = (
    roomID: number,
    actualPlayers: number,
    maxPlayers: number
  ) => {
    if (actualPlayers < maxPlayers) {
      if (selectedRoomID === roomID) {
        deleteSelectedRoom();
      } else {
        selectRoomID(roomID);
      }
    } else {
      sendToast(
        "La sala está llena",
        "No puedes unirte a una que ya alcanzó su límite de jugadores",
        "warning"
      );
    }
  };

  return {
    rooms,
    selectedRoomID,
    handleSelectRoomID,
    refreshRoomList,
  };
};
