import React from 'react';

const ScrollAreaSelectedButton = ({ ...props }) => {
	return (
		<button
			className={`border border-zinc-950/10 rounded-3xl px-14 py-2 inline-flex bg-[#94B90A] text-white item-center
					text-center`}
			{...props}
		>
			Выбран
		</button>
	);
};

export default ScrollAreaSelectedButton;
