interface Props {
	score: number;
	isGameOver: boolean;
	isPaused: boolean;
}

export default function Score({ score, isGameOver, isPaused }: Props) {
	return (
		<div>
			<p className="text-center">Score: {score}</p>
			{isGameOver ? (
				<p className="text-center font-bold">Game Over</p>
			) : isPaused ? (
				<p className="text-center font-bold">Paused</p>
			) : (
				<p>&nbsp;</p>
			)}
		</div>
	);
}
