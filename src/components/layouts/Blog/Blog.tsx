'use client';

import React from 'react';
import './blog.scss';

import CPU from '@/components/elements/CPU/CPU';
import Motherboard from '@/components/elements/Motherboard/Motherboard';
import GPU from '@/components/elements/GPU/GPU';
import MemoryModules from '@/components/elements/MemoryModules/MemoryModules';
import PowerSupply from '@/components/elements/PowerSupply/PowerSupply';
import Summary from '@/components/elements/Summary/Summary';

const Blog = () => {
	return (
		<div className="container">
			<CPU />
			<Motherboard />
			<GPU />
			<MemoryModules />
			<PowerSupply />
			<Summary />
		</div>
	);
};

export default Blog;
