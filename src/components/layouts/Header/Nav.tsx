import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
	{
		name: 'Home',
		path: '/',
	},
];

const Nav = () => {
	const pathName = usePathname();
	return (
		<nav className={'flex gap-8'}>
			{links.map((link, index) => {
				return (
					<Link
						href={link.path}
						key={index}
						className={`${
							link.path === pathName && 'text-primary border-b-2 border-accent'
						}`}
					>
						<span className={'text-2xl'}>{link.name}</span>
					</Link>
				);
			})}
		</nav>
	);
};

export default Nav;
