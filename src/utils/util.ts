/*
import { useCPUStore } from '@/store/store';

export const calculatePowerRequirement = () => {
	const { cpu } = useCPUStore();
	const { motherboard } = useMotherboardStore();
	const { gpu } = useGPUStore();
	const { memory } = useMemoryStore();
	const { powerSupply } = usePowerSupplyStore();
	console.log(cpu !== null ? cpu.TDP : 0);
	const result = 0;

	if (cpu) {
    totalPower += parseInt(cpu.Power || '0', 10); // Мощность CPU
  }

  if (motherboard) {
    totalPower += parseInt(motherboard.Power || '0', 10); // Мощность материнской платы
  }

  if (gpu) {
    totalPower += parseInt(gpu.Power || '0', 10); // Мощность GPU
  }

  if (memory) {
    totalPower += parseInt(memory.Power || '0', 10); // Мощность RAM (если указано)
  }

  const powerSupplyPower = powerSupply ? parseInt(powerSupply.Power || '0', 10) : 0;

  return {
    totalPower,
    powerSupplyPower,
    isSufficient: totalPower <= powerSupplyPower, // Достаточна ли мощность блока питания
  };

	return result;
};
*/
