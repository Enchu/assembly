import React, { useState } from 'react';
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
import items from '@/data/data.json';
import { Autocomplete, TextField } from '@mui/material';
import PriceDialog from '@/components/modules/PriceDialog/PriceDialog';
import { Separator } from '@radix-ui/react-separator';
import { MotherboardItems } from '@/interface/Motherboard';
import { useMotherboardStore } from '@/store/store';

const Motherboard = () => {
	const motherboardItems: MotherboardItems[] = items[0].motherboard;

	const minPriceRange = Math.min(
		...motherboardItems.map(item => parseInt(item.price, 10)),
	);
	const maxPriceRange = Math.max(
		...motherboardItems.map(item => parseInt(item.price, 10)),
	);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);

	const [minPrice, setMinPrice] = useState<number>(minPriceRange);
	const [maxPrice, setMaxPrice] = useState<number>(maxPriceRange);

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);
	const { motherboard, setMotherboard } = useMotherboardStore();
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [motherboardCPU, setMotherboardCPU] = useState<MotherboardItems | null>(
		null,
	);

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// FILTERED
	const filteredMotherboardItems = motherboardItems
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

			// Проверяем, попадает ли цена в диапазон
			const cpuPrice = parseFloat(motherboard.price); // Преобразуем цену в число
			const matchesPriceRange = cpuPrice >= range[0] && cpuPrice <= range[1];

			return (
				matchesManufacturer && matchesSelectedMotherboard && matchesPriceRange
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
		setIsOpenDisclosure(false);
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		setMotherboard(null);
		setMotherboardCPU(null);
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
		<>
			<Disclosure
				className={`w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700 mb-5 ${motherboard !== null ? 'bg-green-600' : ''}`}
				open={isOpenDisclosure}
			>
				<DisclosureTrigger>
					{motherboard !== null ? (
						<div
							className="px-5 py-3 flex justify-between items-center relative"
							onClick={() => handleDialogClose()}
						>
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Материнская плата
							</div>
							<div>{motherboard.name}</div>
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
								Материнская плата
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
											<TextField {...params} label="Motheboard" />
										)}
										options={motherboardItems.map(
											(motherboard: MotherboardItems) => {
												return motherboard.name;
											},
										)}
										onChange={(event, value) => {
											const selected = motherboardItems.find(
												cpu => cpu.name === value,
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
																checked={selectedManufacturer.includes('MSI')}
																onClick={() => handleManufacture('MSI')}
															/>
															<span>MSI</span>
														</div>
														<div className="flex text-center items-center">
															<Checkbox
																checked={selectedManufacturer.includes('ASUS')}
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
									<>
										<div className="font-bold text-2xl text-center m-10">
											<p>Нет доступных материнских плат для отображения.</p>
										</div>
									</>
								) : (
									<div className="flex w-full text-base gap-4 mt-4 bg-amber-100 items-center justify-center cursor-default">
										<div className="ml-2">
											<div className="Icon" />
											<span>Изображение</span>
										</div>

										<div className="w-[38%] text-left">
											<div className="Icon" />
											<span>Название</span>
										</div>

										<div className="w-20 text-center">
											<div className="Icon" />
											<span>Сокет</span>
										</div>

										<div className="">
											<div className="Icon" />
											<span>Тип памяти</span>
										</div>

										<div className="w-24 text-center">
											<div className="Icon" />
											<span>Чипсет</span>
										</div>

										<div className="">
											<div className="Icon" />
											<span>Макс памяти</span>
										</div>

										<div
											className="flex ml-4 cursor-pointer"
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
								{filteredMotherboardItems.length === 0 ? (
									<div className={'font-bold text-2xl text-center m-10'}>
										<p>Нет доступных процессоров для отображения.</p>
									</div>
								) : (
									<div>
										{filteredMotherboardItems.map(
											(motherboard: MotherboardItems) => (
												<Dialog
													transition={{
														type: 'spring',
														stiffness: 200,
														damping: 24,
													}}
													key={motherboard.id}
												>
													<DialogTrigger
														style={{ borderRadius: '4px' }}
														className="border border-gray-200/60 bg-white mb-1 mt-1 w-full flex items-center space-x-3"
													>
														<div className="w-full flex flex-col items-center justify-center gap-1 space-y-0">
															<div className="w-full items-center">
																<>
																	<div className="bg-white">
																		<div className="w-full h-full flex p-2 items-center gap-4">
																			<DialogImage
																				src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																				alt="What I Talk About When I Talk About Running - book cover"
																				className="h-8 w-8 object-cover object-top mr-2"
																				style={{ borderRadius: '4px' }}
																			/>
																			<div className="w-[42%] text-left">
																				{motherboard.name}
																			</div>
																			<div className="w-24 text-center">
																				{motherboard.socket}
																			</div>
																			<div className="w-24 text-center">
																				{motherboard.memoryType}
																			</div>
																			<div className="w-24 text-center">
																				{motherboard.chipset}
																			</div>
																			<div className="w-24 text-center">
																				{motherboard.maxMemory}
																			</div>
																			<div className="w-24 text-center">
																				{motherboard.price}₽
																			</div>
																			<button
																				className={`ml-auto mr-4 border border-zinc-950/10 
																	rounded-3xl px-5 py-2 inline-flex cursor-pointer 
																	hover:bg-gray-900 hover:text-white items-center`}
																				onClick={e => {
																					handleMotherboardChange(
																						e,
																						motherboard,
																					);
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
																			{motherboard.name}
																		</DialogTitle>
																		<DialogSubtitle>
																			<div className="flex justify-between text-center items-center my-3">
																				<div className="text-4xl text-[#F2530C]">
																					{motherboard.price}
																				</div>
																				<button
																					className={
																						'border border-zinc-950/10 rounded-3xl px-14 py-2' +
																						' inline-flex bg-[#94B90A] text-white item-center text-center'
																					}
																					onClick={e => {
																						handleMotherboardChange(
																							e,
																							motherboard,
																						);
																					}}
																				>
																					<Plus /> | Выбрать
																				</button>
																			</div>
																		</DialogSubtitle>
																		<div className="mt-2 text-base text-gray-700">
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Производитель</span>
																				<span>{motherboard.manufacturer}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Сокет</span>
																				<span>{motherboard.socket}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Чипсет</span>
																				<span>{motherboard.chipset}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Форм-фактор</span>
																				<span>{motherboard.formFactor}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Максимальный объём памяти</span>
																				<span>{motherboard.maxMemory}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Тип памяти</span>
																				<span>{motherboard.memoryType}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Слоты памяти</span>
																				<span>{motherboard.memorySlots}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Установленная память (RAM)</span>
																				<span>{motherboard.ram} GB</span>
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
		</>
	);
};

export default Motherboard;
