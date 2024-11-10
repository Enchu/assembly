'use client';

import React, { useState } from 'react';
import './blog.scss';
import {
	Disclosure,
	DisclosureContent,
	DisclosureTrigger,
} from '@/components/core/disclosure';
import {
	Dialog,
	DialogClose,
	DialogContainer,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/core/dialog';
import { ArrowDownFromLine, Search } from 'lucide-react';
import RangeSlider from '@/components/modules/RangeSlider/RangeSlider';
import Checkbox from '@mui/material/Checkbox';

import CPU from '@/components/elements/CPU/CPU';
import Motherboard from '@/components/elements/Motherboard/Motherboard';
import GPU from '@/components/elements/GPU/GPU';

const Blog = () => {
	const [range, setRange] = useState([0, 100]);

	return (
		<>
			<div className="container">
				<CPU />
				<Motherboard />
				<GPU />

				<Disclosure className="w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700 mb-5">
					<DisclosureTrigger>
						<div className="px-5 py-3 flex justify-between items-center relative">
							<div
								className={
									'text-lg leading-none m-0 font-semibold relative pr-4'
								}
							>
								Модули памяти
							</div>
							<div className={'flex'}>
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
									<div className="relative w-full flex gap-4">
										<div className="relative flex items-center gap-2 border border-zinc-950/10 rounded-lg p-2 h-9">
											<input
												className="h-9 flex-1 bg-transparent text-zinc-900 placeholder-zinc-500 focus:outline-none"
												autoFocus
												placeholder="Search"
											/>
											<Search className="h-5 w-5" />
										</div>

										<Dialog
											transition={{
												type: 'spring',
												bounce: 0.05,
												duration: 0.25,
											}}
										>
											<DialogTrigger>
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
															classes={{ root: 'RangeSliderPage-Slider' }}
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
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
								</div>
							</div>
						</div>
					</DisclosureContent>
				</Disclosure>

				<Disclosure className="w-full rounded-md border border-zinc-200 px-3 dark:border-zinc-700 mb-5">
					<DisclosureTrigger>
						<div className="px-5 py-3 flex justify-between items-center relative">
							<div
								className={
									'text-lg leading-none m-0 font-semibold relative pr-4'
								}
							>
								Блок питания
							</div>
							<div className={'flex'}>
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
									<div className="relative w-full flex gap-4">
										<div className="relative flex items-center gap-2 border border-zinc-950/10 rounded-lg p-2 h-9">
											<input
												className="h-9 flex-1 bg-transparent text-zinc-900 placeholder-zinc-500 focus:outline-none"
												autoFocus
												placeholder="Search"
											/>
											<Search className="h-5 w-5" />
										</div>

										<Dialog
											transition={{
												type: 'spring',
												bounce: 0.05,
												duration: 0.25,
											}}
										>
											<DialogTrigger>
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
															classes={{ root: 'RangeSliderPage-Slider' }}
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
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
												<div className="border border-zinc-950/10 bg-transparent rounded-lg h-9 p-2 text-zinc-900 placeholder-zinc-500 flex text-center items-center gap-2">
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
								</div>
							</div>
						</div>
					</DisclosureContent>
				</Disclosure>
			</div>
		</>
	);
};

export default Blog;
