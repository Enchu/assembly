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
import { Autocomplete, TextField } from '@mui/material';
import PriceDialog from '@/components/modules/PriceDialog/PriceDialog';
import { Separator } from '@radix-ui/react-separator';
import { MotherboardItems } from '@/interface/Motherboard';
import { useCPUStore } from '@/store/cpuStore';
import {
	useMotherboardApiStore,
	useMotherboardStore,
} from '@/store/motherboardStore';
import { useMemoryStore } from '@/store/ramStore';
import { fetchMotherboards } from '@/context/motherboardService';
import Skeleton from '@/components/modules/Skelet/Skeleton';
import toast from 'react-hot-toast';

const Motherboard = () => {
	const { motherboards, isLoading } = useMotherboardApiStore();

	useEffect(() => {
		fetchMotherboards();
	}, []);

	const [minPriceRange, setMinPriceRange] = useState<number>(0);
	const [maxPriceRange, setMaxPriceRange] = useState<number>(0);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>(0);

	useEffect(() => {
		if (!isLoading && motherboards.length > 0) {
			const minPriceRange = Math.min(
				...motherboards.map(item => parseInt(item.price, 10)),
			);
			const maxPriceRange = Math.max(
				...motherboards.map(item => parseInt(item.price, 10)),
			);

			setMinPriceRange(minPriceRange);
			setMaxPriceRange(maxPriceRange);
			setRange([minPriceRange, maxPriceRange]);
			setMinPrice(minPriceRange);
			setMaxPrice(maxPriceRange);
		}
	}, [motherboards, isLoading]);

	const { motherboard, setMotherboard, resetMotherboard } =
		useMotherboardStore();
	const { cpu } = useCPUStore();
	const { memory } = useMemoryStore();

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [motherboardCPU, setMotherboardCPU] = useState<MotherboardItems | null>(
		null,
	);

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// FILTERED
	const filteredMotherboardItems = motherboards
		.filter(motherboard => {
			// Фильтруем по производителю
			const matchesManufacturer =
				selectedManufacturer.length > 0
					? selectedManufacturer.includes(motherboard.manufacturer)
					: true;

			// Если выбран конкретный Motherboard, показываем только его
			const matchesSelectedMotherboard = motherboardCPU
				? motherboard.name === motherboardCPU.name
				: true;

			// Если выбран CPU проверяем его совподает ли он с socket motherboard
			const cpuSocketMotherboard =
				cpu !== null ? motherboard.socket === cpu.socket : true;

			const memoryTypeMotherboard =
				memory !== null ? motherboard.memoryType === memory.Type : true;

			// Проверяем, попадает ли цена в диапазон
			const cpuPrice = parseFloat(motherboard.price); // Преобразуем цену в число
			const matchesPriceRange = cpuPrice >= range[0] && cpuPrice <= range[1];

			return (
				matchesManufacturer &&
				matchesSelectedMotherboard &&
				cpuSocketMotherboard &&
				memoryTypeMotherboard &&
				matchesPriceRange
			);
		})
		.sort((a, b) => {
			const priceA = parseFloat(a.price);
			const priceB = parseFloat(b.price);
			return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
		});

	const toggleSortOrder = () => {
		setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
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

	const handleMotherboardChange = (
		event: React.ChangeEvent<unknown>,
		value: MotherboardItems,
	) => {
		event.stopPropagation();
		setMotherboard(value);
		setIsOpenDisclosure(!isOpenDisclosure);
		toast.success('Успешно изменена материнская плата');
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		resetMotherboard();
		setMotherboardCPU(null);
		toast.success('Успешно очищена материнская плата');
	};

	const handleManufacture = (
		manufacturer: 'MSI' | 'ASRock' | 'ASUS' | 'GIGABYTE',
	) => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer)
				? prev.filter((item: string) => item !== manufacturer)
				: [...prev, manufacturer],
		);
	};

	return (
		<section>
			{isLoading ? (
				<Skeleton />
			) : (
				<Disclosure
					className={`w-full rounded-md border border-zinc-200 dark:border-zinc-700 mb-5 ${motherboard !== null ? 'bg-green-400' : ''}`}
					open={isOpenDisclosure}
				>
					<DisclosureTrigger className={'px-3'}>
						{motherboard !== null ? (
							<div className="px-5 py-3 flex justify-between items-center relative">
								<div className="text-lg leading-none m-0 font-semibold relative pr-4">
									Материнская плата
								</div>
								<div className="text-xl">{motherboard.name}</div>
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
									Материнская плата
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
					<DisclosureContent
						className={`${motherboard !== null ? 'bg-white' : ''}`}
					>
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
												<TextField {...params} label="Motheboard" />
											)}
											options={motherboards.map(
												(motherboard: MotherboardItems) => {
													return motherboard.name;
												},
											)}
											onChange={(event, value) => {
												const selected = motherboards.find(
													motherboards => motherboards.name === value,
												);
												setMotherboardCPU(selected || null);
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
																	checked={selectedManufacturer.includes('MSI')}
																	onClick={() => handleManufacture('MSI')}
																/>
																<span>MSI</span>
															</div>
															<div className="flex text-center items-center">
																<Checkbox
																	checked={selectedManufacturer.includes(
																		'ASUS',
																	)}
																	onClick={() => handleManufacture('ASUS')}
																/>
																<span>ASUS</span>
															</div>
															<div className="flex text-center items-center">
																<Checkbox
																	checked={selectedManufacturer.includes(
																		'GIGABYTE',
																	)}
																	onClick={() => handleManufacture('GIGABYTE')}
																/>
																<span>GIGABYTE</span>
															</div>
															<div className="flex text-center items-center">
																<Checkbox
																	checked={selectedManufacturer.includes(
																		'ASRock',
																	)}
																	onClick={() => handleManufacture('ASRock')}
																/>
																<span>ASRock</span>
															</div>
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
												<span>Количество ядер</span>
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
														Количество ядер
													</DialogTitle>
													<div className="p-2" />
													<div className="relative flex flex-col p-2 w-full">
														{uniqueCores.map(cores => (
															<div
																key={cores}
																className="flex text-center items-center"
															>
																<Checkbox
																	checked={selectedCores.includes(cores)}
																	onChange={() => handleCoresChange(cores)}
																/>
																<span>{cores}</span>
															</div>
														))}
													</div>
												</div>
												<DialogClose className="text-zinc-950 " />
											</DialogContent>
										</DialogContainer>
									</Dialog>*/}

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
														{uniqueThreads.map(threads => (
															<div
																key={threads}
																className="flex text-center items-center"
															>
																<Checkbox
																	checked={selectedThreads.includes(threads)}
																	onChange={() => handleThreadsChange(threads)}
																/>
																<span>{threads}</span>
															</div>
														))}
													</div>
												</div>
												<DialogClose className="text-zinc-950 " />
											</DialogContent>
										</DialogContainer>
									</Dialog>*/}
									</div>

									{/*Title*/}
									{filteredMotherboardItems.length === 0 ? (
										<div className="font-bold text-2xl text-center m-10">
											<p>Нет доступных материнских плат для отображения.</p>
										</div>
									) : (
										<div
											className="grid w-full text-base gap-4 mt-4 bg-amber-100 items-center justify-center cursor-default"
											style={{
												gridTemplateColumns:
													'0.3fr 2.3fr 1fr 0.6fr 0.8fr 0.7fr 0.5fr 1fr',
											}}
										>
											<div className="ml-2">
												<div className="Icon" />
												<span>Изображение</span>
											</div>

											<div className="text-left">
												<div className="Icon" />
												<span>Название</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Сокет</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Тип памяти</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Чипсет</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Макс памяти</span>
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
									{filteredMotherboardItems.length === 0 ? (
										<div className={'font-bold text-2xl text-center m-10'}>
											<p>С данным процессором нету материнских плат</p>
										</div>
									) : (
										<div>
											{filteredMotherboardItems.map(
												(motherboardItem: MotherboardItems) => (
													<Dialog
														transition={{
															type: 'spring',
															stiffness: 200,
															damping: 24,
														}}
														key={motherboardItem.id}
													>
														<DialogTrigger
															style={{ borderRadius: '4px' }}
															className="border border-gray-200/60 bg-white mb-1 mt-1 w-full flex items-center space-x-3"
														>
															<div
																className={`${motherboard && motherboardItem.id === motherboard.id ? 'bg-green-400' : ''} w-full flex flex-col items-center justify-center gap-1 space-y-0`}
															>
																<div
																	className="w-full h-full grid p-2 items-center gap-4"
																	style={{
																		gridTemplateColumns: `0.3fr 3fr 1.2fr 0.7fr 1fr 0.8fr 0.6fr 1fr`,
																	}}
																>
																	<DialogImage
																		src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																		alt="What I Talk About When I Talk About Running - book cover"
																		className="h-8 w-8 object-cover object-top mr-2"
																		style={{ borderRadius: '4px' }}
																	/>
																	<div className="text-left">
																		{motherboardItem.name}
																	</div>
																	<div className="text-center">
																		{motherboardItem.socket}
																	</div>
																	<div className="text-center">
																		{motherboardItem.memoryType}
																	</div>
																	<div className="text-center">
																		{motherboardItem.chipset}
																	</div>
																	<div className="text-center">
																		{motherboardItem.maxMemory}
																	</div>
																	<div className="text-center text-red-600">
																		{motherboardItem.price}₽
																	</div>
																	{motherboard &&
																	motherboardItem.id === motherboard.id ? (
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
																	hover:bg-gray-900 hover:text-white items-center justify-center`}
																			onClick={e => {
																				handleMotherboardChange(
																					e,
																					motherboardItem,
																				);
																			}}
																		>
																			<Plus className="mr-2 h-4 w-4" />
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
																				src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																				alt="What I Talk About When I Talk About Running - book cover"
																				className="h-auto w-[200px]"
																			/>
																		</div>
																		<div className="">
																			<DialogTitle className="text-black text-2xl font-bold">
																				{motherboardItem.name}
																			</DialogTitle>
																			<DialogSubtitle>
																				<div className="flex justify-between text-center items-center my-3">
																					<div className="text-4xl text-[#F2530C]">
																						{motherboardItem.price}
																					</div>
																					{motherboard &&
																					motherboardItem.id ===
																						motherboard.id ? (
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
																								handleMotherboardChange(
																									e,
																									motherboardItem,
																								);
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
																					<span>
																						{motherboardItem.manufacturer}
																					</span>
																				</div>

																				<Separator className="my-2 bg-gray-300 h-[1px]" />
																				<div className="flex justify-between ml-2 mr-2">
																					<span>Сокет</span>
																					<span>{motherboardItem.socket}</span>
																				</div>

																				<Separator className="my-2 bg-gray-300 h-[1px]" />
																				<div className="flex justify-between ml-2 mr-2">
																					<span>Чипсет</span>
																					<span>{motherboardItem.chipset}</span>
																				</div>

																				<Separator className="my-2 bg-gray-300 h-[1px]" />
																				<div className="flex justify-between ml-2 mr-2">
																					<span>Форм-фактор</span>
																					<span>
																						{motherboardItem.formFactor}
																					</span>
																				</div>

																				<Separator className="my-2 bg-gray-300 h-[1px]" />
																				<div className="flex justify-between ml-2 mr-2">
																					<span>Максимальный объём памяти</span>
																					<span>
																						{motherboardItem.maxMemory}
																					</span>
																				</div>

																				<Separator className="my-2 bg-gray-300 h-[1px]" />
																				<div className="flex justify-between ml-2 mr-2">
																					<span>Тип памяти</span>
																					<span>
																						{motherboardItem.memoryType}
																					</span>
																				</div>

																				<Separator className="my-2 bg-gray-300 h-[1px]" />
																				<div className="flex justify-between ml-2 mr-2">
																					<span>Слоты памяти</span>
																					<span>
																						{motherboardItem.memorySlots}
																					</span>
																				</div>

																				<Separator className="my-2 bg-gray-300 h-[1px]" />
																				<div className="flex justify-between ml-2 mr-2">
																					<span>
																						Установленная память (RAM)
																					</span>
																					<span>{motherboardItem.ram} GB</span>
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
												),
											)}
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

export default Motherboard;
