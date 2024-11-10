export interface CPUItem {
	id: string;
	img: string;
	name: string;
	TDP: string;
	score: string;
	price: string;
	baseClock: string; // базовая частота
	boostClock: string; // максимальная частота
	cores: string; // количество ядер
	threads: string; // количество потоков
	cache: string; // кэш-память
	socket: string; // сокет процессора
	manufacturer: string;
}
