export interface roomResponse {
    status: number;
    data: {
        roomID: number;
    };
}

export interface roomDetails {
    roomID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
    currentPlayers: number;
    started: boolean;
    private: boolean;
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
}

export interface roomListResponse {
    status: number;
    data: roomData[];
}