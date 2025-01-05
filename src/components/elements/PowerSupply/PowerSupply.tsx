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
import { useGPUStore, usePowerSupplyStore } from '@/store/store';
import PriceDialog from '@/components/modules/PriceDialog/PriceDialog';
import { PowerSupplyT } from '@/interface/PowerSupply';

const PowerSupply = () => {
	const powerSupplyTS: PowerSupplyT[] = items[0].power_supply;

	const uniquePower = Array.from(
		new Set(powerSupplyTS.map(item => item.Power)),
	).sort((a, b) => {
		return Number(b) - Number(a);
	});
	const [selectedPower, setSelectedPower] = useState<string[]>([]);

	const uniqueManufacturers = Array.from(
		new Set(powerSupplyTS.map(item => item.Manufacturer)),
	);

	const minPriceRange = Math.min(
		...powerSupplyTS.map(item => parseInt(item.price, 10)),
	);
	const maxPriceRange = Math.max(
		...powerSupplyTS.map(item => parseInt(item.price, 10)),
	);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);

	const [minPrice, setMinPrice] = useState<number>(minPriceRange);
	const [maxPrice, setMaxPrice] = useState<number>(maxPriceRange);

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);
	const { powerSupply, setPowerSupply } = usePowerSupplyStore();
	const { gpu } = useGPUStore();
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
		[],
	);
	const [selectedPowerS, setSelectedPowerS] = useState<PowerSupplyT | null>(
		null,
	);

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// FILTERED
	const filteredRamItems = powerSupplyTS
		.filter(powerSypply => {
			// Фильтруем по производителю
			const matchesManufacturer =
				selectedManufacturer.length > 0
					? selectedManufacturer.includes(powerSypply.Manufacturer)
					: true;

			// Если выбран GPU, показываем только его
			const matchesSelectedGPU = selectedPowerS
				? powerSypply.name === selectedPowerS.name
				: true;

			const gpuPowerRecomended =
				gpu !== null ? gpu.RecommendedPowerSupply === powerSypply.Power : true;

			// Проверяем, попадает ли цена в диапазон
			const gpuPrice = parseFloat(powerSypply.price); // Преобразуем цену в число
			const matchesPriceRange = gpuPrice >= range[0] && gpuPrice <= range[1];

			const matchesMemory =
				selectedPower.length > 0
					? selectedPower.includes(powerSypply.Power)
					: true;

			return (
				matchesManufacturer &&
				matchesSelectedGPU &&
				matchesPriceRange &&
				gpuPowerRecomended &&
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
		setSelectedPower(prev =>
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
		value: PowerSupplyT,
	) => {
		event.stopPropagation();
		setPowerSupply(value);
		setIsOpenDisclosure(false);
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		setPowerSupply(null);
		setSelectedPowerS(null);
	};

	const handleManufacture = (manufacturer: string) => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer)
				? prev.filter((item: string) => item !== manufacturer)
				: [...prev, manufacturer],
		);
	};

	useEffect(() => {
		localStorage.setItem('powerSupply', JSON.stringify(powerSupply));
	}, [powerSupply]);

	return (
		<section>
			<Disclosure
				className={`w-full rounded-md border border-zinc-200 dark:border-zinc-700 mb-5 ${powerSupply !== null ? 'bg-green-400' : ''}`}
				open={isOpenDisclosure}
			>
				<DisclosureTrigger className={'px-3'}>
					{powerSupply !== null ? (
						<div className="px-5 py-3 flex justify-between items-center relative">
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Блок питания
							</div>
							<div className="text-xl">{powerSupply.name}</div>
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
						<div
							className="px-5 py-3 flex justify-between items-center relative"
							onClick={() => setIsOpenDisclosure(!isOpenDisclosure)}
						>
							<div className="text-lg leading-none m-0 font-semibold relative pr-4">
								Блок питания
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
				<DisclosureContent
					className={`${powerSupply !== null ? 'bg-white' : ''}`}
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
											<TextField {...params} label="Блок питания" />
										)}
										options={powerSupplyTS.map((supplyT: PowerSupplyT) => {
											return supplyT.name;
										})}
										onChange={(event, value) => {
											const selected = powerSupplyTS.find(
												powerS => powerS.name === value,
											);
											setSelectedPowerS(selected || null);
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
												<span>Мощность</span>
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
														{uniquePower.map(memory => (
															<div
																key={memory}
																className="flex text-center items-center"
															>
																<Checkbox
																	checked={selectedPower.includes(memory)}
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
								</div>

								{/*Title*/}
								{filteredRamItems.length === 0 ? (
									<></>
								) : (
									<div
										className="grid w-full text-base gap-2 mt-4 bg-amber-100 items-center justify-center cursor-default"
										style={{
											gridTemplateColumns:
												'0.3fr 2.6fr 0.7fr 1fr 1.2fr 0.5fr 1fr 1fr',
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
											<span>Мощность</span>
										</div>

										<div className="text-center">
											<div className="Icon" />
											<span>Эффективность</span>
										</div>

										<div className="text-center">
											<div className="Icon" />
											<span>Модульность</span>
										</div>

										<div className="text-center">
											<div className="Icon" />
											<span>Вентилятор</span>
										</div>

										<div
											className="flex ml-14 cursor-pointer"
											onClick={toggleSortOrder}
										>
											<ChevronsDownUp className="" />
											<span>Цена</span>
										</div>

										<div className="">
											<div className="Icon" />
											<span>Показать еще</span>
										</div>
									</div>
								)}

								{/*Items*/}
								{filteredRamItems.length === 0 ? (
									<div className={'font-bold text-2xl text-center m-10'}>
										<p>Нет доступных блоков питания для отображения.</p>
									</div>
								) : (
									<div>
										{filteredRamItems.map((powerSupplyItem: PowerSupplyT) => (
											<Dialog
												transition={{
													type: 'spring',
													stiffness: 200,
													damping: 24,
												}}
												key={powerSupplyItem.id}
											>
												<DialogTrigger
													style={{ borderRadius: '4px' }}
													className="border border-gray-200/60 bg-white mb-1 mt-1 w-full flex items-center space-x-3"
												>
													<div
														className={`${powerSupply && powerSupplyItem.id === powerSupply.id ? 'bg-green-400' : ''} w-full flex flex-col items-center justify-center gap-1 space-y-0`}
													>
														<div
															className="w-full h-full grid items-center text-center p-2"
															style={{
																gridTemplateColumns: `0.3fr 2.7fr 0.7fr 1fr 1.2fr 0.8fr 0.7fr 1fr`,
															}}
														>
															<DialogImage
																src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																alt="What I Talk About When I Talk About Running - book cover"
																className="h-8 w-8 object-cover object-top mr-2"
																style={{
																	borderRadius: '4px',
																}}
															/>
															<div className="text-left">
																{powerSupplyItem.name}
															</div>
															<div className="">{powerSupplyItem.Power}</div>
															<div className="">
																{powerSupplyItem.Efficiency}
															</div>
															<div className="">
																{powerSupplyItem.Modularity}
															</div>
															<div className="">
																{powerSupplyItem.Cooling} мм
															</div>
															<div className="text-red-600">
																{powerSupplyItem.price}₽
															</div>
															{powerSupply &&
															powerSupplyItem.id === powerSupply.id ? (
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
																		handleGPUChange(e, powerSupplyItem);
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
																		src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																		alt="What I Talk About When I Talk About Running - book cover"
																		className="h-auto w-[200px]"
																	/>
																</div>
																<div>
																	<DialogTitle className="text-black text-2xl font-bold">
																		{powerSupplyItem.name}
																	</DialogTitle>
																	<DialogSubtitle>
																		<div className="flex justify-between text-center items-center my-3">
																			<div className="text-4xl text-[#F2530C]">
																				{powerSupplyItem.price}
																			</div>
																			{powerSupply &&
																			powerSupplyItem.id === powerSupply.id ? (
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
																					className={`border border-zinc-950/10 rounded-3xl px-14 py-2 inline-flex bg-[#94B90A] text-white item-center text-center gap-4`}
																					onClick={e => {
																						handleGPUChange(e, powerSupplyItem);
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
																				{powerSupplyItem.Manufacturer}
																			</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Мощность</span>
																			<span>{powerSupplyItem.Power} Вт</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Эффективность</span>
																			<span>{powerSupplyItem.Efficiency}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Модульность</span>
																			<span>{powerSupplyItem.Modularity}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Тип кабелей</span>
																			<span>{powerSupplyItem.CableType}</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Охлаждение</span>
																			<span>{powerSupplyItem.Cooling} мм</span>
																		</div>

																		<Separator className="my-2 bg-gray-300 h-[1px]" />
																		<div className="flex justify-between ml-2 mr-2">
																			<span>Гарантия</span>
																			<span>{powerSupplyItem.Warranty}</span>
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

export default PowerSupply;
