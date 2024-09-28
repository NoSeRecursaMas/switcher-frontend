import { Socket } from "socket.io-client";

export interface UserState {
  id: number;
  username: string;
}

export interface UserContextType {
user: UserState | undefined;
setUser: (user: UserState) => void;
isUserLoaded: boolean;
}

export interface RoomState {
  id: number;
  creator_id: number;
  name: string;
  maxPlayers: number;
  minPlayers: number;
  players: UserState[];
}

export interface RoomContextType {
  room: RoomState | undefined;
  setRoom: (room: RoomState) => void;
  isRoomDataLoaded: boolean;
}

export interface SocketData {
  type: "update";
  payload: {msg: string, status: RoomState};
}

interface ServerToClientEvents {
  getMessage: (data: SocketData) => void;
}

interface ClientToServerEvents {
  sendMessage: (data: { type: string; payload: object }) => void;
}

export interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  isSocketLoaded: boolean;
  setSocket: (socket: Socket) => void;
}
