import { isAxiosError } from "axios";
import axiosClient from "../http-client";
import { responseError } from "../types";
import { loadUserResponseSuccess } from "./user-types";
import userMock from "./user-mock";

userMock();

export const createUser = async (username: string) => {
  try {
    const response: loadUserResponseSuccess = await axiosClient.post(
      "players",
      {
        username: username,
      }
    );
    if (response.status === 201) {
      return {
        id: response.data.playerID,
        username: response.data.username
      };
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
