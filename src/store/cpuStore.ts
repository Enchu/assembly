import { CPUItem } from '@/interface/CPU';
import { create } from 'zustand/index';
import { getStoredCPU, setStoredCPU } from '@/lib/utils/storage';

interface CPUStore {
	cpu: CPUItem | null;
	setCPU: (cpu: CPUItem | null) => void;
	resetCPU: () => void;
}

export const useCPUStore = create<CPUStore>(set => ({
	cpu: getStoredCPU(),
	setCPU: cpu => {
		setStoredCPU(cpu);
		set({ cpu });
	},
	resetCPU: () => {
		setStoredCPU(null);
		set({ cpu: null });
	},
}));

interface CPUState {
	cpus: CPUItem[];
	isLoading: boolean;
	error: string | null;
	setCPUs: (cpus: CPUItem[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useCPUApiStore = create<CPUState>(set => ({
	cpus: [],
	isLoading: true,
	error: null,
	setCPUs: cpus => set({ cpus }),
	setLoading: loading => set({ isLoading: loading }),
	setError: error => set({ error }),
}));
