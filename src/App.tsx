import Board from "./components/Board";
import Instruction from "./components/Instruction";
import Score from "./components/Score";
import { useAppSelector } from "./redux/app/hooks";
function App() {
	const { height, width } = useAppSelector((state) => state.game.dimensions);
	return (
		<div className="mx-auto max-w-xl flex flex-col gap-3">
			<h1 className="text-center text-2xl font-bold">SNAKE GAME</h1>
			<Score />
			<Board height={height} width={width} />
			<Instruction />
		</div>
	);
}

export default App;
