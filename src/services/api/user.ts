import { isAxiosError } from "axios";
import axiosClient from "./httpClient";
import { sendToast } from "../utils";
import { setUser } from "../state/userSlice";
import { store } from "../state/store";

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
      store.dispatch(
        setUser({
          id: response.data.playerID,
          username: response.data.username,
        })
      );
      sendToast("Nombre seleccionado correctamente", null, "success");
    } else {
      sendToast(
        "Error al seleccionar nombre",
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
