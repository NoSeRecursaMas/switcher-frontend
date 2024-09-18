import { isAxiosError } from "axios";
import axiosClient from "../httpClient";
import { sendToast } from "../../services/utils";
import { redirect } from "react-router-dom";
import { roomResponseSuccess } from "./roomTypes";
import { responseError } from "../types";

export const setRoomEndpoint = async (playerID: number, roomName: string, minPlayers: number, maxPlayers: number) => {
  try {
    const response: roomResponseSuccess = await axiosClient.post("/lobbys", { playerID, roomName, minPlayers, maxPlayers });
    if (response.status === 201) {
      redirect(`/room/${response.data.roomID.toString()}`);
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