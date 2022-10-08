import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModeType = "comfy" | "unlimited";

export enum MOVE {
	UP = "UP",
	DOWN = "DOWN",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
}

interface SnakeCoord {
	x: number;
	y: number;
}

export interface GameState {
	snake: SnakeCoord[];
	move: MOVE;
	oppositeMove: MOVE;
	dimensions: {
		width: number;
		height: number;
	};
	locked: boolean;
}

const initialState: GameState = {
	snake: [
		{ x: 500, y: 300 },
		{ x: 520, y: 300 },
		{ x: 540, y: 300 },
		{ x: 560, y: 300 },
		{ x: 580, y: 300 },
	],
	move: MOVE.RIGHT,
	oppositeMove: MOVE.LEFT,
	dimensions: {
		width: 1000,
		height: 600,
	},
	locked: false,
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		move: (state) => {
			const { snake } = state;
			const head = snake[snake.length - 1];
			const newHead = { ...head };
			switch (state.move) {
				case MOVE.UP:
					newHead.y = (newHead.y - 20) % state.dimensions.height;
					break;
				case MOVE.DOWN:
					newHead.y = (newHead.y + 20) % state.dimensions.height;
					break;
				case MOVE.LEFT:
					newHead.x = (newHead.x - 20) % state.dimensions.width;
					break;
				case MOVE.RIGHT:
					newHead.x = (newHead.x + 20) % state.dimensions.width;
					break;
				default:
					break;
			}
			snake.push(newHead);
			snake.shift();
			state.locked = false;
		},
		changeDirection: (state, action: PayloadAction<MOVE>) => {
			if (action.payload !== state.oppositeMove && action.payload !== state.move && !state.locked) {
				state.move = action.payload;
				switch (action.payload) {
					case MOVE.UP:
						state.oppositeMove = MOVE.DOWN;
						break;
					case MOVE.DOWN:
						state.oppositeMove = MOVE.UP;
						break;
					case MOVE.LEFT:
						state.oppositeMove = MOVE.RIGHT;
						break;
					case MOVE.RIGHT:
						state.oppositeMove = MOVE.LEFT;
						break;
					default:
						break;
				}
				state.locked = true;
			}
		},
	},
});

export const { move, changeDirection } = gameSlice.actions;

export default gameSlice.reducer;
