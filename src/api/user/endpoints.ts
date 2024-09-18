import { isAxiosError } from "axios";
import axiosClient from "../httpClient";
import { sendToast } from "../../services/utils";
import { loadUser } from "../../services/state/userSlice";
import { store } from "../../services/state/store";
import { responseError } from "../types";
import { loadUserResponseSuccess } from "./types";
import userMock from "./mock";

userMock();

export const loadUserEndpoint = async (name: string) => {
  try {
    const response: loadUserResponseSuccess = await axiosClient.post("players", {
      username: name,
    });
    if (response.status === 201) {
      store.dispatch(
        loadUser({
          id: response.data.playerID,
          username: response.data.username,
        })
      );
      sendToast("Nombre seleccionado exitosamente", null, "success");
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
