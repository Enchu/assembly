module.exports = {
	async up(db) {
		return db.collection('gpu').insertMany([
			{
				id: '1',
				img: '',
				name: 'Видеокарта MSI GeForce RTX 4090 GAMING X TRIO',
				Manufacturer: 'NVIDIA',
				TDP: '450',
				Memory: '24',
				MemoryBus: '384-bit',
				MemoryType: 'GDDR6X',
				CoreClock: '2235 MHz',
				Performance: '35.8',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '850',
				score: '',
				price: '270999',
			},
			{
				id: '2',
				img: '',
				name: 'Видеокарта GIGABYTE GeForce RTX 4080 SUPER GAMING OC',
				Manufacturer: 'NVIDIA',
				TDP: '320',
				Memory: '16',
				MemoryBus: '256-bit',
				MemoryType: 'GDDR6X',
				CoreClock: '2205 MHz',
				Performance: '29.7',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '850',
				score: '',
				price: '151999',
			},
			{
				id: '3',
				img: '',
				name: 'Видеокарта Colorful GeForce RTX 4070 Ti SUPER iGame Vulcan W OC',
				Manufacturer: 'NVIDIA',
				TDP: '285',
				Memory: '16',
				MemoryBus: '256-bit',
				MemoryType: 'GDDR6X',
				CoreClock: '2310 MHz',
				Performance: '23.8',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '750',
				score: '',
				price: '125499',
			},
			{
				id: '4',
				img: '',
				name: 'Видеокарта KFA2 GeForce RTX 4080 SG',
				Manufacturer: 'NVIDIA',
				TDP: '320',
				Memory: '16',
				MemoryBus: '256-bit',
				MemoryType: 'GDDR6X',
				CoreClock: '2205 MHz',
				Performance: '29.7',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '750',
				score: '',
				price: '114999',
			},
			{
				id: '5',
				img: '',
				name: 'Видеокарта Palit GeForce RTX 4070 Ti GameRock OC',
				Manufacturer: 'NVIDIA',
				TDP: '285',
				Memory: '12',
				MemoryBus: '192-bit',
				MemoryType: 'GDDR6X',
				CoreClock: '2310 MHz',
				Performance: '21.8',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '750',
				score: '',
				price: '99999',
			},
			{
				id: '6',
				img: '',
				name: 'Видеокарта Colorful GeForce RTX 4070 SUPER iGame Loong Edition OC',
				Manufacturer: 'NVIDIA',
				TDP: '200',
				Memory: '12',
				MemoryBus: '192-bit',
				MemoryType: 'GDDR6X',
				CoreClock: '2310 MHz',
				Performance: '21.8',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '650',
				score: '',
				price: '89999',
			},
			{
				id: '7',
				img: '',
				name: 'Видеокарта GIGABYTE GeForce RTX 4070 AERO OC 12G',
				Manufacturer: 'NVIDIA',
				TDP: '200',
				Memory: '12',
				MemoryBus: '192-bit',
				MemoryType: 'GDDR6X',
				CoreClock: '2310 MHz',
				Performance: '21.8',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '650',
				score: '',
				price: '84499',
			},
			{
				id: '8',
				img: '',
				name: 'Видеокарта GIGABYTE GeForce RTX 4060 Ti AERO OC',
				Manufacturer: 'NVIDIA',
				TDP: '160',
				Memory: '16',
				MemoryBus: '128-bit',
				MemoryType: 'GDDR6',
				CoreClock: '2535 MHz',
				Performance: '15.8',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '650',
				score: '',
				price: '64499',
			},
			{
				id: '9',
				img: '',
				name: 'Видеокарта GIGABYTE GeForce RTX 4060 AORUS ELITE',
				Manufacturer: 'NVIDIA',
				TDP: '115',
				Memory: '8',
				MemoryBus: '128-bit',
				MemoryType: 'GDDR6',
				CoreClock: '2535 MHz',
				Performance: '15.8',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '450',
				score: '',
				price: '46299',
			},
			{
				id: '10',
				img: '',
				name: 'Видеокарта Sapphire AMD Radeon RX 7900 XTX NITRO+ Vapor-X',
				Manufacturer: 'AMD',
				TDP: '420',
				Memory: '16',
				MemoryBus: '384-bit',
				MemoryType: 'GDDR6',
				CoreClock: '2450 MHz',
				Performance: '24.0',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '800',
				score: '',
				price: '129999',
			},
			{
				id: '11',
				img: '',
				name: 'Видеокарта Sapphire AMD Radeon RX 7800 XT PURE OC',
				Manufacturer: 'AMD',
				TDP: '270',
				Memory: '16',
				MemoryBus: '256-bit',
				MemoryType: 'GDDR6',
				CoreClock: '2124 MHz',
				Performance: '20.4',
				Interface: 'PCIe 4.0',
				Connectors: 'HDMI, DisplayPort',
				RecommendedPowerSupply: '700',
				score: '',
				price: '46299',
			},
		]);
	},

	async down(db) {
		return db.collection('gpu').updateMany([]);
	},
};
