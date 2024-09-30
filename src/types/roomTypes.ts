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

export type { Room, RoomID, RoomDetails, CreateRoomRequest };
export default Room;