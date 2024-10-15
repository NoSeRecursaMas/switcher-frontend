import { PlayerInGame } from "../types/gameTypes";

export const getPlayersPositions = (players: PlayerInGame[] | undefined, currentPosition: number) => {
    const res: {top: PlayerInGame | undefined, right: PlayerInGame | undefined, left: PlayerInGame | undefined} = {top: undefined, right: undefined, left: undefined};
    if (!players) return res;
    const sortedPlayers = players.sort((a, b) => a.position - b.position);

    if (sortedPlayers.length === 1) {
        res.top = sortedPlayers[0];
        return res
    } else if (sortedPlayers.length == 2) {
        if (currentPosition !== 2) {
            res.right = sortedPlayers[0];
            res.left = sortedPlayers[1];
        } else {
            res.right = sortedPlayers[1];
            res.left = sortedPlayers[0];
        }
    } else {
        if (currentPosition === 1 || currentPosition === 4) {
            res.right = sortedPlayers[0];
            res.top = sortedPlayers[1];
            res.left = sortedPlayers[2];
        } else if (currentPosition === 2) {
            res.right = sortedPlayers[1];
            res.top = sortedPlayers[2];
            res.left = sortedPlayers[0];
        } else {
            res.right = sortedPlayers[2];
            res.top = sortedPlayers[0];
            res.left = sortedPlayers[1];
        }
    }
    return res;
  };