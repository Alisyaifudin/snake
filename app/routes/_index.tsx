import type { MetaFunction } from "@remix-run/node";
import { useRef, useState } from "react";
import Board from "~/components/Board";
import Instruction from "~/components/Instruction";
import Score from "~/components/Score";
import {  Position } from "~/lib/utils";
export const meta: MetaFunction = () => {
	return [{ title: "Snaky" }];
};

export enum MOVE {
	UP,
	DOWN,
	LEFT,
	RIGHT,
}

export default function Index() {
	const [score, setScore] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [snake, setSnake] = useState<Position[]>([]);
	const [food, setFood] = useState({ x: -100, y: -100 });
	const [direction, setDirection] = useState(MOVE.DOWN);
	const [speed, setSpeed] = useState(5);
	const [start, setStart] = useState(false);
	const interval = useRef<NodeJS.Timeout | null>(null);

	const handleReset = () => {
		setScore(0);
		setIsPaused(false);
		setIsGameOver(false);
		setStart(false);
		if (interval.current) {
			clearInterval(interval.current);
			interval.current === null;
		}
		setSpeed(5);
	};

	const handlePause = () => {
		if (isGameOver) return;
		setIsPaused((prev) => !prev);
	};

	const increaseScore = () => {
		setScore((prev) => prev + 1);
	};

	const setGameOver = () => {
		setIsGameOver(true);
		setIsPaused(true);
	};

	return (
		<main className="mx-auto max-w-xl flex flex-col gap-3">
			<h1 className="text-center text-2xl font-bold">SNAKE GAME</h1>
			<Score isGameOver={isGameOver} isPaused={isPaused} score={score} />
			<Board
				start={start}
				setStart={() => setStart((prev) => !prev)}
				isPaused={isPaused}
				direction={direction}
				food={food}
				interval={interval}
				increaseScore={increaseScore}
				pause={handlePause}
				setDirection={setDirection}
				setFood={setFood}
				setGameOver={setGameOver}
				setSnake={setSnake}
				setSpeed={setSpeed}
				snake={snake}
				speed={speed}
			/>
			<Instruction
				start={start}
				onPause={handlePause}
				onReset={handleReset}
				isGameOver={isGameOver}
				isPaused={isPaused}
			/>
		</main>
	);
}

// const initialPosition = [
// 	{ x: 500, y: 300 },
// 	{ x: 520, y: 300 },
// 	{ x: 540, y: 300 },
// ];

// const initialState = {
// 	snake: initialPosition,
// 	move: MOVE.RIGHT,
// 	oppositeMove: MOVE.LEFT,
// 	dimensions: {
// 		width: 1000,
// 		height: 600,
// 	},
// 	end: false,
// 	paused: false,
// 	speed: 300,
// 	changed: false,
// };
