import { isAxiosError } from "axios";
import axiosClient from "../http-client";
import { ErrorDetail } from "../types";
import { RoomDetails, CreateRoomRequest, RoomID } from "../../types/roomTypes";
import { Response } from "../types";
import roomMock from "./roomEndpoints.mock";

roomMock();

export const setRoomEndpoint = async (
  data: CreateRoomRequest
): Promise<RoomID | ErrorDetail> => {
  try {
    const mockPrefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
    const response: Response<RoomID> = await axiosClient.post(
      `${mockPrefix}rooms`,
      data
    );
    if (response.status === 201) {
      return response.data;
    } else {
      return { detail: JSON.stringify(response) };
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return error.response?.data as ErrorDetail;
    } else {
      return { detail: JSON.stringify(error) };
    }
  }
};

export const getRooms = async (): Promise<RoomDetails[] | ErrorDetail> => {
  try {
    const mockPrefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
    const response: Response<RoomDetails[]> = await axiosClient.get(
      `${mockPrefix}rooms`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { detail: JSON.stringify(response) };
    }
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      return error.response.data as ErrorDetail;
    } else {
      return { detail: JSON.stringify(error) };
    }
  }
};
