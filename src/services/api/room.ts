import { isAxiosError } from "axios";
import axiosClient from "./httpClient";
import { sendToast } from "../utils";
import { setUser } from "../state/userSlice";
import { store } from "../state/store";
import { redirect } from "react-router-dom";

interface responseError {
  status: number;
  data: {
    detail: string;
  };
}

interface responseSuccess {
  status: number;
  data: {
    playerID: number;
    username: string;
  };
}

export const setUserEndpoint = async (name: string) => {
  try {
    const response: responseSuccess = await axiosClient.post("players", {
      username: name,
    });
    if (response.status === 201) {
        // redirect("/" {response.data.roomID});
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
      sendToast("Error al seleccionar nombre", response.data.detail, "error");
    } else {
      sendToast("Error al seleccionar nombre", JSON.stringify(error), "error");
    }
  }
};