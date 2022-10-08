import React from "react";
import { useAppSelector } from "../../redux/app/hooks";

function Score() {
	const score = useAppSelector((state) => state.game.snake).length - 3;
	const paused = useAppSelector((state) => state.game.paused);
	const gameOver = useAppSelector((state) => state.game.end);
	return (
		<div>
			<p className="text-center">Score: {score}</p>
			{gameOver ? (
				<p className="text-center font-bold">Game Over</p>
			) : paused ? (
				<p className="text-center font-bold">Paused</p>
			) : (
				<p>&nbsp;</p>
			)}
		</div>
	);
}

export default Score;
