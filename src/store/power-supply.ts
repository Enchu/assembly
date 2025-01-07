import { PowerSupplyT } from '@/interface/PowerSupply';
import { create } from 'zustand/index';
import {
	getStoredPowerSupply,
	setStoredPowerSupply,
} from '@/lib/utils/storage';

interface PowerSupplyStore {
	powerSupply: PowerSupplyT | null;
	setPowerSupply: (powerSupply: PowerSupplyT | null) => void;
	resetPowerSupply: () => void;
}

export const usePowerSupplyStore = create<PowerSupplyStore>(set => ({
	powerSupply: getStoredPowerSupply(),
	setPowerSupply: powerSupply => {
		setStoredPowerSupply(powerSupply);
		set({ powerSupply });
	},
	resetPowerSupply: () => {
		setStoredPowerSupply(null);
		set({ powerSupply: null });
	},
}));

interface PowerSupplyState {
	powerSupplies: PowerSupplyT[];
	isLoading: boolean;
	error: string | null;
	setPowerSupplies: (powerSupplies: PowerSupplyT[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const usePowerSupplyApiStore = create<PowerSupplyState>(set => ({
	powerSupplies: [],
	isLoading: true,
	error: null,
	setPowerSupplies: powerSupplies => set({ powerSupplies }),
	setLoading: loading => set({ isLoading: loading }),
	setError: error => set({ error }),
}));
