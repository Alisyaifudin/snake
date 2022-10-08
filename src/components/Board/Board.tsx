import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { addFood, changeDirection, MOVE, move } from "../../redux/gameSlice";
import { clearBoard, drawObject, generateRandomPosition } from "../../utils";

export interface BoardProps {
	height: number;
	width: number;
}

function Board({ height, width }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
	const [locked, setLocked] = useState(false);
	const snake = useAppSelector((state) => state.game.snake);
  const food = useAppSelector((state) => state.game.food);
	const end = useAppSelector((state) => state.game.end);
	const [time, setTime] = useState(0);
	const speed = useAppSelector((state) => state.game.speed);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const interval = setInterval(() => {
			setTime((prev) => prev + 1);
		}, 1000 / (speed/100));
		if (end) {
			clearInterval(interval);
			window.removeEventListener("keydown", handleKeyDown);
		}
		return () => clearInterval(interval);
	}, [speed, end]);
	useEffect(() => {
    if(!food) return;
		setContext(canvasRef.current?.getContext("2d") ?? null);
		clearBoard(context, width, height);
		drawObject(context, [food], "#676FA3");
		drawObject(context, snake, "#91c483");
		dispatch(move());
		setLocked(false)
	}, [context, time]);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (locked) return;
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
			default:
				break;
		}
		setLocked(true);
	};
	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
    dispatch(addFood())
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
