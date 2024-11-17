import React, { useState } from 'react';
import {
	Disclosure,
	DisclosureContent,
	DisclosureTrigger,
} from '@/components/core/disclosure';
import {
	ArrowDownFromLine,
	Plus,
	RefreshCw,
	ChevronsDownUp,
} from 'lucide-react';
import {
	Dialog,
	DialogClose,
	DialogContainer,
	DialogContent,
	DialogImage,
	DialogSubtitle,
	DialogTitle,
	DialogTrigger,
} from '@/components/core/dialog';
import Checkbox from '@mui/material/Checkbox';
import { ScrollArea } from '@/components/core/scroll-area';
import { Autocomplete, TextField } from '@mui/material';
import { Separator } from '@radix-ui/react-separator';
import items from '@/data/data.json';
import { useMemoryStore } from '@/store/store';
import PriceDialog from '@/components/modules/PriceDialog/PriceDialog';
import { RAMItem } from '@/interface/Ram';

const MemoryModules = () => {
	const ramItems: RAMItem[] = items[0].ram;

	const uniqueMemories = Array.from(
		new Set(ramItems.map(item => item.Capacity)),
	).sort((a, b) => {
		return Number(b) - Number(a);
	});
	const [selectedMemory, setSelectedMemory] = useState<string[]>([]);

	const uniqueManufacturers = Array.from(
		new Set(ramItems.map(item => item.Manufacturer)),
	);

	const minPriceRange = Math.min(
		...ramItems.map(item => parseInt(item.price, 10)),
	);
	const maxPriceRange = Math.max(
		...ramItems.map(item => parseInt(item.price, 10)),
	);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);

	const [minPrice, setMinPrice] = useState<number>(minPriceRange);
	const [maxPrice, setMaxPrice] = useState<number>(maxPriceRange);

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);
	const { memory, setMemory } = useMemoryStore();
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [selectedGPU, setSelectedGPU] = useState<RAMItem | null>(null);

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// FILTERED
	const filteredRamItems = ramItems
		.filter(memory => {
			// Фильтруем по производителю
			const matchesManufacturer =
				selectedManufacturer.length > 0
					? selectedManufacturer.includes(memory.Manufacturer)
					: true;

			// Если выбран GPU, показываем только его
			const matchesSelectedGPU = selectedGPU
				? memory.name === selectedGPU.name
				: true;

			// Проверяем, попадает ли цена в диапазон
			const gpuPrice = parseFloat(memory.price); // Преобразуем цену в число
			const matchesPriceRange = gpuPrice >= range[0] && gpuPrice <= range[1];

			const matchesMemory =
				selectedMemory.length > 0
					? selectedMemory.includes(memory.Capacity)
					: true;

			return (
				matchesManufacturer &&
				matchesSelectedGPU &&
				matchesPriceRange &&
				matchesMemory
			);
		})
		.sort((a, b) => {
			const priceA = parseFloat(a.price);
			const priceB = parseFloat(b.price);
			return sortOrder === 'desc' ? priceA - priceB : priceB - priceA;
		});

	const toggleSortOrder = () => {
		setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
	};

	const handleMemoryChange = (memory: string) => {
		setSelectedMemory(prev =>
			prev.includes(memory)
				? prev.filter(item => item !== memory)
				: [...prev, memory],
		);
	};

	const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		if (value >= minPriceRange && value <= range[1]) {
			setMinPrice(value);
			setRange([value, range[1]]); // Обновляем диапазон слайдера
		}
	};

	const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		if (value >= range[0] && value <= maxPriceRange) {
			setMaxPrice(value);
			setRange([range[0], value]); // Обновляем диапазон слайдера
		}
	};

	const handleGPUChange = (
		event: React.ChangeEvent<unknown>,
		value: RAMItem,
	) => {
		event.stopPropagation();
		setMemory(value);
		setIsOpenDisclosure(false);
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		setMemory(null);
		setSelectedGPU(null);
	};

	const handleManufacture = (manufacturer: string) => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer)
				? prev.filter((item: string) => item !== manufacturer)
				: [...prev, manufacturer],
		);
	};

	return (
		<>
			<Disclosure
				className={`w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700 mb-5 ${memory !== null ? 'bg-green-600' : ''}`}
				open={isOpenDisclosure}
			>
				<DisclosureTrigger>
					{memory !== null ? (
						<div
							className="px-5 py-3 flex justify-between items-center relative"
							onClick={() => handleDialogClose()}
						>
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Модули памяти
							</div>
							<div>{memory.name}</div>
							<div className="flex">
								<button
									className={
										'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
									}
								>
									<RefreshCw className="mr-2 h-4 w-4" /> | Заменить
								</button>
							</div>
						</div>
					) : (
						<div
							className="px-5 py-3 flex justify-between items-center relative"
							onClick={() => setIsOpenDisclosure(!isOpenDisclosure)}
						>
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Модули памяти
							</div>
							<div className="flex">
								<button
									className={
										'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
									}
								>
									<Plus className="mr-1 h-4 w-4" /> | Добавить
								</button>
							</div>
						</div>
					)}
				</DisclosureTrigger>
				<DisclosureContent>
					<div className="overflow-hidden pb-3">
						<div className="font-mono text-sm">
							<div className="space-x-2">
								<div className="ml-2 relative w-full flex gap-4 h-12 items-center">
									<Autocomplete
										disablePortal
										sx={{
											width: 500,
											alignItems: 'center',
											position: 'relative',
											display: 'flex',
										}}
										size="small"
										renderInput={params => (
											<TextField {...params} label="RAM" />
										)}
										options={ramItems.map((gpu: RAMItem) => {
											return gpu.name;
										})}
										onChange={(event, value) => {
											const selected = ramItems.find(gpu => gpu.name === value);
											setSelectedGPU(selected || null);
										}}
									/>

									<PriceDialog
										minPrice={minPrice}
										maxPrice={maxPrice}
										minPriceRange={minPriceRange}
										maxPriceRange={maxPriceRange}
										range={range}
										setRange={setRange}
										setMinPrice={setMinPrice}
										setMaxPrice={setMaxPrice}
										handleMinPriceChange={handleMinPriceChange}
										handleMaxPriceChange={handleMaxPriceChange}
									/>

									<Dialog
										transition={{
											type: 'spring',
											bounce: 0.05,
											duration: 0.25,
										}}
									>
										<DialogTrigger>
											<div className="border border-zinc-950/10 bg-transparent rounded-lg p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
												<span>Производитель</span>
												<ArrowDownFromLine className="h-5 w-5" />
											</div>
										</DialogTrigger>

										<DialogContainer>
											<DialogContent
												style={{ borderRadius: '24px' }}
												className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white sm:w-[500px]"
											>
												<div className="p-6">
													<DialogTitle className="text-2xl text-zinc-950">
														Производитель
													</DialogTitle>
													<div className="p-2" />
													<div className="relative flex flex-col p-2 w-full">
														{uniqueManufacturers.map(manufacturer => (
															<div
																className="flex text-center items-center"
																key={manufacturer}
															>
																<Checkbox
																	checked={selectedManufacturer.includes(
																		manufacturer,
																	)}
																	onClick={() =>
																		handleManufacture(manufacturer)
																	}
																/>
																<span>{manufacturer}</span>
															</div>
														))}
													</div>
												</div>
												<DialogClose className="text-zinc-950 " />
											</DialogContent>
										</DialogContainer>
									</Dialog>

									<Dialog
										transition={{
											type: 'spring',
											bounce: 0.05,
											duration: 0.25,
										}}
									>
										<DialogTrigger>
											<div className="border border-zinc-950/10 bg-transparent rounded-lg p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
												<span>Объем памяти</span>
												<ArrowDownFromLine className="h-5 w-5" />
											</div>
										</DialogTrigger>

										<DialogContainer>
											<DialogContent
												style={{ borderRadius: '24px' }}
												className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white sm:w-[500px]"
											>
												<div className="p-6">
													<DialogTitle className="text-2xl text-zinc-950">
														Объем памяти
													</DialogTitle>
													<div className="p-2" />
													<div className="relative flex flex-col p-2 w-full">
														{uniqueMemories.map(memory => (
															<div
																key={memory}
																className="flex text-center items-center"
															>
																<Checkbox
																	checked={selectedMemory.includes(memory)}
																	onChange={() => handleMemoryChange(memory)}
																/>
																<span>{memory}</span>
															</div>
														))}
													</div>
												</div>
												<DialogClose className="text-zinc-950 " />
											</DialogContent>
										</DialogContainer>
									</Dialog>

									{/*<Dialog
										transition={{
											type: 'spring',
											bounce: 0.05,
											duration: 0.25,
										}}
									>
										<DialogTrigger>
											<div className="border border-zinc-950/10 bg-transparent rounded-lg p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
												<span>Количество потоков</span>
												<ArrowDownFromLine className="h-5 w-5" />
											</div>
										</DialogTrigger>

										<DialogContainer>
											<DialogContent
												style={{ borderRadius: '24px' }}
												className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white sm:w-[500px]"
											>
												<div className="p-6">
													<DialogTitle className="text-2xl text-zinc-950">
														Количество потоков
													</DialogTitle>
													<div className="p-2" />
													<div className="relative flex flex-col p-2 w-full">
														<div className="flex text-center items-center">
															<Checkbox />
															<span>123</span>
														</div>
														<div className="flex text-center items-center">
															<Checkbox />
															<span>123</span>
														</div>
													</div>
												</div>
												<DialogClose className="text-zinc-950 " />
											</DialogContent>
										</DialogContainer>
									</Dialog>*/}
								</div>

								{/*Title*/}
								{filteredRamItems.length === 0 ? (
									<></>
								) : (
									<div className="flex w-full text-base gap-2 mt-4 bg-amber-100 items-center justify-center cursor-default">
										<div className="ml-2">
											<div className="Icon" />
											<span>Изображение</span>
										</div>

										<div className="w-[38%]">
											<div className="Icon" />
											<span>Название</span>
										</div>

										<div className="">
											<div className="Icon" />
											<span>Объем памяти</span>
										</div>

										<div className="">
											<div className="Icon" />
											<span>Скорость</span>
										</div>

										<div className="">
											<div className="Icon" />
											<span>Тип</span>
										</div>

										<div className="flex">
											<div className="Icon" />
											<span>Модули</span>
										</div>

										<div
											className="flex ml-14 cursor-pointer"
											onClick={toggleSortOrder}
										>
											<ChevronsDownUp className="" />
											<span>Цена</span>
										</div>

										<div className="ml-auto mr-14">
											<div className="Icon" />
											<span>Показать еще</span>
										</div>
									</div>
								)}

								{/*Items*/}
								{filteredRamItems.length === 0 ? (
									<div className={'font-bold text-2xl text-center m-10'}>
										<p>Нет доступных модулей памяти для отображения.</p>
									</div>
								) : (
									<div>
										{filteredRamItems.map((memory: RAMItem) => (
											<Dialog
												transition={{
													type: 'spring',
													stiffness: 200,
													damping: 24,
												}}
												key={memory.id}
											>
												<DialogTrigger
													style={{ borderRadius: '4px' }}
													className="border border-gray-200/60 bg-white mb-1 mt-1 w-full flex items-center space-x-3"
												>
													<div className="w-full flex flex-col items-center justify-center gap-1 space-y-0">
														<div className="w-full items-center">
															<>
																<div className="bg-white gap-4">
																	<div className="w-full h-full flex p-2 items-center">
																		<DialogImage
																			src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																			alt="What I Talk About When I Talk About Running - book cover"
																			className="h-8 w-8 object-cover object-top mr-2"
																			style={{ borderRadius: '4px' }}
																		/>
																		<div className="w-3/6 text-left">
																			{memory.name}
																		</div>
																		<div className="w-14">
																			{memory.Capacity}
																		</div>
																		<div className="w-14">{memory.Speed}</div>
																		<div className="w-20 text-center">
																			{memory.Type}
																		</div>
																		<div className="w-14 text-center">
																			{memory.Modules}
																		</div>
																		<div className="w-24 text-center">
																			{memory.price}₽
																		</div>
																		<button
																			className={`ml-auto mr-4 border border-zinc-950/10 
																	rounded-3xl px-5 py-2 inline-flex cursor-pointer 
																	hover:bg-gray-900 hover:text-white items-center`}
																			onClick={e => {
																				handleGPUChange(e, memory);
																			}}
																		>
																			<Plus className="mr-2 h-4 w-4 " /> |
																			Выбрать
																		</button>
																	</div>
																</div>
															</>
														</div>
													</div>
												</DialogTrigger>
												<DialogContainer>
													<DialogContent
														style={{ borderRadius: '12px' }}
														className="relative h-auto w-[700px] border border-gray-100 bg-white"
													>
														<ScrollArea className="h-[90vh]" type="scroll">
															<div className="relative p-6">
																<div className="flex justify-center py-10">
																	<DialogImage
																		src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																		alt="What I Talk About When I Talk About Running - book cover"
																		className="h-auto w-[200px]"
																	/>
																</div>
																<div className="">
																	<DialogTitle className="text-black text-2xl font-bold">
																		{memory.name}
																	</DialogTitle>
																	<DialogSubtitle>
																		<div className="flex justify-between text-center items-center my-3">
																			<div className="text-4xl text-[#F2530C]">
																				{memory.price}
																			</div>
																			<button
																				className={
																					'border border-zinc-950/10 rounded-3xl px-14 py-2' +
																					' inline-flex bg-[#94B90A] text-white item-center text-center'
																				}
																				onClick={e => {
																					handleGPUChange(e, memory);
																				}}
																			>
																				<Plus /> | Выбрать
																			</button>
																		</div>
																	</DialogSubtitle>
																	<div className="mt-2 text-base text-gray-700">
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Производитель</span>
																			<span>{memory.Manufacturer}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Объем памяти</span>
																			<span>{memory.Capacity}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Частота</span>
																			<span>{memory.Speed}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Тип</span>
																			<span>{memory.Type}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Латентность</span>
																			<span>{memory.Latency}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Напряжение</span>
																			<span>{memory.Voltage}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Модули</span>
																			<span>{memory.Modules}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																	</div>
																</div>
															</div>
														</ScrollArea>
														<DialogClose className="text-zinc-500" />
													</DialogContent>
												</DialogContainer>
											</Dialog>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</DisclosureContent>
			</Disclosure>
		</>
	);
};

export default MemoryModules;
