import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModeType = 'comfy' | 'unlimited';

export interface MetaState {
}

const initialState: MetaState = {
};

export const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
  },
});

// export const {
//   changeMode,
//   setReady,
// } = metaSlice.actions;

export default metaSlice.reducer;
