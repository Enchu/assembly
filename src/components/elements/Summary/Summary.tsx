import React from 'react';
import {
	useCPUStore,
	useGPUStore,
	useMemoryStore,
	useMotherboardStore,
	usePowerSupplyStore,
} from '@/store/store';

import { useCalculatePowerRequirement } from '@/utils/util';

const Summary = () => {
	const { cpu } = useCPUStore();
	const { motherboard } = useMotherboardStore();
	const { gpu } = useGPUStore();
	const { memory } = useMemoryStore();
	const { powerSupply } = usePowerSupplyStore();

	const ss = useCalculatePowerRequirement();
	console.log(ss);

	return (
		<section>
			<div className="flex justify-center text-center text-2xl">Итог</div>
			<div className="text-lg">
				<div className="">Характеристики</div>
				<div className="flex justify-between mx-20">
					<div>Процессор</div>
					<div>{cpu !== null ? <div>{cpu.name}</div> : <></>}</div>
				</div>
				<div className="flex justify-between mx-20">
					<div>Материнская плата</div>
					<div>
						{motherboard !== null ? <div>{motherboard.name}</div> : <></>}
					</div>
				</div>
				<div className="flex justify-between mx-20">
					<div>Видеокарта</div>
					<div>{gpu !== null ? <div>{gpu.name}</div> : <></>}</div>
				</div>
				<div className="flex justify-between mx-20">
					<div>Модули Памяти:</div>
					<div>{memory !== null ? <div>{memory.name}</div> : <></>}</div>
				</div>
				<div className="flex justify-between mx-20">
					<div>Блок питания:</div>
					<div>
						{powerSupply !== null ? <div>{powerSupply.name}</div> : <></>}
					</div>
				</div>
				<div className="flex justify-between mx-20">
					<div>Требуемая мощность блока питания:</div>
					<div>{ss !== null ? <div>{ss.result} ВТ</div> : <></>}</div>
				</div>
			</div>
		</section>
	);
};

export default Summary;
