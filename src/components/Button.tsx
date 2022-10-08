import React from "react";

interface ButtonProps {
	onClick: () => void;
	children: string;
}

function Button({
	onClick,
	children,
	...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button {...props} className="rounded-md p-2 w-fit bg-blue-400 text-white" onClick={onClick}>
			{children}
		</button>
	);
}

export default Button;
