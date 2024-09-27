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
                            private: true,
                        },
                        {
                            roomID: 2,
                            roomName: "Sala 2",
                            minPlayers: 3,
                            maxPlayers: 4,
                            currentPlayers: 3,
                            started: false,
                            private: false,
                        },
                        {
                            roomID: 3,
                            roomName: "Sala 3",
                            minPlayers: 2,
                            maxPlayers: 2,
                            currentPlayers: 2,
                            started: false,
                            private: false,
                        },
                        {
                            roomID: 4,
                            roomName: "Salaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            minPlayers: 2,
                            maxPlayers: 4,
                            currentPlayers: 2,
                            started: false,
                            private: false,
                        },
                        {
                            roomID: 5,
                            roomName: ".",
                            minPlayers: 3,
                            maxPlayers: 4,
                            currentPlayers: 3,
                            started: false,
                            private: false,
                        },
                        {
                            roomID: 6,
                            roomName: "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
                            minPlayers: 2,
                            maxPlayers: 4,
                            currentPlayers: 2,
                            started: false,
                            private: false,
                        },
                        {
                            roomID: 7,
                            roomName: "SALA EMPEZADA",
                            minPlayers: 2,
                            maxPlayers: 4,
                            currentPlayers: 2,
                            started: true,
                            private: false,
                        },
                        {
                            roomID: 8,
                            roomName: "Sala llena",
                            minPlayers: 3,
                            maxPlayers: 4,
                            currentPlayers: 4,
                            started: false,
                            private: false,
                        },
                        {
                            roomID: 9,
                            roomName: "OwO",
                            minPlayers: 2,
                            maxPlayers: 3,
                            currentPlayers: 2,
                            started: false,
                            private: false,
                        },
                    ];
            //const mockResponse = []; Test de caso sin salas
            console.log(mockResponse);
            return [200, mockResponse];
        });
    }
};

export default roomListMock;