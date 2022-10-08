import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { pause, reset } from "../../redux/gameSlice";
import Button from "../Button";

const Arrow = ({ children }: { children: string }) => (
	<div className="bg-gray-200 rounded-md shadow-md min-w-[25px] w-fit px-1">
		<p className="text-center">{children}</p>
	</div>
);

function Instruction() {
	const dispatch = useAppDispatch();
	const paused = useAppSelector((state) => state.game.paused);
	const end = useAppSelector((state) => state.game.end);
	const handleReset = () => dispatch(reset());
	const handlePause = () => dispatch(pause());
	return (
		<div className="flex flex-col">
			<h2 className="text-xl font-bold">How to Play</h2>
			<p>
				NOTE: Start the game by pressing any <span className="bg-gray-200 rounded-sm shadow-md">&nbsp;Arrow Key&nbsp;</span>
			</p>
			<div className="flex justify-between items-center mx-6 mt-3">
				<div className="flex flex-col gap-2">
					<div className="flex w-fit">
						<Arrow>↑</Arrow>
						<p>&nbsp;- Move Up</p>
					</div>
          <div className="flex w-fit">
						<Arrow>↓</Arrow>
						<p>&nbsp;- Move Down</p>
					</div>
          <div className="flex w-fit">
						<Arrow>←</Arrow>
						<p>&nbsp;- Move Left</p>
					</div>
          <div className="flex w-fit">
						<Arrow>→</Arrow>
						<p>&nbsp;- Move Right</p>
					</div>
          <div className="flex w-fit">
						<Arrow>SPACE</Arrow>
						<p>&nbsp;- Pause</p>
					</div>
				</div>
				<div className="flex flex-col gap-2 items-end">
					<Button onClick={handleReset}>Reset</Button>
					<Button disabled={end} onClick={handlePause}>
						{!paused ? "Pause" : "Resume"}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Instruction;
