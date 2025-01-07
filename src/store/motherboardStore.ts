import { MotherboardItems } from '@/interface/Motherboard';
import { create } from 'zustand/index';
import {
	getStoredMotherboard,
	setStoredMotherboard,
} from '@/lib/utils/storage';

interface MotherboardStore {
	motherboard: MotherboardItems | null;
	setMotherboard: (motherboard: MotherboardItems | null) => void;
	resetMotherboard: () => void;
}

export const useMotherboardStore = create<MotherboardStore>(set => ({
	motherboard: getStoredMotherboard(),
	setMotherboard: motherboard => {
		setStoredMotherboard(motherboard);
		set({ motherboard });
	},
	resetMotherboard: () => {
		setStoredMotherboard(null);
		set({ motherboard: null });
	},
}));

interface MotherboardState {
	motherboards: MotherboardItems[];
	isLoading: boolean;
	error: string | null;
	setMotherboards: (motherboards: MotherboardItems[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useMotherboardApiStore = create<MotherboardState>(set => ({
	motherboards: [],
	isLoading: true,
	error: null,
	setMotherboards: motherboards => set({ motherboards }),
	setLoading: loading => set({ isLoading: loading }),
	setError: error => set({ error }),
}));
