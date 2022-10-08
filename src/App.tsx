import Board from "./components/Board";
import { useAppSelector } from "./redux/app/hooks";
function App() {
	const { height, width } = useAppSelector((state) => state.game.dimensions);
	return (
		<div className="mx-auto max-w-xl flex flex-col gap-3">
			<h1 className="text-center text-2xl font-bold">SNAKE GAME</h1>
			<Board height={height} width={width} />
		</div>
	);
}

export default App;
