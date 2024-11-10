import React from 'react';
import {
	Dialog,
	DialogClose,
	DialogContainer,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/core/dialog';
import { ArrowDownFromLine } from 'lucide-react';
import { Slider } from '@mui/material';

interface PriceDialogProps {
	minPrice: number;
	maxPrice: number;
	minPriceRange: number;
	maxPriceRange: number;
	range: number[];
	setRange: (range: number[]) => void;
	setMinPrice: (price: number) => void;
	setMaxPrice: (price: number) => void;
	handleMinPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleMaxPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PriceDialog: React.FC<PriceDialogProps> = ({
	minPrice,
	maxPrice,
	minPriceRange,
	maxPriceRange,
	range,
	setRange,
	setMinPrice,
	setMaxPrice,
	handleMinPriceChange,
	handleMaxPriceChange,
}) => {
	const handleChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setRange(newValue);
			setMinPrice(newValue[0]); // Обновляем minPrice
			setMaxPrice(newValue[1]); // Обновляем maxPrice
		}
	};

	return (
		<Dialog
			transition={{
				type: 'spring',
				bounce: 0.05,
				duration: 0.25,
			}}
		>
			<DialogTrigger>
				<div className="border border-zinc-950/10 bg-transparent rounded-lg p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
					<span>Цена</span>
					<ArrowDownFromLine className="h-5 w-5" />
				</div>
			</DialogTrigger>

			<DialogContainer>
				<DialogContent
					style={{ borderRadius: '24px' }}
					className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white sm:w-[500px]"
				>
					<div className="p-6">
						<DialogTitle className="text-2xl text-zinc-950">Price</DialogTitle>
						<div className="p-4" />
						<div className="relative flex items-center gap-2 p-2 h-9 w-full">
							<input
								className="w-1/2 pl-3 h-10 border border-zinc-950/10 rounded-lg bg-transparent text-zinc-900 placeholder-zinc-500 focus:outline-none"
								placeholder="Min"
								value={minPrice}
								onChange={handleMinPriceChange}
							/>
							<span>-</span>
							<input
								className="w-1/2 pl-3 h-10 border border-zinc-950/10 rounded-lg bg-transparent text-zinc-900 placeholder-zinc-500 focus:outline-none"
								placeholder="Max"
								value={maxPrice}
								onChange={handleMaxPriceChange}
							/>
						</div>
						<div className="p-5" />
						<Slider
							value={range}
							onChange={handleChange}
							valueLabelDisplay="on"
							min={minPriceRange}
							max={maxPriceRange}
							step={1}
						/>
					</div>
					<DialogClose className="text-zinc-950 " />
				</DialogContent>
			</DialogContainer>
		</Dialog>
	);
};

export default PriceDialog;
