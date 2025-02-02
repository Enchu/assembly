import React, { useEffect, useState } from 'react';
import {
	Disclosure,
	DisclosureContent,
	DisclosureTrigger,
} from '@/components/core/disclosure';
import {
	ArrowDownFromLine,
	ChevronsDownUp,
	Plus,
	RefreshCw,
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
import { Autocomplete, Pagination, TextField } from '@mui/material';
import { Separator } from '@radix-ui/react-separator';
import { GPUItem } from '@/interface/GPU';
import PriceDialog from '@/components/modules/PriceDialog/PriceDialog';
import { useGPUApiStore, useGPUStore } from '@/store/gpuStore';
import { fetchGPUs } from '@/context/gpuService';
import Skeleton from '@/components/modules/Skelet/Skeleton';
import toast from 'react-hot-toast';

const Gpu = () => {
	const { gpus, isLoading } = useGPUApiStore();

	useEffect(() => {
		fetchGPUs();
	}, []);

	const [uniqueMemories, setUniqueMemories] = useState<string[]>([]);
	const [minPriceRange, setMinPriceRange] = useState<number>(0);
	const [maxPriceRange, setMaxPriceRange] = useState<number>(0);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);
	const [selectedMemory, setSelectedMemory] = useState<string[]>([]);
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>(0);

	useEffect(() => {
		if (!isLoading && gpus.length > 0) {
			const memories = Array.from(new Set(gpus.map(item => item.Memory))).sort(
				(a, b) => Number(b) - Number(a),
			);
			setUniqueMemories(memories);

			const minPriceRange = Math.min(
				...gpus.map(item => parseInt(item.price, 10)),
			);
			const maxPriceRange = Math.max(
				...gpus.map(item => parseInt(item.price, 10)),
			);

			setMinPriceRange(minPriceRange);
			setMaxPriceRange(maxPriceRange);
			setRange([minPriceRange, maxPriceRange]);
			setMinPrice(minPriceRange);
			setMaxPrice(maxPriceRange);
		}
	}, [gpus, isLoading]);

	const { gpu, setGPU, resetGPU } = useGPUStore();

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);

	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [isPerformanceChecked, setIsPerformanceChecked] = useState(false);
	const [selectedGPU, setSelectedGPU] = useState<GPUItem | null>(null);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// FILTERED
	const filteredGpuItems = gpus
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

			const matchesPerformance =
				!isPerformanceChecked || parseFloat(gpu.Performance) / gpuPrice >= 1;

			return (
				matchesManufacturer &&
				matchesSelectedGPU &&
				matchesPriceRange &&
				matchesMemory &&
				matchesPerformance
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
		toast.success('Успешно изменена видеокарта');
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		resetGPU();
		setSelectedGPU(null);
		toast.success('Успешно очищена видеокарта');
	};

	const handleManufacture = (manufacturer: 'NVIDIA' | 'AMD') => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer)
				? prev.filter((item: string) => item !== manufacturer)
				: [...prev, manufacturer],
		);
	};

	const handlePerformanceCheck = () => {
		setIsPerformanceChecked(prev => !prev);
	};

	// Добавляем состояние для пагинации
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10); // Количество элементов на странице

	// Обработчик изменения страницы
	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setCurrentPage(value);
	};

	// Получаем элементы для текущей страницы
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredGpuItems.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);

	const clearAllFilters = () => {
		setSelectedManufacturer([]);
		setSelectedMemory([]);
		setSelectedGPU(null);
		setRange([minPriceRange, maxPriceRange]);
		setMinPrice(minPriceRange);
		setMaxPrice(maxPriceRange);
		setCurrentPage(1);
	};

	return (
		<section>
			{isLoading ? (
				<Skeleton />
			) : (
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
											options={gpus.map((gpu: GPUItem) => {
												return gpu.name;
											})}
											onChange={(event, value) => {
												const selected = gpus.find(gpu => gpu.name === value);
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
												<div
													className={`${selectedManufacturer.length > 0 ? '!bg-green-400 !text-white' : 'bg-transparent text-zinc-900'} border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2`}
												>
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
												<div
													className={`${selectedMemory.length > 0 ? '!bg-green-400 !text-white' : 'bg-transparent text-zinc-900'} border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2`}
												>
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

										<div className="flex text-center items-center">
											<Checkbox
												checked={isPerformanceChecked}
												onClick={handlePerformanceCheck}
											/>
											<span>Производительность за цену</span>
										</div>

										<button
											onClick={clearAllFilters}
											className="border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2 hover:bg-red-50"
										>
											<RefreshCw className="h-5 w-5" />
											<span>Сбросить фильтры</span>
										</button>
									</div>

									{/*Title*/}
									{filteredGpuItems.length === 0 ? (
										<></>
									) : (
										<div
											className="grid w-full text-base gap-2 mt-4 bg-amber-100 items-center justify-center cursor-default"
											style={{
												gridTemplateColumns:
													'0.3fr 2.3fr 1fr 0.6fr 0.8fr 0.7fr 0.5fr 1fr',
											}}
										>
											<div className="">
												<div className="Icon" />
												<span>Изображение</span>
											</div>

											<div className="">
												<div className="Icon" />
												<span>Название</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Объем памяти</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Тип памяти</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Score</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>TDP</span>
											</div>

											<div
												className="flex justify-center cursor-pointer"
												onClick={toggleSortOrder}
											>
												<ChevronsDownUp className="" />
												<span>Цена</span>
											</div>

											<div className="text-center mr-14">
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
											{currentItems.map(gpuItem => (
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
															<div
																className="w-full h-full grid p-2 items-center gap-4"
																style={{
																	gridTemplateColumns: `0.3fr 3fr 1.2fr 0.7fr 1fr 0.8fr 0.6fr 1fr`,
																}}
															>
																<DialogImage
																	src={`${gpuItem.img}`}
																	alt="Gpu"
																	className="h-8 w-8 object-cover object-top"
																/>
																<div className="text-left">{gpuItem.name}</div>
																<div className="text-center">
																	{gpuItem.Memory}
																</div>
																<div className="text-center">
																	{gpuItem.MemoryType}
																</div>
																<div className="text-center">
																	{gpuItem.score} 0
																</div>
																<div className="text-center">
																	{gpuItem.TDP} ВТ
																</div>
																<div className="text-center text-red-600">
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
																		className={
																			'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
																		}
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
																			src={`${gpuItem.img}`}
																			alt="Gpu"
																			className="h-auto w-[400px]"
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
																						className={`border border-zinc-950/10 rounded-3xl px-14 py-2 inline-flex bg-[#94B90A] text-white item-center text-center gap-4 justify-center items-center`}
																						onClick={e => {
																							handleGPUChange(e, gpuItem);
																						}}
																					>
																						<Plus />|<a>Выбрать</a>
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
																				<span>
																					{gpuItem.Performance} TFLOPs
																				</span>
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
											<Pagination
												count={Math.ceil(
													filteredGpuItems.length / itemsPerPage,
												)}
												page={currentPage}
												onChange={handlePageChange}
												shape="rounded"
												size={'large'}
												className={'flex justify-center mt-4'}
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</DisclosureContent>
				</Disclosure>
			)}
		</section>
	);
};

export default Gpu;
