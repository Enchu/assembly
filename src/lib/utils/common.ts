import apiinstance from '@/api/apiinstance';
import { CPUItem } from '@/interface/CPU';
import { GPUItem } from '@/interface/GPU';
import { MotherboardItems } from '@/interface/Motherboard';
import { PowerSupplyT } from '@/interface/PowerSupply';
import { RAMItem } from '@/interface/RamT';

export const fetchCPUsFromAPI = async (): Promise<CPUItem[]> => {
	try {
		const { data } = await apiinstance.get('/api/cpu');
		return data;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

export const fetchGPUsFromAPI = async (): Promise<GPUItem[]> => {
	try {
		const { data } = await apiinstance.get('/api/gpu');
		return data;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

export const fetchMotherboardsFromAPI = async (): Promise<MotherboardItems[]> => {
	try {
		const { data } = await apiinstance.get('/api/motherboard');
		return data;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

export const fetchRAMsFromAPI = async (): Promise<RAMItem[]> => {
	try {
		const { data } = await apiinstance.get('/api/ram');
		return data;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

export const fetchPowerSupplysFromAPI = async (): Promise<PowerSupplyT[]> => {
	try {
		const { data } = await apiinstance.get('/api/power-supply');
		return data;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};
