interface Player {
  playerID: number;
  username: string;
}

interface CreatePlayerRequest {
  username: string;
}

export type { Player, CreatePlayerRequest};
export default Player;