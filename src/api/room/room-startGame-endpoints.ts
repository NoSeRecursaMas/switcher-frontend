import { isAxiosError } from "axios";
import axiosClient from "../http-client";
import { sendToast } from "../../services/utils";
import { NavigateFunction } from "react-router-dom";
import { gameResponse } from "./room-types";
import { responseError } from "../types";
import gameMock from "./room-startGame-mock";

gameMock();
// El parámetro playerID no se utiliza, quizás en el futuro se necesite
export const startGameEndpoint = async (playerID: number, roomID: number, navigate: NavigateFunction) => {
  try {
    const response: gameResponse = await axiosClient.post("/games", { roomID });
    if (response.status === 201) {
      navigate(`/game/${response.data.gameID.toString()}`);
    } else {
      sendToast(
        "Error al iniciar partida",
        JSON.stringify(response),
        "error"
      );
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
        console.log("Error al iniciar partida", error.response);
      const response = error.response as responseError;
      sendToast("Error al iniciar partida", response.data.detail, "error");
    } else {
      sendToast("Error al iniciar partida", JSON.stringify(error), "error");
    }
  }
};