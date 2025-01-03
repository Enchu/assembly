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
	gpu: (() => {
		if (typeof window !== 'undefined') {
			const storedGpu = localStorage.getItem('gpu');
			return storedGpu ? JSON.parse(storedGpu) : null;
		}
		return null;
	})(),
	setGPU: gpu => {
		set({ gpu });
	},
}));

export const useCPUStore = create<CPUStore>(set => ({
	cpu: (() => {
		if (typeof window !== 'undefined') {
			const storedCpu = localStorage.getItem('cpu');
			return storedCpu ? JSON.parse(storedCpu) : null;
		}
		return null;
	})(),
	setCPU: cpu => {
		set({ cpu });
	},
}));

export const useMotherboardStore = create<MotherboardStore>(set => ({
	motherboard: (() => {
		if (typeof window !== 'undefined') {
			const storedMotherboard = localStorage.getItem('motherboard');
			return storedMotherboard ? JSON.parse(storedMotherboard) : null;
		}
		return null;
	})(),
	setMotherboard: motherboard => {
		set({ motherboard });
	},
}));

export const useMemoryStore = create<MemoryStore>(set => ({
	memory: (() => {
		if (typeof window !== 'undefined') {
			const storedMemory = localStorage.getItem('memory');
			return storedMemory ? JSON.parse(storedMemory) : null;
		}
		return null;
	})(),
	setMemory: memory => {
		set({ memory });
	},
}));

export const usePowerSupplyStore = create<PowerSupplyStore>(set => ({
	powerSupply: (() => {
		if (typeof window !== 'undefined') {
			const storedPowerSupply = localStorage.getItem('powerSupply');
			return storedPowerSupply ? JSON.parse(storedPowerSupply) : null;
		}
		return null;
	})(),
	setPowerSupply: powerSupply => {
		set({ powerSupply });
	},
}));
