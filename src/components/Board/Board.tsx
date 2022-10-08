import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/app/hooks";
import { drawObject, generateRandomPosition } from "../../utils";

export interface BoardProps {
	height: number;
	width: number;
}

function Board({ height, width }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
	const [pos, setPos] = useState(generateRandomPosition(width - 20, height - 20));
  const snake = useAppSelector(state=> state.game.snake);
	useEffect(() => {
		setContext(canvasRef.current?.getContext("2d") ?? null);
    drawObject(context, snake, "#91c483");
    drawObject(context, [pos], "#676FA3");
	}, [context]);
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
