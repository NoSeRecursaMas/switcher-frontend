import mockAdapter from "../mockAdapter";
import { roomRequest } from "./roomTypes";

const roomMock = (isTest = false) => {
    if (import.meta.env.VITE_MOCK === "true" || isTest) {
        mockAdapter.onPost("/lobbys").reply((config) => {
            JSON.parse(config.data as string) as roomRequest;

            const mockResponse = {
                roomID: Math.floor(Math.random() * 100),
            };

            return [201, mockResponse];
        });
    }
};

export default roomMock;