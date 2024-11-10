import { create } from 'zustand';
import { CPUItem } from '@/interface/CPU';
import { RAMItem } from '@/interface/GPU';
import { MotherboardItems } from '@/interface/Motherboard';

interface GPUStore {
	gpu: RAMItem | null;
	setGPU: (gpu: RAMItem | null) => void;
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

export const useGPUStore = create<GPUStore>(set => ({
	gpu: null,
	setGPU: gpu => set({ gpu }),
}));

export const useCPUStore = create<CPUStore>(set => ({
	cpu: null,
	setCPU: cpu => set({ cpu }),
}));

export const useMotherboardStore = create<MotherboardStore>(set => ({
	motherboard: null,
	setMotherboard: motherboard => set({ motherboard }),
}));

export const useMemoryStore = create<MemoryStore>(set => ({
	memory: null,
	setMemory: memory => set({ memory }),
}));
