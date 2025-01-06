import {
	useCPUStore,
	useGPUStore,
	useMemoryStore,
	useMotherboardStore,
	usePowerSupplyStore,
} from '@/store/store';

export const useCalculatePowerRequirement = () => {
	const { cpu } = useCPUStore();
	const { motherboard } = useMotherboardStore();
	const { gpu } = useGPUStore();
	const { memory } = useMemoryStore();
	const { powerSupply } = usePowerSupplyStore();

	let result = 0;

	if (cpu?.TDP) {
		result += parseInt(cpu.TDP || '0', 10);
	}

	if (motherboard?.powerConsumption) {
		result += parseInt(motherboard.powerConsumption || '0', 10);
	}

	if (gpu?.TDP) {
		result += parseInt(gpu.TDP || '0', 10);
	}

	if (memory?.powerConsumption) {
		result += parseInt(memory.powerConsumption || '0', 10);
	}

	const roundedResult = Math.ceil(result / 100) * 100;

	const powerSupplyPower = powerSupply
		? parseInt(powerSupply.Power || '0', 10)
		: 0;

	return {
		result: roundedResult,
		powerSupplyPower,
		isSufficient: result <= powerSupplyPower,
	};
};
