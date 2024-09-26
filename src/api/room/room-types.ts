export interface roomResponse {
    status: number;
    data: {
        roomID: number;
    };
}

export interface gameResponse {
    status: number;
    data: {
        gameID: number;
    };
}

export interface gameRequest {
    playerID: number;
}

export interface roomRequest {
    playerID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
}

export interface roomData {
    roomID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
    currentPlayers: number;
    started: boolean;
    private: boolean;
    hostID: number;
}

export interface roomListResponse {
    status: number;
    data: roomData[];
}