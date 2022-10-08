import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { addFood, changeDirection, MOVE, move, pause } from "../../redux/gameSlice";
import { clearBoard, drawObject, generateRandomPosition } from "../../utils";

export interface BoardProps {
	height: number;
	width: number;
}

function Board({ height, width }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [start, setStart] = useState(false);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
	const snake = useAppSelector((state) => state.game.snake);
	const food = useAppSelector((state) => state.game.food);
	const end = useAppSelector((state) => state.game.end);
	const paused = useAppSelector((state) => state.game.paused);
	const [time, setTime] = useState(0);
	const speed = useAppSelector((state) => state.game.speed);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (!start) return;
		const interval = setInterval(() => {
			setTime((prev) => prev + 1);
		}, 1000 / (speed / 100));
		if (end || paused) {
			clearInterval(interval);
			window.removeEventListener("keydown", handleKeyDown);
		}
		return () => clearInterval(interval);
	}, [speed, end, paused, start]);
	useEffect(() => {
		if (!food) return;
		setContext(canvasRef.current?.getContext("2d") ?? null);
		clearBoard(context, width, height);
		drawObject(context, [food], "#676FA3");
		drawObject(context, snake, "#91c483");
		dispatch(move());
	}, [context, time, food]);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!start) setStart(true);
		switch (e.key) {
			case "ArrowUp":
				dispatch(changeDirection(MOVE.UP));
				break;
			case "ArrowDown":
				dispatch(changeDirection(MOVE.DOWN));
				break;
			case "ArrowLeft":
				dispatch(changeDirection(MOVE.LEFT));
				break;
			case "ArrowRight":
				dispatch(changeDirection(MOVE.RIGHT));
				break;
			case " ":
				dispatch(pause());
			default:
				break;
		}
	};
	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		dispatch(addFood());
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	return (
		<canvas
			className="border-2 border-black border-solid"
			ref={canvasRef}
			height={height}
			width={width}
		/>
	);
}

export default Board;
