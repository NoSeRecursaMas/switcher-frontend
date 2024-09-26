import mockAdapter from "../mock-adapter";
import { gameRequest } from "./room-types";

const gameMock = (isTest = false) => {
    if (import.meta.env.VITE_MOCK === "true" || isTest) {
        mockAdapter.onPost("/games").reply((config) => {
            JSON.parse(config.data as string) as gameRequest;

            const mockResponse = {
                gameID: Math.floor(Math.random() * 100),
            };

            return [201, mockResponse];
        });
    }
};

export default gameMock;