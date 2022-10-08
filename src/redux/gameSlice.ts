import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModeType = 'comfy' | 'unlimited';

interface SnakeCoord {
  x: number;
  y: number;
}

export interface GameState {
  snake: SnakeCoord[]
}

const initialState: GameState = {
  snake: [
    { x: 580, y: 300 },
    { x: 560, y: 300 },
    { x: 540, y: 300 },
    { x: 520, y: 300 },
    { x: 500, y: 300 },
  ]
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
  },
});

// export const {
//   setName,
//   resetAnswers,
//   resetError,
//   setWin,
//   setError,
//   setAnswers,
//   setDay,
//   setDist,
//   setLastPlayed,
//   setStats
// } = gameSlice.actions;

export default gameSlice.reducer;
