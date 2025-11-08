import { RAMItem } from '@/interface/RamT';
import { create } from 'zustand/index';
import { getStoredRAM, setStoredRAM } from '@/lib/utils/storage';

interface MemoryStore {
	memory: RAMItem | null;
	setMemory: (memory: RAMItem | null) => void;
	resetMemory: () => void;
}

export const useMemoryStore = create<MemoryStore>(set => ({
	memory: getStoredRAM(),
	setMemory: memory => {
		setStoredRAM(memory);
		set({ memory });
	},
	resetMemory: () => {
		setStoredRAM(null);
		set({ memory: null });
	},
}));

interface RamState {
	rams: RAMItem[];
	isLoading: boolean;
	error: string | null;
	setRAMs: (memory: RAMItem[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useRAMApiStore = create<RamState>(set => ({
	rams: [],
	isLoading: true,
	error: null,
	setRAMs: rams => set({ rams }),
	setLoading: loading => set({ isLoading: loading }),
	setError: error => set({ error }),
}));
