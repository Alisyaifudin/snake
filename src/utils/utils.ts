export const clearBoard = (
	context: CanvasRenderingContext2D | null,
	width: number,
	height: number
) => {
	if (context) {
		context.clearRect(0, 0, width, height);
	}
};

export interface ObjectProps {
	x: number;
	y: number;
}

export const drawObject = (
	context: CanvasRenderingContext2D | null,
	objects: ObjectProps[],
	fillStyle: string,
	strokeStyle = "#146356"
) => {
	if (!context) return;
	objects.forEach((object) => {
		context.fillStyle = fillStyle;
		context.strokeStyle = strokeStyle;
		context.fillRect(object.x, object.y, 20, 20);
		context.strokeRect(object.x, object.y, 20, 20);
	});
};

// generate random x and y coordinates
export const generateRandomPosition = (
	width: number,
	height: number,
	disallowed: ObjectProps[]
): ObjectProps => {
	while (true) {
		const x = Math.floor((Math.random() * width) / 20) * 20;
		const y = Math.floor((Math.random() * height) / 20) * 20;
		const isDisallowed = disallowed.some((object) => object.x === x && object.y === y);
		if (!isDisallowed) {
			return { x, y };
		}
	}
};
