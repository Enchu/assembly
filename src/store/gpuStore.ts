import { GPUItem } from '@/interface/GPU';
import { create } from 'zustand/index';
import { getStoredGPU, setStoredGPU } from '@/lib/utils/storage';

interface GPUStore {
	gpu: GPUItem | null;
	setGPU: (gpu: GPUItem | null) => void;
	resetGPU: () => void;
}

export const useGPUStore = create<GPUStore>(set => ({
	gpu: getStoredGPU(),
	setGPU: gpu => {
		setStoredGPU(gpu);
		set({ gpu });
	},
	resetGPU: () => {
		setStoredGPU(null);
		set({ gpu: null });
	},
}));

interface GPUState {
	gpus: GPUItem[];
	isLoading: boolean;
	error: string | null;
	setGPUs: (gpus: GPUItem[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useGPUApiStore = create<GPUState>(set => ({
	gpus: [],
	isLoading: true,
	error: null,
	setGPUs: gpus => set({ gpus }),
	setLoading: loading => set({ isLoading: loading }),
	setError: error => set({ error }),
}));
