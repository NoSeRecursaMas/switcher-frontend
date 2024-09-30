import { isAxiosError } from "axios";
import axiosClient from "../http-client";
import { ErrorDetail } from "../types";
import { CreatePlayerRequest, Player } from "../../types/playerTypes";
import { Response } from "../types";
import playerMock from "./playerEndpoints.mock";

playerMock();

export const createPlayer = async (data: CreatePlayerRequest): Promise<Player | ErrorDetail> => {
  try {
    const mockPrefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
    const response: Response<Player> = await axiosClient.post(
      `${mockPrefix}players`,
      data
    );
    if (response.status === 201) {
      return response.data;
    } else {
      console.log("1111");
      return { detail: JSON.stringify(response) };
    }
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      console.log("2222");
      return error.response.data as ErrorDetail;
    } else {
      console.log("3333");
      return { detail: JSON.stringify(error) };
    }
  }
};
