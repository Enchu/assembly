import React, { useState } from 'react';
import { Disclosure, DisclosureContent, DisclosureTrigger } from '@/components/core/disclosure';
import { ArrowDownFromLine } from 'lucide-react';
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
import RangeSlider from '@/components/elements/RangeSlider/RangeSlider';
import Checkbox from '@mui/material/Checkbox';
import { ScrollArea } from '@/components/core/scroll-area';
import items from '@/data/data.json';
import { Autocomplete, TextField } from '@mui/material';
import { Separator } from '@radix-ui/react-separator';

interface GPUItems {
	id: string;
	img: string;
	name: string;
	TDP: string;
	Memory: string;
	MemoryBus: string; // Шина памяти
	MemoryType: string; // Тип памяти
	CoreClock: string; // Частота графического ядра
	Performance: string; // Производительность
	Interface: string; // Интерфейс
	Connectors: string; // Разъемы
	RecommendedPowerSupply: string;
	score: string;
	price: string;
}

const Gpu = () => {
	const [range, setRange] = useState([0, 100]);
	const gpuItems: GPUItems[] = items[0].gpu;

	return (
		<>
			<Disclosure className="w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700 mb-5">
				<DisclosureTrigger>
					<div className="px-5 py-3 flex justify-between items-center relative">
						<div className="text-lg leading-none m-0 font-semibold relative pr-4">Видеокарта</div>
						<div className="flex">
							<button
								className={
									'border border-zinc-950/10 rounded-lg m-1 px-2.5 py-1.5 inline-flex items-center justify-center'
								}
							>
								+ | Добавить
							</button>
						</div>
					</div>
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
										renderInput={params => <TextField {...params} label="GPU" />}
										options={gpuItems.map((gpu: GPUItems) => {
											return gpu.name;
										})}
									/>

									{/*<div className="relative flex items-center gap-2 border border-zinc-950/10 rounded-lg p-2 h-9">
                                        <input
                                            className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-500 focus:outline-none"
                                            autoFocus
                                            placeholder="Search"
                                        />
                                        <Search className='h-5 w-5'/>
                                    </div>*/}

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
													<DialogTitle className="text-2xl text-zinc-950">Price</DialogTitle>
													<div className="p-4" />
													<div className="relative flex items-center gap-2 p-2 h-9 w-full">
														<input
															className="w-2/5 pl-3 h-10 border border-zinc-950/10 rounded-lg bg-transparent text-zinc-900 placeholder-zinc-500 focus:outline-none"
															placeholder="Min"
														/>
														<span>-</span>
														<input
															className="w-2/5 pl-3 h-10 border border-zinc-950/10 rounded-lg bg-transparent text-zinc-900 placeholder-zinc-500 focus:outline-none"
															placeholder="Max"
														/>
														<button className="h-10 px-5 border border-zinc-950/10 rounded-3xl text-white bg-neutral-950 hover:bg-[#FC5D36] transition-all">
															Ок
														</button>
													</div>
													<div className="p-5" />

													<RangeSlider
														classes={{
															root: 'RangeSliderPage-Slider',
														}}
														isShowTooltip={true}
														min={0}
														max={100}
														onChange={setRange}
														step={1}
														value={range}
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
															<Checkbox />
															<text>Amd</text>
														</div>
														<div className="flex text-center items-center">
															<Checkbox />
															<text>Intel</text>
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
															<text>123</text>
														</div>
														<div className="flex text-center items-center">
															<Checkbox />
															<text>123</text>
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
															<text>123</text>
														</div>
														<div className="flex text-center items-center">
															<Checkbox />
															<text>123</text>
														</div>
													</div>
												</div>
												<DialogClose className="text-zinc-950 " />
											</DialogContent>
										</DialogContainer>
									</Dialog>
								</div>

								{/*Title*/}
								<div className="flex w-full gap-4 mt-4 bg-amber-100">
									<div className="flex w-1/9 items-center gap-2">
										<div className="Icon" />
										<text>Изображение</text>
									</div>
									<div className="flex w-2/6 items-center gap-2">
										<div className="Icon" />
										<text>Название</text>
									</div>

									<div className="flex w-2/6 items-center gap-2">
										<div className="Icon" />
										<text>Score</text>
									</div>

									<div className="">
										<div className="Icon" />
										<text>Цена</text>
									</div>
								</div>

								{/*Items*/}
								{gpuItems.map((gpu: GPUItems) => (
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
											<div className="w-full flex flex-col items-center justify-center space-y-0">
												<div className="w-full items-center">
													<>
														<div className="bg-white gap-4">
															<div className="w-full h-full flex p-2 gap-1 items-center">
																<DialogImage
																	src="https://m.media-amazon.com/images/I/71skAxiMC2L._AC_UF1000,1000_QL80_.jpg"
																	alt="What I Talk About When I Talk About Running - book cover"
																	className="h-8 w-8 object-cover object-top"
																	style={{
																		borderRadius: '4px',
																	}}
																/>
																<text className="w-full">{gpu.name}</text>
																<text className="w-1/6">{gpu.Memory}</text>
																<text className="w-1/6">{gpu.TDP}</text>
																<text className="w-1/6">{gpu.RecommendedPowerSupply}</text>
																<text className="w-1/6">{gpu.score}</text>
																<text className="w-1/6">{gpu.price}₽</text>
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
																<div className="flex justify-between text-center items-center">
																	<div className="text-4xl text-[#F2530C]">{gpu.price}</div>
																	<button
																		className={
																			'border border-zinc-950/10 rounded-3xl m-2 px-5 py-2' +
																			' inline-flex bg-[#94B90A] text-white'
																		}
																	>
																		+ | Выбрать
																	</button>
																</div>
															</DialogSubtitle>
															<div className="mt-2 text-base text-gray-700">
																<div className="flex justify-between ml-2 mr-2">
																	<text>Объем памяти</text>
																	<text>{gpu.Memory} GB</text>
																</div>

																<Separator className="my-2 bg-gray-300 h-[1px]" />
																<div className="flex justify-between ml-2 mr-2">
																	<text>Шина памяти</text>
																	<text>{gpu.MemoryBus} bit</text>
																</div>

																<Separator className="my-2 bg-gray-300 h-[1px]" />
																<div className="flex justify-between ml-2 mr-2">
																	<text>Тип памяти</text>
																	<text>{gpu.MemoryType}</text>
																</div>

																<Separator className="my-2 bg-gray-300 h-[1px]" />
																<div className="flex justify-between ml-2 mr-2">
																	<text>Частота графического ядра</text>
																	<text>{gpu.CoreClock} MHz</text>
																</div>

																<Separator className="my-2 bg-gray-300 h-[1px]" />
																<div className="flex justify-between ml-2 mr-2">
																	<text>Производительность</text>
																	<text>{gpu.Performance}</text>
																</div>

																<Separator className="my-2 bg-gray-300 h-[1px]" />
																<div className="flex justify-between ml-2 mr-2">
																	<text>Интерфейс</text>
																	<text>{gpu.Interface}</text>
																</div>

																<Separator className="my-2 bg-gray-300 h-[1px]" />
																<div className="flex justify-between ml-2 mr-2">
																	<text>Разъемы</text>
																	<text>{gpu.Connectors}</text>
																</div>

																<Separator className="my-2 bg-gray-300 h-[1px]" />
																<div className="flex justify-between ml-2 mr-2">
																	<text>Рекомендуемая мощность БП</text>
																	<text>{gpu.RecommendedPowerSupply} W</text>
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
						</div>
					</div>
				</DisclosureContent>
			</Disclosure>
		</>
	);
};

export default Gpu;
