import { create } from 'zustand';
import { CPUItem } from '@/interface/CPU';
import { GPUItem } from '@/interface/GPU';
import { MotherboardItems } from '@/interface/Motherboard';
import { RAMItem } from '@/interface/Ram';
import { PowerSupplyT } from '@/interface/PowerSupply';

interface GPUStore {
	gpu: GPUItem | null;
	setGPU: (gpu: GPUItem | null) => void;
}

interface CPUStore {
	cpu: CPUItem | null;
	setCPU: (cpu: CPUItem | null) => void;
}

interface MotherboardStore {
	motherboard: MotherboardItems | null;
	setMotherboard: (motherboard: MotherboardItems | null) => void;
}

interface MemoryStore {
	memory: RAMItem | null;
	setMemory: (memory: RAMItem | null) => void;
}

interface PowerSupplyStore {
	powerSupply: PowerSupplyT | null;
	setPowerSupply: (powerSupply: PowerSupplyT | null) => void;
}

export const useGPUStore = create<GPUStore>(set => ({
	gpu:
		localStorage.getItem('gpu') !== undefined
			? JSON.parse(localStorage.getItem('gpu'))
			: null,
	setGPU: gpu => set({ gpu }),
}));

export const useCPUStore = create<CPUStore>(set => ({
	cpu:
		JSON.parse(localStorage.getItem('cpu')) !== undefined
			? JSON.parse(localStorage.getItem('cpu'))
			: null,
	setCPU: cpu => set({ cpu }),
}));

export const useMotherboardStore = create<MotherboardStore>(set => ({
	motherboard: JSON.parse(localStorage.getItem('motherboard')) || null,
	setMotherboard: motherboard => set({ motherboard }),
}));

export const useMemoryStore = create<MemoryStore>(set => ({
	memory: JSON.parse(localStorage.getItem('memory')) || null,
	setMemory: memory => set({ memory }),
}));

export const usePowerSupplyStore = create<PowerSupplyStore>(set => ({
	powerSupply: JSON.parse(localStorage.getItem('powerSupply')) || null,
	setPowerSupply: powerSupply => set({ powerSupply }),
}));
