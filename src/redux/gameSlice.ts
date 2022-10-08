import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateRandomPosition } from "../utils";

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
	food?: SnakeCoord;
	end: boolean;
	paused: boolean;
	speed: number;
}

const initialPosition = [
	{ x: 500, y: 300 },
	{ x: 520, y: 300 },
	{ x: 540, y: 300 },
];

const initialState: GameState = {
	snake: initialPosition,
	move: MOVE.RIGHT,
	oppositeMove: MOVE.LEFT,
	dimensions: {
		width: 1000,
		height: 600,
	},
	end: false,
	paused: false,
	speed: 100,
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		move: (state) => {
			const { snake, dimensions } = state;
			const head = snake[snake.length - 1];
			const newHead = { ...head };
			switch (state.move) {
				case MOVE.UP:
					newHead.y = newHead.y - 20;
					if (newHead.y < 0) newHead.y += dimensions.height;
					break;
				case MOVE.DOWN:
					newHead.y = (newHead.y + 20) % state.dimensions.height;
					break;
				case MOVE.LEFT:
					newHead.x = newHead.x - 20;
					if (newHead.x < 0) newHead.x += dimensions.width;
					break;
				case MOVE.RIGHT:
					newHead.x = (newHead.x + 20) % state.dimensions.width;
					break;
				default:
					break;
			}
			if (snake.some((coord) => coord.x === newHead.x && coord.y === newHead.y)) {
				state.end = true;
				return;
			}
			if (state.food && state.food.x === newHead.x && state.food.y === newHead.y) {
				const food = generateRandomPosition(dimensions.width - 20, dimensions.height - 20, snake);
				state.food = food;
				if (state.speed < 400) state.speed += 10;
			} else {
				snake.shift();
			}
			snake.push(newHead);
		},
		changeDirection: (state, action: PayloadAction<MOVE>) => {
			if (action.payload !== state.oppositeMove && action.payload !== state.move) {
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
			}
		},
		addFood: (state) => {
			const { snake, dimensions } = state;
			const food = generateRandomPosition(dimensions.width - 20, dimensions.height - 20, snake);
			state.food = food;
		},
		setPaused: (state, action: PayloadAction<boolean>) => {
			state.paused = action.payload;
		},
		reset: (state) => {
			state.end = false;
			state.snake = initialPosition;
			state.move = MOVE.RIGHT;
			state.oppositeMove = MOVE.LEFT;
		},
	},
});

export const { move, changeDirection, addFood } = gameSlice.actions;

export default gameSlice.reducer;
