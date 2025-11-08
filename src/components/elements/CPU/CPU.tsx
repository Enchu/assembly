import React, { useEffect, useMemo, useState } from 'react';
import { Disclosure, DisclosureContent, DisclosureTrigger } from '@/components/core/disclosure';
import { ArrowDownFromLine, ChevronsDownUp, Plus, RefreshCw } from 'lucide-react';
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
import { useCPUApiStore, useCPUStore } from '@/store/cpuStore';
import { CPUItem } from '@/interface/CPU';
import Skeleton from '@/components/modules/Skelet/Skeleton';
import { fetchCPUs } from '@/context/cpuService';
import { useMotherboardStore } from '@/store/motherboardStore';
import toast from 'react-hot-toast';
import { useDebounceValue } from '@/hooks/useDebounce';
import ScrollAreaSelectedButton from '@/components/modules/Buttons/ScrollAreaSelectedButton';
import ChooseButton from '@/components/modules/Buttons/ChooseButton';
import ScrollAreaChooseButton from '@/components/modules/Buttons/ScrollAreaChooseButton';
import SelectedButton from '@/components/modules/Buttons/SelectedButton';

const CPU = () => {
	const { cpus, isLoading } = useCPUApiStore();

	useEffect(() => {
		fetchCPUs();
	}, []);

	const [uniqueCores, setUniqueCores] = useState<string[]>([]);
	const [uniqueThreads, setUniqueThreads] = useState<string[]>([]);
	const [selectedCores, setSelectedCores] = useState<string[]>([]);
	const [selectedThreads, setSelectedThreads] = useState<string[]>([]);
	const [minPriceRange, setMinPriceRange] = useState<number>(0);
	const [maxPriceRange, setMaxPriceRange] = useState<number>(0);
	const [range, setRange] = useState<number[]>([minPriceRange, maxPriceRange]);
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState(1);
	const [cpuPerPage] = useState(10);

	useEffect(() => {
		if (!isLoading && cpus.length > 0) {
			const cores = Array.from(new Set(cpus.map(item => item.cores.slice(0, 2)))).sort((a, b) => Number(b) - Number(a));
			setUniqueCores(cores);

			const threads = Array.from(new Set(cpus.map(item => item.threads))).sort((a, b) => Number(b) - Number(a));
			setUniqueThreads(threads);

			const minPriceRange = Math.min(...cpus.map(item => parseInt(item.price, 10)));
			const maxPriceRange = Math.max(...cpus.map(item => parseInt(item.price, 10)));

			setMinPriceRange(minPriceRange);
			setMaxPriceRange(maxPriceRange);
			setRange([minPriceRange, maxPriceRange]);
			setMinPrice(minPriceRange);
			setMaxPrice(maxPriceRange);
		}
	}, [cpus, isLoading]);

	const [isOpenDisclosure, setIsOpenDisclosure] = useState(false);

	const { cpu, setCPU, resetCPU } = useCPUStore();
	const { motherboard } = useMotherboardStore();
	const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>([]);
	const [inputAutocompleteValue, setInputAutocompleteValue] = useState('');
	const [selectedCPU, setSelectedCPU] = useState<CPUItem | null>(null);

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const debounceValue = useDebounceValue(inputAutocompleteValue);

	const filteredCpus = useMemo(() => {
		if (!debounceValue.trim()) return cpus;
		return cpus.filter(cpu => cpu.name.toLowerCase().includes(inputAutocompleteValue.toLowerCase()));
	}, [debounceValue, cpus]);

	// FILTERED
	const filteredCPUItems = cpus
		.filter(cpu => {
			// Фильтруем по производителю
			const matchesManufacturer =
				selectedManufacturer.length > 0 ? selectedManufacturer.includes(cpu.manufacturer) : true;

			// Если выбран конкретный CPU, показываем только его
			const matchesSelectedCPU = selectedCPU ? cpu.name === selectedCPU.name : true;

			// Проверяем, попадает ли цена в диапазон
			const cpuPrice = parseFloat(cpu.price); // Преобразуем цену в число
			const matchesPriceRange = cpuPrice >= range[0] && cpuPrice <= range[1];

			// Фильтруем по количеству ядер
			const matchesCores = selectedCores.length > 0 ? selectedCores.includes(cpu.cores) : true;

			const socketMotherboard = motherboard !== null ? cpu.socket === motherboard.socket : true;

			const matchesThreads = selectedThreads.length > 0 ? selectedThreads.includes(cpu.threads) : true;

			return (
				matchesManufacturer &&
				matchesSelectedCPU &&
				matchesPriceRange &&
				matchesCores &&
				socketMotherboard &&
				matchesThreads
			);
		})
		.sort((a, b) => {
			const priceA = parseFloat(a.price);
			const priceB = parseFloat(b.price);
			return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
		});

	// Получаем текущие процессоры для отображения
	const indexOfLastCpu = currentPage * cpuPerPage;
	const indexOfFirstCpu = indexOfLastCpu - cpuPerPage;
	const currentCpus = filteredCPUItems.slice(indexOfFirstCpu, indexOfLastCpu);

	// Обработчик изменения страницы
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	};

	const toggleSortOrder = () => {
		setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
	};

	const handleCoresChange = (cores: string) => {
		setSelectedCores(prev => (prev.includes(cores) ? prev.filter(item => item !== cores) : [...prev, cores]));
	};

	const handleThreadsChange = (threads: string) => {
		setSelectedThreads(prev => (prev.includes(threads) ? prev.filter(item => item !== threads) : [...prev, threads]));
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

	const handleCPUChange = (event: React.ChangeEvent<unknown>, value: CPUItem) => {
		event.stopPropagation();
		setCPU(value);
		setIsOpenDisclosure(!isOpenDisclosure);
		toast.success('Успешно изменен процессор');
	};

	const handleDialogClose = () => {
		setIsOpenDisclosure(true);
		resetCPU();
		setSelectedCPU(null);
		toast.success('Успешно очищен процессор');
	};

	const handleManufacture = (manufacturer: 'Intel' | 'AMD') => {
		setSelectedManufacturer((prev: string[]) =>
			prev.includes(manufacturer) ? prev.filter((item: string) => item !== manufacturer) : [...prev, manufacturer],
		);
	};

	const clearAllFilters = () => {
		setSelectedManufacturer([]);
		setSelectedCores([]);
		setSelectedThreads([]);
		setSelectedCPU(null);
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
					className={`w-full rounded-md border border-zinc-200 dark:border-zinc-700 mb-5 ${cpu !== null ? 'bg-green-400' : ''}`}
					open={isOpenDisclosure}
				>
					<DisclosureTrigger className={'px-3'}>
						{cpu !== null ? (
							<div className="px-5 py-3 flex justify-between items-center relative">
								<div className="text-lg leading-none m-0 font-semibold relative pr-4">Процессор</div>
								<div className="text-xl">{cpu.name}</div>
								<div className="flex">
									<button
										className={
											'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
										}
										onClick={() => handleDialogClose()}
									>
										<RefreshCw className="mr-2 h-4 w-4" />
										<a>| Заменить</a>
									</button>
								</div>
							</div>
						) : (
							<div className="px-5 py-3 flex justify-between items-center relative">
								<div className="text-lg leading-none m-0 font-semibold relative pr-4">Процессор</div>
								<div className="flex">
									<button
										className={
											'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
										}
										onClick={() => setIsOpenDisclosure(!isOpenDisclosure)}
									>
										<Plus className="mr-1 h-4 w-4" />
										<span>| Выбрать</span>
									</button>
								</div>
							</div>
						)}
					</DisclosureTrigger>
					<DisclosureContent className={`${cpu !== null ? 'bg-white' : ''}`}>
						<div className="overflow-hidden pb-3 px-3">
							<div className="font-mono text-sm">
								<div className="space-x-2">
									<div className="ml-2 relative w-full flex gap-4 h-12 items-center">
										<Autocomplete
											disablePortal
											value={selectedCPU?.name || ''}
											inputValue={inputAutocompleteValue}
											onInputChange={(_, newInputValue) => setInputAutocompleteValue(newInputValue)}
											sx={{
												width: 500,
												alignItems: 'center',
												position: 'relative',
												display: 'flex',
											}}
											size="small"
											renderInput={params => <TextField {...params} label="CPU" />}
											options={filteredCpus.map(cpu => cpu.name)}
											onChange={(event, value) => {
												const selected = cpus.find(cpu => cpu.name === value);
												setSelectedCPU(selected || null);
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
													className={`${selectedManufacturer.length > 0 ? '!bg-green-400 !text-white' : '!bg-transparent !text-zinc-900'} border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2`}
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
														<DialogTitle className="text-2xl text-zinc-950">Производитель</DialogTitle>
														<div className="p-2" />
														<div className="relative flex flex-col p-2 w-full">
															<div className="flex text-center items-center">
																<Checkbox
																	checked={selectedManufacturer.includes('Intel')}
																	onClick={() => handleManufacture('Intel')}
																/>
																<span>Intel</span>
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
													className={`${selectedCores.length > 0 ? '!bg-green-400 !text-white' : 'bg-transparent text-zinc-900'} border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2`}
												>
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
														<DialogTitle className="text-2xl text-zinc-950">Количество ядер</DialogTitle>
														<div className="p-2" />
														<div className="relative flex flex-col p-2 w-full">
															{uniqueCores.map(cores => (
																<div key={cores} className="flex text-center items-center">
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
													className={`${selectedThreads.length > 0 ? '!bg-green-400 !text-white' : 'bg-transparent text-zinc-900'} border border-zinc-950/10 rounded-lg p-2 placeholder-zinc-500 flex text-center items-center gap-2`}
												>
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
														<DialogTitle className="text-2xl text-zinc-950">Количество потоков</DialogTitle>
														<div className="p-2" />
														<div className="relative flex flex-col p-2 w-full">
															{uniqueThreads.map(threads => (
																<div key={threads} className="flex text-center items-center">
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
									{filteredCPUItems.length === 0 ? (
										<></>
									) : (
										<div
											className="grid w-full text-base gap-2 mt-4 bg-amber-100 items-center justify-center cursor-default"
											style={{
												gridTemplateColumns: '0.3fr 2.3fr 1fr 0.6fr 0.8fr 0.7fr 0.5fr 1fr',
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
												<span>Кол-во ядер</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>TDP</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Сокет</span>
											</div>

											<div className="text-center">
												<div className="Icon" />
												<span>Score</span>
											</div>

											<div className="flex justify-center cursor-pointer" onClick={toggleSortOrder}>
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
									{filteredCPUItems.length === 0 ? (
										<div className={'font-bold text-2xl text-center m-10'}>
											<p>Нет доступных процессоров для отображения.</p>
										</div>
									) : (
										<div>
											{currentCpus.map((cpuT: CPUItem) => (
												<Dialog
													transition={{
														type: 'spring',
														stiffness: 200,
														damping: 24,
													}}
													key={cpuT.id}
												>
													<DialogTrigger
														style={{ borderRadius: '4px' }}
														className={`border border-gray-200/60 bg-white mb-1 mt-1 w-full flex items-center space-x-3`}
													>
														<div
															className={`${cpu && cpuT.id === cpu.id ? 'bg-green-400' : ''} w-full flex flex-col items-center justify-center gap-1 space-y-0`}
														>
															<div
																className="w-full h-full grid p-2 items-center gap-4"
																style={{
																	gridTemplateColumns: `0.3fr 3fr 1.2fr 0.7fr 1fr 0.8fr 0.6fr 1fr`,
																}}
															>
																<DialogImage
																	src={`${cpuT.img}`}
																	alt="Cpu"
																	className="h-8 w-8 object-cover object-top"
																/>
																<div className="text-left">{cpuT.name}</div>
																<div className="text-center">{cpuT.cores} ядер</div>
																<div className="text-center">{cpuT.TDP} Вт</div>
																<div className="text-center">{cpuT.socket}A</div>
																<div className="text-center ">{cpuT.score}</div>
																<div className="text-center text-red-600">{cpuT.price}₽</div>
																{cpu && cpuT.id === cpu.id ? (
																	<SelectedButton />
																) : (
																	<ChooseButton
																		name={'Выбрать'}
																		onClick={e => {
																			handleCPUChange(e, cpuT);
																		}}
																	/>
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
																		<DialogImage src={`${cpuT.img}`} alt="Cpu" className="h-auto w-[400px]" />
																	</div>
																	<div>
																		<DialogTitle className="text-black text-2xl font-bold">{cpuT.name}</DialogTitle>
																		<DialogSubtitle>
																			<div className="flex justify-between text-center items-center my-3">
																				<div className="text-4xl text-[#F2530C]">{cpuT.price}</div>
																				{cpu && cpuT.id === cpu.id ? (
																					<ScrollAreaSelectedButton />
																				) : (
																					<ScrollAreaChooseButton
																						onClick={e => {
																							handleCPUChange(e, cpuT);
																						}}
																						name={'Выбрать'}
																					/>
																				)}
																			</div>
																		</DialogSubtitle>
																		<div className="mt-2 text-base text-gray-700">
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Количество ядер</span>
																				<span>{cpuT.cores}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Количество потоков</span>
																				<span>{cpuT.threads}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Базовая частота</span>
																				<span>{cpuT.baseClock} GHz</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Максимальная частота</span>
																				<span>{cpuT.boostClock} GHz</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Кэш-память</span>
																				<span>{cpuT.cache}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>Сокет</span>
																				<span>{cpuT.socket}</span>
																			</div>

																			<Separator className="my-2 bg-gray-300 h-[1px]" />
																			<div className="flex justify-between ml-2 mr-2">
																				<span>TDP</span>
																				<span>{cpuT.TDP}</span>
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
												count={Math.ceil(filteredCPUItems.length / cpuPerPage)}
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

export default CPU;
