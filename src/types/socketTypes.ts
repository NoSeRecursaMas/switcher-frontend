import Room from './roomTypes';

interface SocketMessage {
    type: 'UPDATE_ROOM' | 'UPDATE_GAME';
    payload: {
        msg: string;
        status: Room;
    };
}

export default SocketMessage;