import { isAxiosError } from "axios";
import axiosClient from "../http-client";
import {
  GetRoomsListResponseSuccess,
  createRoomResponseSuccess,
  createRoomRequest,
} from "./room-types";
import { responseError } from "../types";
import roomMock from "./room-mock";

roomMock();

export const setRoomEndpoint = async (data: createRoomRequest) => {
  try {
    const mock_prefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
    const response: createRoomResponseSuccess = await axiosClient.post(
      `${mock_prefix}rooms`,
      data
    );
    if (response.status === 201) {
      return response.data;
    } else {
      return { detail: JSON.stringify(response), error: true };
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const response = error.response as responseError;
      return { detail: response.data.detail, error: true };
    } else {
      return { detail: JSON.stringify(error), error: true };
    }
  }
};

export const requestRooms = async () => {
  try {
    const mock_prefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
    const response: GetRoomsListResponseSuccess = await axiosClient.get(
      `${mock_prefix}rooms`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { detail: JSON.stringify(response), error: true };
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const response = error.response as responseError;
      return { detail: response.data.detail, error: true };
    } else {
      return { detail: JSON.stringify(error), error: true };
    }
  }
};
