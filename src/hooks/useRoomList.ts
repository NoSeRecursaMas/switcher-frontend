import { useEffect, useState } from "react";
import { getRooms } from "../api/room/roomEndpoints";
import { isErrorDetail } from "../api/types";
import { sendErrorToast, sendToast } from "../services/utils";
import { RoomDetails } from "../types/roomTypes";

export default function useRoomList() {
    const [rooms, setRooms] = useState<RoomDetails[] | undefined>(undefined);
    const [selectedRoomID, setSelectedRoomID] = useState<number | undefined>(undefined);
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
    useEffect(() => {
        const fetchData = async () => {
            await refreshRoomList();
        };
        fetchData().catch((err: unknown) => {
            sendToast("Error al obtener la lista de salas", JSON.stringify(err), "error");
        });
    }, []);
    return { rooms, selectedRoomID, setSelectedRoomID, refreshRoomList };
}