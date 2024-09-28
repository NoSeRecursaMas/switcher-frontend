export interface loadUserResponseSuccess {
    status: number;
    data: {
        playerID: number;
        username: string;
    };
}

export interface loadUserRequest {
    username: string;
}