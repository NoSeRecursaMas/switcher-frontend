interface setUserResponseSuccess {
    status: number;
    data: {
      playerID: number;
      username: string;
    };
  }

interface setUserRequest {
    username: string;
}

export type { setUserResponseSuccess, setUserRequest };