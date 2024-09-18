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
    loadUser: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.loaded = true;
    },
  },
});

export const { loadUser } = userSlice.actions;

export default userSlice.reducer;
