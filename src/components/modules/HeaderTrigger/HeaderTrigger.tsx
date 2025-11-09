import React, { MouseEventHandler } from 'react';
import { Plus, RefreshCw } from 'lucide-react';

type HeaderTriggerProps = {
	title: string;
	buttonTitle: string;
	name?: string;
	variant?: 'add' | 'replace';
	onClick: MouseEventHandler<HTMLButtonElement>;
};

const HeaderTrigger = ({ title, buttonTitle, name, variant = 'add', onClick }: HeaderTriggerProps) => {
	return (
		<>
			<div className="text-lg leading-none m-0 font-semibold relative pr-4">{title}</div>
			<div className="text-xl">{name ? name : ''}</div>
			<div className="flex">
				<button
					className={'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'}
					onClick={onClick}
				>
					{variant === 'replace' ? <RefreshCw className="mr-2 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" />}
					<span>{buttonTitle}</span>
				</button>
			</div>
		</>
	);
};

export default HeaderTrigger;
