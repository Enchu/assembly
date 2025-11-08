import { CPUItem } from '@/interface/CPU';
import { GPUItem } from '@/interface/GPU';
import { MotherboardItems } from '@/interface/Motherboard';
import { RAMItem } from '@/interface/RamT';
import { PowerSupplyT } from '@/interface/PowerSupply';

/* CPU */
export const getStoredCPU = (): CPUItem | null => {
	if (typeof window !== 'undefined') {
		const storedCpu = localStorage.getItem('cpu');
		return storedCpu ? JSON.parse(storedCpu) : null;
	}
	return null;
};

export const setStoredCPU = (cpu: CPUItem | null): void => {
	if (cpu) {
		localStorage.setItem('cpu', JSON.stringify(cpu));
	} else {
		localStorage.removeItem('cpu');
	}
};

/* Motherboard */
export const getStoredMotherboard = (): MotherboardItems | null => {
	if (typeof window !== 'undefined') {
		const storedMotherboard = localStorage.getItem('motherboard');
		return storedMotherboard ? JSON.parse(storedMotherboard) : null;
	}
	return null;
};

export const setStoredMotherboard = (motherboard: MotherboardItems | null): void => {
	if (motherboard) {
		localStorage.setItem('motherboard', JSON.stringify(motherboard));
	} else {
		localStorage.removeItem('motherboard');
	}
};

/* GPU */
export const getStoredGPU = (): GPUItem | null => {
	if (typeof window !== 'undefined') {
		const storedGpu = localStorage.getItem('gpu');
		return storedGpu ? JSON.parse(storedGpu) : null;
	}
	return null;
};

export const setStoredGPU = (gpu: GPUItem | null): void => {
	if (gpu) {
		localStorage.setItem('gpu', JSON.stringify(gpu));
	} else {
		localStorage.removeItem('gpu');
	}
};

/* RAM */
export const getStoredRAM = (): RAMItem | null => {
	if (typeof window !== 'undefined') {
		const storedRAM = localStorage.getItem('memory');
		return storedRAM ? JSON.parse(storedRAM) : null;
	}
	return null;
};

export const setStoredRAM = (ram: RAMItem | null): void => {
	if (ram) {
		localStorage.setItem('memory', JSON.stringify(ram));
	} else {
		localStorage.removeItem('memory');
	}
};

/* PowerSupply */
export const getStoredPowerSupply = (): PowerSupplyT | null => {
	if (typeof window !== 'undefined') {
		const storedRAM = localStorage.getItem('powerSupply');
		return storedRAM ? JSON.parse(storedRAM) : null;
	}
	return null;
};

export const setStoredPowerSupply = (powerSupply: PowerSupplyT | null): void => {
	if (powerSupply) {
		localStorage.setItem('powerSupply', JSON.stringify(powerSupply));
	} else {
		localStorage.removeItem('powerSupply');
	}
};
