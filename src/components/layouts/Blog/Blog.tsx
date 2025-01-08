'use client';

import React from 'react';
import './blog.scss';

import CPU from '@/components/elements/CPU/CPU';
import Motherboard from '@/components/elements/Motherboard/Motherboard';
import GPU from '@/components/elements/GPU/GPU';
import MemoryModules from '@/components/elements/MemoryModules/MemoryModules';
import PowerSupply from '@/components/elements/PowerSupply/PowerSupply';
import { ScrollArea } from '@/components/core/scroll-area';
import { Toaster } from 'react-hot-toast';

const Blog = () => {
	return (
		<div className="container">
			<div>
				<Toaster position="bottom-right" reverseOrder={false} />
			</div>
			<ScrollArea type="scroll">
				<CPU />
				<Motherboard />
				<GPU />
				<MemoryModules />
				<PowerSupply />
				{/*<Summary />*/}
			</ScrollArea>
		</div>
	);
};

export default Blog;
