import { isAxiosError } from "axios";
import axiosClient from "../http-client";
import { sendToast } from "../../services/utils";
import { NavigateFunction } from "react-router-dom";
import { roomResponse, roomListResponse } from "./room-types";
import { responseError } from "../types";
import roomMock from "./room-mock";

roomMock();

export const setRoomEndpoint = async (playerID: number, roomName: string, minPlayers: number, maxPlayers: number, navigate: NavigateFunction) => {
  try {
    const mock_prefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
    const response: roomResponse = await axiosClient.post(
      `${mock_prefix}rooms`,
       { playerID, roomName, minPlayers, maxPlayers });
    if (response.status === 201) {
      navigate(`/room/${response.data.roomID.toString()}`);
      sendToast("Sala creada exitosamente", null, "success");
    } else {
      sendToast(
        "Error al crear sala",
        JSON.stringify(response),
        "error"
      );
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const response = error.response as responseError;
      sendToast("Error al crear sala", response.data.detail, "error");
    } else {
      sendToast("Error al crear sala", JSON.stringify(error), "error");
    }
  }
};

export const requestRooms = async () => {
  try {
      const mock_prefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
      const response: roomListResponse = await axiosClient.get(`${mock_prefix}rooms`);
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