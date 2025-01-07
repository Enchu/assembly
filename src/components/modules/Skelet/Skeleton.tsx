import React from 'react';

const Skeleton = () => {
	return (
		<section className="w-full rounded-md border border-zinc-200 bg-[#e8e8e8] h-[80px] mb-5 animate-pulse">
			<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between px-5 py-3 mt-1 relative">
				<div className="h-8 w-32 bg-zinc-300 rounded-md"></div>
				<div className="h-12 w-36 bg-zinc-300 rounded-md"></div>
			</div>
		</section>
	);
};

export default Skeleton;
