import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { changeDirection, MOVE, move } from "../../redux/gameSlice";
import { clearBoard, drawObject, generateRandomPosition } from "../../utils";

export interface BoardProps {
	height: number;
	width: number;
}

function Board({ height, width }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
	const snake = useAppSelector((state) => state.game.snake);
	const [pos, setPos] = useState(generateRandomPosition(width - 20, height - 20, snake));
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const interval = setInterval(() => {
      setTime(prev=>prev+1);
		}, 1000/speed);
		return () => clearInterval(interval);
	}, [speed]);
	useEffect(() => {
		setContext(canvasRef.current?.getContext("2d") ?? null);
    clearBoard(context, width, height);
		drawObject(context, [pos], "#676FA3");
    drawObject(context, snake, "#91c483");
    dispatch(move())
	}, [context, time]);

  const handleKeyDown = (e: KeyboardEvent) => {
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
  };
    useEffect(()=> {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [])
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
