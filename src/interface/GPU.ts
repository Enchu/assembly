export interface RAMItem {
	id: string;
	img: string;
	name: string;
	Manufacturer: string; // Производитель
	TDP: string;
	Memory: string; // Память
	MemoryBus: string; // Шина памяти
	MemoryType: string; // Тип памяти
	CoreClock: string; // Частота графического ядра
	Performance: string; // Производительность
	Interface: string; // Интерфейс
	Connectors: string; // Разъемы
	RecommendedPowerSupply: string; // Рекомендуемая мощь блока питания
	score: string;
	price: string; //Цена
}
