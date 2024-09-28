export interface createRoomResponseSuccess {
    status: number;
    data: {
        roomID: number;
    };
}

export interface createRoomRequest {
    playerID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
}
export interface GetRoomsListResponseSuccess {
    status: number;
    data: roomData[];
}

export interface roomDetails {
    roomID: number;
    roomName: string;
    maxPlayers: number;
    actualPlayers: number;
    started: boolean;
    private: boolean;
}

export interface roomData {
    roomID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
    actualPlayers: number;
    started: boolean;
    private: boolean;
}