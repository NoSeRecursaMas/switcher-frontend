import { sendErrorToast, sendToast } from "../services/utils";
import { isError } from "..//api/types";
import { usePlayerStore } from "../stores/playerStore";
import { createPlayer as createPlayerEndpoint } from "../api/playerEndpoints";

export const usePlayer = () => {
    const { player, setPlayer } = usePlayerStore();

    const createPlayer = async (username : string) => {
        const data = await createPlayerEndpoint({ username });
        if (isError(data)) {
          sendErrorToast(data, "Error al seleccionar nombre");
        } else {
          setPlayer(data);
          sendToast("¡Nombre seleccionado con éxito!", null, "success");
        }
    };

    return { player, createPlayer };
}