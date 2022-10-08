import Board from "./components/Board";
function App() {
	return (
		<div className="mx-auto max-w-xl flex flex-col gap-3">
			<h1 className="text-center text-2xl font-bold">SNAKE GAME</h1>
			<Board height={600} width={1000} />
		</div>
	);
}

export default App;
