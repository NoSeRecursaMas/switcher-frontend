import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
  id: number;
  username: string;
}

interface UserState {
  data: UserData | null;
  loaded: boolean;
}
const initialState: UserState = {
  data: null,
  loaded: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.loaded = true;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
