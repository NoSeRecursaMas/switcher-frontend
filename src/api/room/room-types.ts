interface roomResponseSuccess {
    status: number;
    data: {
        roomID: number;
    };
}

interface roomRequest {
    playerID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
}

interface roomData {
    roomID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
    currentPlayers: number;
    started: boolean;
}

export type { roomResponseSuccess, roomRequest, roomData };