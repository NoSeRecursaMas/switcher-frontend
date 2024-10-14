import { sendToast } from "../services/utils";
import { useRoomListStore } from "../stores/roomListStore";

export const useRoomList = () => {
  const selectedRoomID = useRoomListStore((state) => state.selectedRoomID);
  const selectRoomID = useRoomListStore((state) => state.selectRoomID);
  const deselectRoomID = useRoomListStore((state) => state.deselectRoomID);
  const roomList = useRoomListStore((state) => state.roomList);

  const handleSelectRoomID = (newRoomID: number) => {
    const roomData = roomList?.find((room) => room.roomID === newRoomID);
    if (!roomData) return; // No debería pasar
    if (roomData.started) return; // No debería pasar

    if (roomData.actualPlayers >= roomData.maxPlayers) {
      sendToast(
        "La sala está llena",
        "No puedes unirte a una que ya alcanzó su límite de jugadores",
        "warning"
      );
      return;
    }

    if (selectedRoomID === newRoomID) {
      deselectRoomID();
    } else {
      selectRoomID(newRoomID);
    }
  };
  
  return {
    roomList,
    selectedRoomID,
    handleSelectRoomID,
  };
};
