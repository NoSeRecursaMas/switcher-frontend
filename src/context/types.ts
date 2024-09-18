export interface UserState {
    id: number;
    username: string;
  }
  
export interface UserContextType {
    user: UserState | undefined;
    setUser: (user: UserState) => void;
    isUserLoaded: boolean;
  }