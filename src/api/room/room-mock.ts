import mockAdapter from "../mock-adapter";
import { roomRequest } from "./room-types";

const roomMock = (isTest = false) => {
    if (import.meta.env.VITE_MOCK === "true" || isTest) {
        mockAdapter.onPost("/rooms").reply((config) => {
            JSON.parse(config.data as string) as roomRequest;

            const mockResponse = {
                roomID: Math.floor(Math.random() * 100),
            };

            return [201, mockResponse];
        });
    }
};

export default roomMock;