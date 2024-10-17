import Player from './playerTypes';

interface Room {
    roomID: number;
    hostID: number;
    roomName: string;
    maxPlayers: number;
    minPlayers: number;
    players: Player[];
}

interface RoomID {
    roomID: number;
}

interface RoomDetails {
    roomID: number;
    roomName: string;
    maxPlayers: number;
    actualPlayers: number;
    started: boolean;
    private: boolean;
}

interface CreateRoomRequest {
    playerID: number;
    roomName: string;
    minPlayers: number;
    maxPlayers: number;
    password?: string;
}

interface RoomListStatusMessage {
    type: string;
    payload: RoomDetails[];
}

interface RoomStatusMessage {
    type: "status";
    payload: Room;
}

interface GameStartMessage {
    type: "start";
    payload: {
        gameID: number;
    };
}

type RoomMessage = RoomStatusMessage | GameStartMessage;

export type { Room, RoomID, RoomDetails, CreateRoomRequest, RoomListStatusMessage, RoomMessage };
export default Room;