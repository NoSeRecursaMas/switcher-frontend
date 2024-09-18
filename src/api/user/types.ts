interface loadUserResponseSuccess {
    status: number;
    data: {
      playerID: number;
      username: string;
    };
  }

interface loadUserRequest {
    username: string;
}

export type { loadUserResponseSuccess, loadUserRequest };