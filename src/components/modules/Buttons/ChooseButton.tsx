import React from 'react';
import { Plus } from 'lucide-react';
import { ButtonProps } from '@/interface';

const ChooseButton = ({ name, onClick, className, ...props }: ButtonProps) => {
	return (
		<button
			className={`w-[110px] ml-auto mr-4 border border-zinc-950/10
																	rounded-lg px-3 py-1.5 inline-flex cursor-pointer
																	hover:bg-gray-900 hover:text-white items-center ${className}`}
			onClick={onClick}
			{...props}
		>
			<Plus className="mr-1 h-4 w-4" />
			{name}
		</button>
	);
};

export default ChooseButton;
