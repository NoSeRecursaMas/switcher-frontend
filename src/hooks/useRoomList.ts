import { useEffect, useState } from "react";
import { getRooms } from "../api/room/roomEndpoints";
import { isErrorDetail } from "../api/types";
import { sendToast } from "../services/utils";
import { roomDetails } from "../types/roomTypes";

export default function useRoomList() {
    const [rooms, setRooms] = useState<roomDetails[] | undefined>(undefined);
    const [selectedRoom, setSelectedRoom] = useState<number | undefined>(undefined);
    const refreshRoomList = async () => {
        setSelectedRoom(undefined);
        setRooms(undefined);
        const data = await getRooms();
        if (isErrorDetail(data)) {
            sendToast("Error al obtener la lista de salas", data.detail, "error");
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
    return { rooms, selectedRoom, setSelectedRoom, refreshRoomList };
}