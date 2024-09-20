import mockAdapter from "../mock-adapter";

const roomListMock = (isTest = false) => {
    if (import.meta.env.VITE_MOCK === "true" || isTest) {
        mockAdapter.onGet("/rooms").reply(() => {
            const mockResponse = 
                    [
                        {
                            roomID: 1,
                            roomName: "Sala 1",
                            minPlayers: 2,
                            maxPlayers: 4,
                            currentPlayers: 2,
                            started: false,
                        },
                        {
                            roomID: 2,
                            roomName: "Sala 2",
                            minPlayers: 3,
                            maxPlayers: 4,
                            currentPlayers: 3,
                            started: false,
                        },
                        {
                            roomID: 3,
                            roomName: "Sala 3",
                            minPlayers: 2,
                            maxPlayers: 2,
                            currentPlayers: 2,
                            started: false,
                        },
                    ];
            //const mockResponse = []; Test de caso sin salas
            console.log(mockResponse);
            return [200, mockResponse];
        });
    }
};

export default roomListMock;