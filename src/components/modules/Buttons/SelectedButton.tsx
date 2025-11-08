import React from 'react';

const SelectedButton = ({ ...props }) => {
	return (
		<button
			className={`justify-center w-[110px] ml-auto mr-4 border border-zinc-950/10
																	rounded-lg px-3 py-1.5 inline-flex cursor-pointer bg-gray-100
																	items-center text-center`}
			{...props}
		>
			Выбранный
		</button>
	);
};

export default SelectedButton;
