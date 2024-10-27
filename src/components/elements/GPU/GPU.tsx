import React, { useState } from 'react';
import {
	Disclosure,
	DisclosureContent,
	DisclosureTrigger,
} from '@/components/core/disclosure';
import { ArrowDownFromLine, Plus, RefreshCw } from 'lucide-react';
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
import { Autocomplete, Slider, TextField } from '@mui/material';
import { Separator } from '@radix-ui/react-separator';
import items from '@/data/data.json';

interface GPUItems {
	id: string;
	img: string;
	name: string;
	Manufacturer: string; // Производитель
	TDP: string;
	Memory: string; // Память
	MemoryBus: string; // Шина памяти
	MemoryType: string; // Тип памяти
	CoreClock: string; // Частота графического ядра
	Performance: string; // Производительность
	Interface: string; // Интерфейс
	Connectors: string; // Разъемы
	RecommendedPowerSupply: string; // Рекомендуемая мощь блока питания
	score: string;
	price: string; //Цена
}

const Gpu = () => {
	const gpuItems: GPUItems[] = items[0].gpu;

	const minPriceRange = Math.min(
		...gpuItems.map(item => parseInt(item.price, 10)),
	);
	const maxPriceRange = Math.max(
		...gpuItems.map(item => parseInt(item.price, 10)),
	);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);

	const [minPrice, setMinPrice] = useState<number>(minPriceRange);
	const [maxPrice, setMaxPrice] = useState<number>(maxPriceRange);

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);
	const [gpu, setGPU] = useState<GPUItems>();
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [selectedGPU, setSelectedGPU] = useState<GPUItems | null>(null);

	const filteredGpuItems = gpuItems.filter(gpu => {
		// Фильтруем по производителю
		const matchesManufacturer =
			selectedManufacturer.length > 0
				? selectedManufacturer.includes(gpu.Manufacturer)
				: true;

		// Если выбран GPU, показываем только его
		const matchesSelectedGPU = selectedGPU
			? gpu.name === selectedGPU.name
			: true;

		// Проверяем, попадает ли цена в диапазон
		const gpuPrice = parseFloat(gpu.price); // Преобразуем цену в число
		const matchesPriceRange = gpuPrice >= range[0] && gpuPrice <= range[1];

		return matchesManufacturer && matchesSelectedGPU && matchesPriceRange;
	});

	const handleChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setRange(newValue);
			setMinPrice(newValue[0]); // Обновляем minPrice
			setMaxPrice(newValue[1]); // Обновляем maxPrice
		}
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
		value: GPUItems,
	) => {
		event.stopPropagation();
		setGPU(value);
		setIsOpenDisclosure(false);
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		setGPU(undefined);
	};

	const handleManufactor = (manufacturer: 'NVIDIA' | 'AMD') => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer)
				? prev.filter((item: string) => item !== manufacturer)
				: [...prev, manufacturer],
		);
	};

	return (
		<>
			<Disclosure
				className={`w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700 mb-5 ${gpu !== undefined ? 'bg-green-600' : ''}`}
				open={isOpenDisclosure}
			>
				<DisclosureTrigger>
					{gpu !== undefined ? (
						<div
							className="px-5 py-3 flex justify-between items-center relative"
							onClick={() => handleDialogClose()}
						>
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Видеокарта
							</div>
							<div>{gpu.name}</div>
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
							onClick={() => setIsOpenDisclosure(true)}
						>
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Видеокарта
							</div>
							<div className="flex">
								<button
									className={
										'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
									}
								>
									<Plus className="mr-2 h-4 w-4" /> | Добавить
								</button>
							</div>
						</div>
					)}
				</DisclosureTrigger>
				<DisclosureContent>
					<div className="overflow-hidden pb-3">
						<div className="pt-1 font-mono text-sm">
							<div className="space-x-2">
								<div className="relative w-full flex gap-4 h-12 items-center">
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
											<TextField {...params} label="GPU" />
										)}
										options={gpuItems.map((gpu: GPUItems) => {
											return gpu.name;
										})}
										onChange={(event, value) => {
											const selected = gpuItems.find(gpu => gpu.name === value);
											setSelectedGPU(selected || null);
										}}
									/>

									<Dialog
										transition={{
											type: 'spring',
											bounce: 0.05,
											duration: 0.25,
										}}
									>
										<DialogTrigger>
											<div className="border border-zinc-950/10 bg-transparent rounded-lg  p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
													<DialogTitle className="text-2xl text-zinc-950">
														Price
													</DialogTitle>
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
														{/*<button className="h-10 px-5 border border-zinc-950/10 rounded-3xl text-white bg-neutral-950 hover:bg-[#FC5D36] transition-all">
															Ок
														</button>*/}
													</div>
													<div className="p-5" />

													<Slider
														value={range}
														onChange={(event, newValue: number | number[]) =>
															handleChange(event, newValue)
														}
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
														<div className="flex text-center items-center">
															<Checkbox
																checked={selectedManufacturer.includes(
																	'NVIDIA',
																)}
																onClick={() => handleManufactor('NVIDIA')}
															/>
															<span>NVIDIA</span>
														</div>
														<div className="flex text-center items-center">
															<Checkbox
																checked={selectedManufacturer.includes('AMD')}
																onClick={() => handleManufactor('AMD')}
															/>
															<span>AMD</span>
														</div>
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
												<span>Количетсво ядер</span>
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
														Количетсво ядер
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
									</Dialog>
								</div>

								{/*Title*/}
								{filteredGpuItems.length === 0 ? (
									<></>
								) : (
									<div>
										<div className="flex w-full gap-4 mt-4 bg-amber-100 items-center">
											<div className="flex items-center gap-2">
												<div className="Icon" />
												<span>Изображение</span>
											</div>
											<div className="w-[42%]">
												<div className="Icon" />
												<span>Название</span>
											</div>

											<div className="">
												<div className="Icon" />
												<span>Score</span>
											</div>

											<div className="">
												<div className="Icon" />
												<span>Мощность БП</span>
											</div>

											<div className="">
												<div className="Icon" />
												<span>Цена</span>
											</div>

											<div className="">
												<div className="Icon" />
												<span>Показать еще</span>
											</div>
										</div>
									</div>
								)}

								{/*Items*/}
								{filteredGpuItems.length === 0 ? (
									<div className={'font-bold text-2xl text-center m-10'}>
										<p>Нет доступных видеокарт для отображения.</p>
									</div>
								) : (
									<div>
										{filteredGpuItems.map((gpu: GPUItems) => (
											<Dialog
												transition={{
													type: 'spring',
													stiffness: 200,
													damping: 24,
												}}
												key={gpu.id}
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
																		<div className="w-3/6 items-center">
																			<span>{gpu.name}</span>
																		</div>
																		<span className="w-14">{gpu.Memory}</span>
																		<span className="w-14">{gpu.TDP}</span>
																		<span className="w-14">
																			{gpu.RecommendedPowerSupply}
																		</span>
																		<span className="w-14">{gpu.score}</span>
																		<span className="w-14">{gpu.price}₽</span>
																		<button
																			className={`ml-4 border border-zinc-950/10 
																	rounded-3xl px-5 py-2 inline-flex cursor-pointer 
																	hover:bg-gray-900 hover:text-white items-center`}
																			onClick={e => {
																				handleGPUChange(e, gpu);
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
																		{gpu.name}
																	</DialogTitle>
																	<DialogSubtitle>
																		<div className="flex justify-between text-center items-center my-3">
																			<div className="text-4xl text-[#F2530C]">
																				{gpu.price}
																			</div>
																			<button
																				className={
																					'border border-zinc-950/10 rounded-3xl px-14 py-2' +
																					' inline-flex bg-[#94B90A] text-white item-center text-center'
																				}
																				onClick={e => {
																					handleGPUChange(e, gpu);
																				}}
																			>
																				<Plus /> | Выбрать
																			</button>
																		</div>
																	</DialogSubtitle>
																	<div className="mt-2 text-base text-gray-700">
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Объем памяти</span>
																			<span>{gpu.Memory} GB</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Шина памяти</span>
																			<span>{gpu.MemoryBus} bit</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Тип памяти</span>
																			<span>{gpu.MemoryType}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Частота графического ядра</span>
																			<span>{gpu.CoreClock} MHz</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Производительность</span>
																			<span>{gpu.Performance}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Интерфейс</span>
																			<span>{gpu.Interface}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Разъемы</span>
																			<span>{gpu.Connectors}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Рекомендуемая мощность БП</span>
																			<span>
																				{gpu.RecommendedPowerSupply} W
																			</span>
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

export default Gpu;
