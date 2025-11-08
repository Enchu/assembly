export interface RAMItem {
	id: string;
	img: string;
	name: string;
	Manufacturer: string; // Производитель
	Capacity: string; // Объем памяти, например, "32GB"
	Speed: string; // Скорость, например, "2933 МHz"
	Type: string; // Тип памяти, например, "DDR4"
	Latency: string; // Латентность, например, "CL17"
	Voltage: string; // Напряжение, например, "1.35V"
	Modules: string; // Конфигурация модулей, например, "2x16GB"
	price: string; // Цена, например, "28999"
	powerConsumption: string;
}
