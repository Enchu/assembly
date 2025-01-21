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
import PriceDialog from '@/components/modules/PriceDialog/PriceDialog';
import { RAMItem } from '@/interface/Ram';
import { useMemoryStore, useRAMApiStore } from '@/store/ramStore';
import { useMotherboardStore } from '@/store/motherboardStore';
import { fetchRAMs } from '@/context/ramService';
import Skeleton from '@/components/modules/Skelet/Skeleton';
import toast from 'react-hot-toast';

const MemoryModules = () => {
	const { rams, isLoading } = useRAMApiStore();

	useEffect(() => {
		fetchRAMs();
	}, []);

	const [uniqueMemories, setUniqueMemories] = useState<string[]>([]);
	const [uniqueManufacturers, setUniqueManufacturers] = useState<string[]>([]);
	const [minPriceRange, setMinPriceRange] = useState<number>(0);
	const [maxPriceRange, setMaxPriceRange] = useState<number>(0);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>(0);

	useEffect(() => {
		if (!isLoading && rams.length > 0) {
			const uniqueMemories = Array.from(
				new Set(rams.map(item => item.Capacity)),
			).sort((a, b) => {
				return Number(b) - Number(a);
			});
			setUniqueMemories(uniqueMemories);

			const uniqueManufacturers = Array.from(
				new Set(rams.map(item => item.Manufacturer)),
			);
			setUniqueManufacturers(uniqueManufacturers);

			const minPriceRange = Math.min(
				...rams.map(item => parseInt(item.price, 10)),
			);
			const maxPriceRange = Math.max(
				...rams.map(item => parseInt(item.price, 10)),
			);

			setMinPriceRange(minPriceRange);
			setMaxPriceRange(maxPriceRange);
			setRange([minPriceRange, maxPriceRange]);
			setMinPrice(minPriceRange);
			setMaxPrice(maxPriceRange);
		}
	}, [rams, isLoading]);

	const { memory, setMemory, resetMemory } = useMemoryStore();
	const { motherboard } = useMotherboardStore();

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);

	const [selectedMemory, setSelectedMemory] = useState<string[]>([]);
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [selectedGPU, setSelectedGPU] = useState<RAMItem | null>(null);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// FILTERED
	const filteredRamItems = rams
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

			const motherboardTypeMemory =
				motherboard !== null ? motherboard.memoryType === memory.Type : true;

			return (
				matchesManufacturer &&
				matchesSelectedGPU &&
				matchesPriceRange &&
				motherboardTypeMemory &&
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
		toast.success('Успешно изменены модули памяти');
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		resetMemory();
		setSelectedGPU(null);
		toast.success('Успешно очищены модули памяти');
	};

	const handleManufacture = (manufacturer: string) => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer)
				? prev.filter((item: string) => item !== manufacturer)
				: [...prev, manufacturer],
		);
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
	const currentItems = filteredRamItems.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);

	const clearAllFilters = () => {
		setSelectedManufacturer([]);
		setSelectedGPU(null);
		setSelectedMemory([]);
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
					className={`w-full rounded-md border border-zinc-200 dark:border-zinc-700 mb-5 ${memory !== null ? 'bg-green-400' : ''}`}
					open={isOpenDisclosure}
				>
					<DisclosureTrigger className={'px-3'}>
						{memory !== null ? (
							<div className="px-5 py-3 flex justify-between items-center relative">
								<div className="text-lg leading-none m-0 font-semibold relative pr-4">
									Модули памяти
								</div>
								<div className="text-xl">{memory.name}</div>
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
									Модули памяти
								</div>
								<div className="flex">
									<button
										className={
											'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
										}
										onClick={() => setIsOpenDisclosure(!isOpenDisclosure)}
									>
										<Plus className="mr-1 h-4 w-4" />
										<span>| Добавить</span>
									</button>
								</div>
							</div>
						)}
					</DisclosureTrigger>
					<DisclosureContent className={`${memory !== null ? 'bg-white' : ''}`}>
						<div className="overflow-hidden pb-3 px-3">
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
											options={rams.map((gpu: RAMItem) => {
												return gpu.name;
											})}
											onChange={(event, value) => {
												const selected = rams.find(gpu => gpu.name === value);
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
												<div
													className={`${
														selectedMemory.length > 0
															? '!bg-green-400 !text-white'
															: 'bg-transparent text-zinc-900'
													} border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2`}
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

										<button
											onClick={clearAllFilters}
											className="border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2 hover:bg-red-50"
										>
											<RefreshCw className="h-5 w-5" />
											<span>Сбросить фильтры</span>
										</button>
									</div>

									{/*Title*/}
									{filteredRamItems.length === 0 ? (
										<></>
									) : (
										<div
											className="grid w-full text-base gap-2 mt-4 bg-amber-100 items-center justify-center cursor-default"
											style={{
												gridTemplateColumns:
													'0.3fr 2.8fr 1fr 0.6fr 0.7fr 0.8fr 0.5fr 1fr',
											}}
										>
											<div className="ml-2">
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
												<span>Скорость</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Тип</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Модули</span>
											</div>

											<div
												className="flex justify-center cursor-pointer"
												onClick={toggleSortOrder}
											>
												<ChevronsDownUp className="" />
												<span>Цена</span>
											</div>

											<div className="text-center">
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
											{currentItems.map(memoryItem => (
												<Dialog
													transition={{
														type: 'spring',
														stiffness: 200,
														damping: 24,
													}}
													key={memoryItem.id}
												>
													<DialogTrigger
														style={{ borderRadius: '4px' }}
														className="border border-gray-200/60 bg-white mb-1 mt-1 w-full flex items-center space-x-3"
													>
														<div
															className={`${memory && memoryItem.id === memory.id ? 'bg-green-400' : ''} w-full flex flex-col items-center justify-center gap-1 space-y-0`}
														>
															<div
																className="w-full h-full grid p-2 items-center gap-4"
																style={{
																	gridTemplateColumns: `0.3fr 3.3fr 1fr 0.6fr 0.8fr 0.7fr 0.5fr 1fr`,
																}}
															>
																<DialogImage
																	src={`${memoryItem.img}`}
																	alt="Memory module"
																	className="h-8 w-8 object-cover object-top"
																/>
																<div className="text-left">
																	{memoryItem.name}
																</div>
																<div className="text-center">
																	{memoryItem.Capacity}
																</div>
																<div className="text-center">
																	{memoryItem.Speed}
																</div>
																<div className="text-center">
																	{memoryItem.Type}
																</div>
																<div className="text-center">
																	{memoryItem.Modules}
																</div>
																<div className="text-center text-red-600">
																	{memoryItem.price}₽
																</div>
																{memory && memoryItem.id === memory.id ? (
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
																			handleGPUChange(e, memoryItem);
																		}}
																	>
																		<Plus className="mr-2 h-4 w-4 " />
																		<a>| Выбрать</a>
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
																			src={`${memoryItem.img}`}
																			alt="Memory module"
																			className="h-auto w-[400px]"
																		/>
																	</div>
																	<div className="">
																		<DialogTitle className="text-black text-2xl font-bold">
																			{memoryItem.name}
																		</DialogTitle>
																		<DialogSubtitle>
																			<div className="flex justify-between text-center items-center my-3">
																				<div className="text-4xl text-[#F2530C]">
																					{memoryItem.price}
																				</div>
																				{memory &&
																				memoryItem.id === memory.id ? (
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
																							handleGPUChange(e, memoryItem);
																						}}
																					>
																						<Plus />|<a>Выбрать</a>
																					</button>
																				)}
																			</div>
																		</DialogSubtitle>
																		<div className="mt-2 text-base text-gray-700">
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Производитель</span>
																				<span>{memoryItem.Manufacturer}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Объем памяти</span>
																				<span>{memoryItem.Capacity}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Частота</span>
																				<span>{memoryItem.Speed}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Тип</span>
																				<span>{memoryItem.Type}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Латентность</span>
																				<span>{memoryItem.Latency}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Напряжение</span>
																				<span>{memoryItem.Voltage}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Модули</span>
																				<span>{memoryItem.Modules}</span>
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
													filteredRamItems.length / itemsPerPage,
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

export default MemoryModules;
