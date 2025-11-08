import React from 'react';
import { Plus } from 'lucide-react';
import { ButtonProps } from '@/interface';

const ScrollAreaChooseButton = ({ name, onClick, className, ...props }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`border border-zinc-950/10 rounded-lg px-8 py-2 
																							inline-flex bg-[#94B90A] text-white items-center justify-center gap-2 ${className}`}
			{...props}
		>
			<Plus className="h-4 w-4" />
			{name}
		</button>
	);
};

export default ScrollAreaChooseButton;
