import axios from "axios";
import { Response, ErrorType, isError } from "./types";
import { isAxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: `http://localhost:8000`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const handleRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  data: unknown,
  path: string,
  statusExpected: number
): Promise<T | ErrorType> => {
  try {
    let response: Response<T>;
    if (method === "GET") {
      response = await axiosClient.get(path);
    } else if (method === "POST") {
      response = await axiosClient.post(path, data);
    } else if (method === "PUT") {
      response = await axiosClient.put(path, data);
    } else {
      response = await axiosClient.delete(path);
    }
    return handleResponseSuccess<T>(response, statusExpected);
  } catch (error: unknown) {
    return handleResponseError(error);
  }
};

function handleResponseSuccess<T>(
  response: Response<T>,
  statusExpected: number
): T {
  if (response.status === statusExpected) {
    return response.data;
  } else {
    throw new Error(`Unexpected status code: ${response.status.toString()}`);
  }
}

function handleResponseError(error: unknown): ErrorType {
  if (isAxiosError(error) && isError(error.response?.data)) {
    return error.response.data;
  } else {
    return {
      detail: [{ type: "unknown", msg: JSON.stringify(error) }],
    };
  }
}

export default handleRequest;
export { axiosClient };
