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
  creatorID: number;
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
