export const clearBoard = (context: CanvasRenderingContext2D | null) => {
  if (context) {
    context.clearRect(0, 0, 800, 800);
  }
}

export interface ObjectProps {
  x: number;
  y: number;
}

export const drawObject = (
  context: CanvasRenderingContext2D | null,
  objects: ObjectProps[],
  fillStyle: string,
  strokeStyle="#146356"
) => {
  if (!context) return;
  objects.forEach((object) => {
    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.fillRect(object.x, object.y, 20, 20);
    context.strokeRect(object.x, object.y, 20, 20);
  })
}

// generate random x and y coordinates
export const generateRandomPosition = (width: number, height: number): ObjectProps => {
  const x = Math.floor(Math.random() * width);
  const y = Math.floor(Math.random() * height);
  return { x, y };
}