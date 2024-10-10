import { useEffect, useRef, useState } from "react";
import { clearBoard, drawObject, generateRandomPosition, Position } from "~/lib/utils";
import { DIMENSIONS, TILE } from "~/lib/constants";
import { MOVE } from "~/routes/_index";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

enum KEY {
	UP,
	DOWN,
	LEFT,
	RIGHT,
	SPACE,
}

export interface BoardProps {
	pause: () => void;
	isPaused: boolean;
	setGameOver: () => void;
	increaseScore: () => void;
	direction: MOVE;
	setDirection: (dir: MOVE) => void;
	snake: Position[];
	setSnake: (pos: Position[]) => void;
	food: Position;
	setFood: (pos: Position) => void;
	speed: number;
	setSpeed: (speed: number) => void;
	start: boolean;
	setStart: () => void;
	interval: React.MutableRefObject<NodeJS.Timeout | null>;
}

function pushKey(key: KEY) {
	return function (value: KEY[]): KEY[] {
		if (value.length === 0) {
			return [key];
		} else if (value.length === 1) {
			const firstKey = value[0];
			if (
				(firstKey === KEY.DOWN && key === KEY.UP) ||
				(firstKey === KEY.UP && key === KEY.DOWN) ||
				(firstKey === KEY.LEFT && key === KEY.RIGHT) ||
				(firstKey === KEY.RIGHT && key === KEY.LEFT)
			)
				return [firstKey];
			return [firstKey, key];
		}
		return value;
	};
}

function Board({
	pause,
	isPaused,
	setGameOver,
	increaseScore,
	snake,
	setSnake,
	food,
	setFood,
	direction,
	setDirection,
	setSpeed,
	speed,
	start,
	setStart,
	interval,
}: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const deltaTime = Math.ceil(60 / speed);
	const [time, setTime] = useState(0);
	const [keyPress, setKeyPress] = useState<KEY[]>([]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!start) {
				switch (e.code) {
					case "ArrowUp": {
						setDirection(MOVE.UP);
						break;
					}
					case "ArrowDown": {
						setDirection(MOVE.DOWN);
						break;
					}
					case "ArrowLeft": {
						setDirection(MOVE.LEFT);
						break;
					}
					case "ArrowRight": {
						setDirection(MOVE.RIGHT);
						break;
					}
					default:
						return;
				}
				interval.current = setInterval(() => {
					setTime((prev) => prev + 1);
				}, 1000 / 60);
				setStart();
				return;
			}
			switch (e.code) {
				case "ArrowUp": {
					if (direction === MOVE.DOWN || direction === MOVE.UP) return;
					setKeyPress(pushKey(KEY.UP));
					break;
				}
				case "ArrowDown": {
					if (direction === MOVE.UP || direction === MOVE.DOWN) return;
					setKeyPress(pushKey(KEY.DOWN));
					break;
				}
				case "ArrowLeft": {
					if (direction === MOVE.RIGHT || direction === MOVE.LEFT) return;
					setKeyPress(pushKey(KEY.LEFT));
					break;
				}
				case "ArrowRight": {
					if (direction === MOVE.LEFT || direction === MOVE.RIGHT) return;
					setKeyPress(pushKey(KEY.RIGHT));
					break;
				}
				case "Space": {
					setKeyPress(pushKey(KEY.SPACE));
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [start, direction, interval, setStart, setDirection]);

	// initial drawing
	useEffect(() => {
		if (!start) {
			const snakeInitPos = generateRandomPosition(
				DIMENSIONS.width - TILE,
				DIMENSIONS.height - TILE
			);
			const foodInitPos = generateRandomPosition(
				DIMENSIONS.width - TILE,
				DIMENSIONS.height - TILE,
				[snakeInitPos]
			);
			setSnake([snakeInitPos]);
			setFood(foodInitPos);
			const context = canvasRef.current!.getContext("2d");
			clearBoard(context, DIMENSIONS.width, DIMENSIONS.height);
			drawObject(context, [foodInitPos], "#676FA3");
			drawObject(context, [snakeInitPos], "#91c483");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [start]);

	useEffect(() => {
		let key = null as null | KEY;
		if (keyPress.length > 0) {
			key = keyPress[0];
		}
		if (key === KEY.SPACE) {
			pause();
			setKeyPress([]);
			return;
		}
		if (time < deltaTime) return;
		setKeyPress((prev) => {
			if (prev.length === 1) return [];
			return [prev[1]];
		});

		if (isPaused) return;
		const move = () => {
			if (snake.length === 0) return;
			const head = snake[snake.length - 1];
			const newHead = { x: head.x, y: head.y };
			let dir = direction;
			switch (key) {
				case KEY.DOWN:
					dir = MOVE.DOWN;
					break;
				case KEY.UP:
					dir = MOVE.UP;
					break;
				case KEY.LEFT:
					dir = MOVE.LEFT;
					break;
				case KEY.RIGHT:
					dir = MOVE.RIGHT;
			}
			setDirection(dir);
			switch (direction) {
				case MOVE.UP:
					newHead.y = newHead.y - TILE;
					if (newHead.y < 0) newHead.y += DIMENSIONS.height;
					break;
				case MOVE.DOWN:
					newHead.y = (newHead.y + TILE) % DIMENSIONS.height;
					break;
				case MOVE.LEFT:
					newHead.x = newHead.x - TILE;
					if (newHead.x < 0) newHead.x += DIMENSIONS.width;
					break;
				case MOVE.RIGHT:
					newHead.x = (newHead.x + TILE) % DIMENSIONS.width;
					break;
				default:
					break;
			}
			if (snake.some((coord) => coord.x === newHead.x && coord.y === newHead.y)) {
				setGameOver();
				if (interval.current) {
					clearInterval(interval.current);
					interval.current = null;
				}
				return;
			}
			if (food !== undefined && food.x === newHead.x && food.y === newHead.y) {
				const food = generateRandomPosition(
					DIMENSIONS.width - TILE,
					DIMENSIONS.height - TILE,
					snake
				);
				increaseScore();
				if (speed < 10) {
					setSpeed(speed * 1.05);
				}
				setFood(food);
			} else {
				const snakeCopy = snake;
				snakeCopy.shift();
				setSnake(snakeCopy);
			}
			const snakeCopy = snake;
			snakeCopy.push(newHead);
			setSnake(snakeCopy);
			setTime(0);
		};
		if (!canvasRef.current || !food || time === 0 || isPaused || !start) return;
		const context = canvasRef.current.getContext("2d");
		clearBoard(context, DIMENSIONS.width, DIMENSIONS.height);
		drawObject(context, [food], "#676FA3");
		drawObject(context, snake, "#91c483");
		move();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time]);

	const handleClick = (key: KEY) => () => {
		if (!start) {
			switch (key) {
				case KEY.UP: {
					setDirection(MOVE.UP);
					break;
				}
				case KEY.DOWN: {
					setDirection(MOVE.DOWN);
					break;
				}
				case KEY.LEFT: {
					setDirection(MOVE.LEFT);
					break;
				}
				case KEY.RIGHT: {
					setDirection(MOVE.RIGHT);
					break;
				}
				default:
					return;
			}
			interval.current = setInterval(() => {
				setTime((prev) => prev + 1);
			}, 1000 / 60);
			setStart();
			return;
		}
		if (isPaused) return;
		switch (key) {
			case KEY.UP: {
				if (direction === MOVE.DOWN || direction === MOVE.UP) return;
				setKeyPress(pushKey(KEY.UP));
				break;
			}
			case KEY.DOWN: {
				if (direction === MOVE.UP || direction === MOVE.DOWN) return;
				setKeyPress(pushKey(KEY.DOWN));
				break;
			}
			case KEY.LEFT: {
				if (direction === MOVE.RIGHT || direction === MOVE.LEFT) return;
				setKeyPress(pushKey(KEY.LEFT));
				break;
			}
			case KEY.RIGHT: {
				if (direction === MOVE.LEFT || direction === MOVE.RIGHT) return;
				setKeyPress(pushKey(KEY.RIGHT));
				break;
			}
			default:
				return;
		}
	};

	return (
		<div>
			<canvas
				className="border-2 dark:border-white w-full border-black border-solid"
				ref={canvasRef}
				height={DIMENSIONS.height}
				width={DIMENSIONS.width}
			/>
			<div className="flex justify-center p-2">
				<div className="flex items-center flex-col gap-1">
					<Arrow onClick={handleClick(KEY.UP)} disabled={isPaused}>
						<ArrowUp className="w-10 h-10" />
					</Arrow>
					<div className="flex gap-10">
						<Arrow onClick={handleClick(KEY.LEFT)} disabled={isPaused}>
							<ArrowLeft className="w-10 h-10" />
						</Arrow>
						<Arrow onClick={handleClick(KEY.RIGHT)} disabled={isPaused}>
							<ArrowRight className="w-10 h-10" />
						</Arrow>
					</div>
					<Arrow onClick={handleClick(KEY.DOWN)} disabled={isPaused}>
						<ArrowDown className="w-10 h-10" />
					</Arrow>
				</div>
			</div>
		</div>
	);
}

export default Board;

const Arrow = ({
	children,
	onClick,
	disabled,
}: {
	children: React.ReactNode;
	onClick: () => void;
	disabled: boolean;
}) => (
	<button
		onClick={onClick}
		disabled={disabled}
		className="bg-gray-200 dark:bg-zinc-800 rounded-md shadow-md px-1"
	>
		{children}
	</button>
);
