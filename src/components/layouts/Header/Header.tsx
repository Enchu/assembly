'use client';

import React from 'react';
import Link from 'next/link';
import Nav from '@/components/layouts/Header/Nav';

const Header = () => {
	return (
		<header className="py-5">
			<div className={'container mx-auto flex justify-between items-center'}>
				{/* LOGO */}
				<Link href={'/'}>
					<h1 className={'text-4xl font-semibold'}>Kishin</h1>
				</Link>
				<div className="hidden xl:flex items-center gap-8">
					<Nav />
				</div>
			</div>
		</header>
	);
};

export default Header;
