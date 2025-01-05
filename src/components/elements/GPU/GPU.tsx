import React, { useEffect, useState } from 'react';
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
import { GPUItem } from '@/interface/GPU';
import { useGPUStore } from '@/store/store';
import PriceDialog from '@/components/modules/PriceDialog/PriceDialog';

const Gpu = () => {
	const gpuItems: GPUItem[] = items[0].gpu;

	const uniqueMemories = Array.from(new Set(gpuItems.map(item => item.Memory)));
	const [selectedMemory, setSelectedMemory] = useState<string[]>([]);

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
	const { gpu, setGPU } = useGPUStore();
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [selectedGPU, setSelectedGPU] = useState<GPUItem | null>(null);

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// FILTERED
	const filteredGpuItems = gpuItems
		.filter(gpu => {
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

			const matchesMemory =
				selectedMemory.length > 0 ? selectedMemory.includes(gpu.Memory) : true;

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
		value: GPUItem,
	) => {
		event.stopPropagation();
		setGPU(value);
		setIsOpenDisclosure(false);
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		setGPU(null);
		setSelectedGPU(null);
	};

	const handleManufacture = (manufacturer: 'NVIDIA' | 'AMD') => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer)
				? prev.filter((item: string) => item !== manufacturer)
				: [...prev, manufacturer],
		);
	};

	useEffect(() => {
		localStorage.setItem('gpu', JSON.stringify(gpu));
	}, [gpu]);

	return (
		<section>
			<Disclosure
				className={`w-full rounded-md border border-zinc-200 dark:border-zinc-700 mb-5 ${gpu !== null ? 'bg-green-400' : ''}`}
				open={isOpenDisclosure}
			>
				<DisclosureTrigger className={'px-3'}>
					{gpu !== null ? (
						<div className="px-5 py-3 flex justify-between items-center relative">
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Видеокарта
							</div>
							<div className="text-xl">{gpu.name}</div>
							<div className="flex">
								<button
									className={
										'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
									}
									onClick={() => handleDialogClose()}
								>
									<RefreshCw className="mr-2 h-4 w-4" />
									<span>| Заменить</span>
								</button>
							</div>
						</div>
					) : (
						<div className="px-5 py-3 flex justify-between items-center relative">
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Видеокарта
							</div>
							<div className="flex">
								<button
									className={
										'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
									}
									onClick={() => setIsOpenDisclosure(!isOpenDisclosure)}
								>
									<Plus className="mr-1 h-4 w-4" /> <span>| Добавить</span>
								</button>
							</div>
						</div>
					)}
				</DisclosureTrigger>
				<DisclosureContent className={`${gpu !== null ? 'bg-white' : ''}`}>
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
											<TextField {...params} label="GPU" />
										)}
										options={gpuItems.map((gpu: GPUItem) => {
											return gpu.name;
										})}
										onChange={(event, value) => {
											const selected = gpuItems.find(gpu => gpu.name === value);
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
														<div className="flex text-center items-center">
															<Checkbox
																checked={selectedManufacturer.includes(
																	'NVIDIA',
																)}
																onClick={() => handleManufacture('NVIDIA')}
															/>
															<span>NVIDIA</span>
														</div>
														<div className="flex text-center items-center">
															<Checkbox
																checked={selectedManufacturer.includes('AMD')}
																onClick={() => handleManufacture('AMD')}
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
								{filteredGpuItems.length === 0 ? (
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
											<span>Score</span>
										</div>

										<div className="flex">
											<div className="Icon" />
											<span>Мощность БП</span>
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
								{filteredGpuItems.length === 0 ? (
									<div className={'font-bold text-2xl text-center m-10'}>
										<p>Нет доступных видеокарт для отображения.</p>
									</div>
								) : (
									<div>
										{filteredGpuItems.map((gpuItem: GPUItem) => (
											<Dialog
												transition={{
													type: 'spring',
													stiffness: 200,
													damping: 24,
												}}
												key={gpuItem.id}
											>
												<DialogTrigger
													style={{ borderRadius: '4px' }}
													className={`border border-gray-200/60 bg-white mb-1 mt-1 w-full flex items-center space-x-3`}
												>
													<div
														className={`${gpu && gpuItem.id === gpu.id ? 'bg-green-400' : ''} w-full flex flex-col items-center justify-center gap-1 space-y-0`}
													>
														<div className="w-full h-full flex p-2 items-center gap-4">
															<DialogImage
																src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																alt="What I Talk About When I Talk About Running - book cover"
																className="h-8 w-8 object-cover object-top mr-2"
																style={{ borderRadius: '4px' }}
															/>
															<div className="w-3/6 text-left">
																{gpuItem.name}
															</div>
															<div className="w-14">{gpuItem.Memory}</div>
															<div className="w-14">{gpuItem.TDP}</div>
															<div className="w-20 text-center">
																{gpuItem.RecommendedPowerSupply}
															</div>
															<div className="w-14 text-center">
																{gpuItem.score}
															</div>
															<div className="w-24 text-center text-red-600">
																{gpuItem.price}₽
															</div>
															{gpu && gpuItem.id === gpu.id ? (
																<button
																	className={`ml-auto mr-4 border border-zinc-950/10 
																	rounded-3xl px-5 py-2 inline-flex cursor-pointer bg-gray-100
																	items-center`}
																>
																	Выбранный
																</button>
															) : (
																<button
																	className={`ml-auto mr-4 border border-zinc-950/10 
																	rounded-3xl px-5 py-2 inline-flex cursor-pointer 
																	hover:bg-gray-900 hover:text-white items-center`}
																	onClick={e => {
																		handleGPUChange(e, gpuItem);
																	}}
																>
																	<Plus className="mr-2 h-4 w-4 " /> | Выбрать
																</button>
															)}
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
																		{gpuItem.name}
																	</DialogTitle>
																	<DialogSubtitle>
																		<div className="flex justify-between text-center items-center my-3">
																			<div className="text-4xl text-[#F2530C]">
																				{gpuItem.price}
																			</div>
																			{gpu && gpuItem.id === gpu.id ? (
																				<button
																					className={
																						'border border-zinc-950/10 rounded-3xl px-14 py-2' +
																						' inline-flex bg-[#94B90A] text-white item-center text-center'
																					}
																				>
																					Выбран
																				</button>
																			) : (
																				<button
																					className={
																						'border border-zinc-950/10 rounded-3xl px-14 py-2' +
																						' inline-flex bg-[#94B90A] text-white item-center text-center'
																					}
																					onClick={e => {
																						handleGPUChange(e, gpuItem);
																					}}
																				>
																					<Plus /> | Выбрать
																				</button>
																			)}
																		</div>
																	</DialogSubtitle>
																	<div className="mt-2 text-base text-gray-700">
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Объем памяти</span>
																			<span>{gpuItem.Memory} GB</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Шина памяти</span>
																			<span>{gpuItem.MemoryBus} bit</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Тип памяти</span>
																			<span>{gpuItem.MemoryType}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Частота графического ядра</span>
																			<span>{gpuItem.CoreClock} MHz</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Производительность</span>
																			<span>{gpuItem.Performance}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Интерфейс</span>
																			<span>{gpuItem.Interface}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Разъемы</span>
																			<span>{gpuItem.Connectors}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Рекомендуемая мощность БП</span>
																			<span>
																				{gpuItem.RecommendedPowerSupply} W
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
		</section>
	);
};

export default Gpu;
