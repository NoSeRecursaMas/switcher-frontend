import axios from "axios";
import { Response } from "./types";
import { ErrorResponse } from "./types";
import { isAxiosError } from "axios";


const axiosClient = axios.create({
  baseURL: `http://localhost:8000`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


const handleRequest = async <T>(method: "GET" | "POST" | "PUT" | "DELETE", data: unknown, path: string, statusExpected: number): Promise<T | ErrorResponse> => {
  try {
    let response: Response<T>;
    const mockPrefix = import.meta.env.VITE_MOCK === "true" ? "mock/" : "";
    if (method === "GET") {
      response = await axiosClient.get(`${mockPrefix}${path}`);
    }
    else if (method === "POST") {
      response = await axiosClient.post(`${mockPrefix}${path}`, data);
    }
    else if (method === "PUT") {
      response = await axiosClient.put(`${mockPrefix}${path}`, data);
    }
    else {
      response = await axiosClient.delete(`${mockPrefix}${path}`);
    }
    
    return handleResponseSuccess<T>(response, statusExpected);
  }
  catch (error: unknown) {
    return handleResponseError(error);
  }
}

function handleResponseSuccess<T>(response: Response<T>, statusExpected: number): T | ErrorResponse {
  if (response.status === statusExpected) {
    return response.data;
  } else {
    return {
      status: response.status,
      detail: [{ type: "unknown", msg: JSON.stringify(response) }],
    };
  }
}

function handleResponseError(error: unknown): ErrorResponse {
  if (isAxiosError(error) && error.response?.data) {
    return {
      status: error.response.status,
      ...error.response.data,
    } as ErrorResponse;
  } else {
    return {
      status: 500,
      detail: [{ type: "unknown", msg: JSON.stringify(error) }],
    };
  }
}

export default handleRequest;
export { axiosClient };