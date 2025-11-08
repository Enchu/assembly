import { MouseEventHandler } from 'react';

export interface ButtonProps {
	name: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}
