import { isAxiosError } from "axios";
import axiosClient from "../http-client";
import { sendToast } from "../../services/utils";
import { roomListResponse } from "./room-types";
import { responseError } from "../types";
import roomListMock from "./room-list-mock";

roomListMock();

export const requestRooms = async () => {
    try {
        const response: roomListResponse = await axiosClient.get("/rooms");
        if (response.status === 200) {
            if (response.data.length === 0) {
                sendToast("No hay salas disponibles", null, "info");
                return [];
            }
            else {
                return response.data;
            }
        }
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const response = error.response as responseError;
            sendToast("Error al obtener salas", response.data.detail, "error");
        } else {
            sendToast("Error al obtener salas", JSON.stringify(error), "error");
        }
        return [];
    }
}