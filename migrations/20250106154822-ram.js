module.exports = {
	async up(db) {
		return db.collection('ram').insertMany([
			{
				id: '1',
				img: '',
				name: 'Оперативная память Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200',
				Manufacturer: 'Corsair',
				Capacity: '16',
				Speed: '3200 МHz',
				Type: 'DDR4',
				Latency: 'CL16',
				Voltage: '1.35V',
				Modules: '2x8GB',
				price: '15999',
				powerConsumption: '7',
			},
			{
				id: '2',
				img: '',
				name: 'Оперативная память Kingston HyperX Fury 8GB DDR4-2666',
				Manufacturer: 'Kingston',
				Capacity: '8',
				Speed: '2666 МHz',
				Type: 'DDR4',
				Latency: 'CL15',
				Voltage: '1.2V',
				Modules: '1x8GB',
				price: '8499',
				powerConsumption: '4',
			},
			{
				id: '3',
				img: '',
				name: 'Оперативная память G.Skill Ripjaws V 16GB (2x8GB) DDR4-3600',
				Manufacturer: 'G.Skill',
				Capacity: '16',
				Speed: '3600 МHz',
				Type: 'DDR4',
				Latency: 'CL18',
				Voltage: '1.35V',
				Modules: '2x8GB',
				price: '17999',
				powerConsumption: '7',
			},
			{
				id: '4',
				img: '',
				name: 'Оперативная память TeamGroup T-Force Vulcan 32GB (2x16GB) DDR4-3200',
				Manufacturer: 'TeamGroup',
				Capacity: '32',
				Speed: '3200 МHz',
				Type: 'DDR4',
				Latency: 'CL16',
				Voltage: '1.35V',
				Modules: '2x16GB',
				price: '29999',
				powerConsumption: '15',
			},
			{
				id: '5',
				img: '',
				name: 'Оперативная память Crucial Ballistix 16GB (2x8GB) DDR4-3000',
				Manufacturer: 'Crucial',
				Capacity: '16',
				Speed: '3000 МHz',
				Type: 'DDR4',
				Latency: 'CL15',
				Voltage: '1.35V',
				Modules: '2x8GB',
				price: '14999',
				powerConsumption: '7',
			},
			{
				id: '6',
				img: '',
				name: 'Оперативная память ADATA XPG Spectrix D60G 8GB DDR4-3200',
				Manufacturer: 'ADATA',
				Capacity: '8',
				Speed: '3200 МHz',
				Type: 'DDR4',
				Latency: 'CL16',
				Voltage: '1.35V',
				Modules: '1x8GB',
				price: '9999',
				powerConsumption: '4',
			},
			{
				id: '7',
				img: '',
				name: 'Оперативная память Samsung 16GB DDR4-2666',
				Manufacturer: 'Samsung',
				Capacity: '16',
				Speed: '2666 МHz',
				Type: 'DDR4',
				Latency: 'CL19',
				Voltage: '1.2V',
				Modules: '1x16GB',
				price: '13999',
				powerConsumption: '5',
			},
			{
				id: '8',
				img: '',
				name: 'Оперативная память Patriot Viper Steel 32GB (2x16GB) DDR4-3600',
				Manufacturer: 'Patriot',
				Capacity: '32',
				Speed: '3600 МHz',
				Type: 'DDR4',
				Latency: 'CL18',
				Voltage: '1.35V',
				Modules: '2x16GB',
				price: '31999',
				powerConsumption: '15',
			},
			{
				id: '9',
				img: '',
				name: 'Оперативная память Corsair Dominator Platinum RGB 64GB (2x32GB) DDR4-3200',
				Manufacturer: 'Corsair',
				Capacity: '64',
				Speed: '3200 МHz',
				Type: 'DDR4',
				Latency: 'CL16',
				Voltage: '1.35V',
				Modules: '2x32GB',
				price: '59999',
				powerConsumption: '30',
			},
			{
				id: '10',
				img: '',
				name: 'Оперативная память Kingston HyperX Predator 32GB (2x16GB) DDR4-2933',
				Manufacturer: 'Kingston',
				Capacity: '32',
				Speed: '2933 МHz',
				Type: 'DDR4',
				Latency: 'CL17',
				Voltage: '1.35V',
				Modules: '2x16GB',
				price: '28999',
				powerConsumption: '15',
			},
			{
				id: '11',
				img: '',
				name: 'Оперативная память Corsair Vengeance DDR5 16GB (2x8GB) DDR5-5200',
				Manufacturer: 'Corsair',
				Capacity: '16',
				Speed: '5200 МHz',
				Type: 'DDR5',
				Latency: 'CL40',
				Voltage: '1.1V',
				Modules: '2x8GB',
				price: '21999',
				powerConsumption: '7',
			},
			{
				id: '12',
				img: '',
				name: 'Оперативная память Kingston FURY Beast 32GB (2x16GB) DDR5-6000',
				Manufacturer: 'Kingston',
				Capacity: '32',
				Speed: '6000 МHz',
				Type: 'DDR5',
				Latency: 'CL40',
				Voltage: '1.1V',
				Modules: '2x16GB',
				price: '35999',
				powerConsumption: '13',
			},
			{
				id: '13',
				img: '',
				name: 'Оперативная память G.Skill Ripjaws S5 32GB (2x16GB) DDR5-6000',
				Manufacturer: 'G.Skill',
				Capacity: '32',
				Speed: '6000 МHz',
				Type: 'DDR5',
				Latency: 'CL40',
				Voltage: '1.1V',
				Modules: '2x16GB',
				price: '34999',
				powerConsumption: '13',
			},
		]);
	},

	async down(db) {
		return db.collection('ram').updateMany([]);
	},
};