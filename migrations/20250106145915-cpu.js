module.exports = {
	async up(db) {
		return db.collection('cpu').insertMany([
			{
				id: '1',
				img: '',
				name: 'Процессор AMD Ryzen Threadripper PRO 5995WX OEM',
				TDP: '280',
				score: '95',
				price: '599999',
				baseClock: '2.7 GHz',
				boostClock: '4.5 GHz',
				cores: '64',
				threads: '128',
				cache: '256 MB',
				socket: 'sWRX8',
				manufacturer: 'AMD',
			},
			{
				id: '2',
				img: '',
				name: 'Процессор Intel Core i9-14900KS OEM',
				TDP: '253',
				score: '92',
				price: '88999',
				baseClock: '3.2 GHz',
				boostClock: '6.0 GHz',
				cores: '24 (8P + 16E)',
				threads: '32',
				cache: '36 MB',
				socket: 'LGA1700',
				manufacturer: 'Intel',
			},
			{
				id: '3',
				img: '',
				name: 'Процессор Intel Core i9-14940X OEM',
				TDP: '165',
				score: '90',
				price: '87999',
				baseClock: '3.0 GHz',
				boostClock: '5.8 GHz',
				cores: '18',
				threads: '36',
				cache: '24.75 MB',
				socket: 'LGA2066',
				manufacturer: 'Intel',
			},
			{
				id: '4',
				img: '',
				name: 'Процессор AMD Ryzen 9 9950X OEM',
				TDP: '170',
				score: '88',
				price: '86999',
				baseClock: '3.4 GHz',
				boostClock: '5.2 GHz',
				cores: '16',
				threads: '32',
				cache: '64 MB',
				socket: 'AM5',
				manufacturer: 'AMD',
			},
			{
				id: '5',
				img: '',
				name: 'Процессор Intel Core i9-14900K BOX',
				TDP: '253',
				score: '87',
				price: '75999',
				baseClock: '3.2 GHz',
				boostClock: '5.9 GHz',
				cores: '24 (8P + 16E)',
				threads: '32',
				cache: '36 MB',
				socket: 'LGA1700',
				manufacturer: 'Intel',
			},
			{
				id: '6',
				img: '',
				name: 'Процессор Intel Core i9-13900K BOX',
				TDP: '253',
				score: '85',
				price: '70299',
				baseClock: '3.0 GHz',
				boostClock: '5.8 GHz',
				cores: '24 (8P + 16E)',
				threads: '32',
				cache: '36 MB',
				socket: 'LGA1700',
				manufacturer: 'Intel',
			},
			{
				id: '7',
				img: '',
				name: 'Процессор AMD Ryzen 9 7950X3D OEM',
				TDP: '120',
				score: '84',
				price: '68799',
				baseClock: '4.2 GHz',
				boostClock: '5.7 GHz',
				cores: '16',
				threads: '32',
				cache: '128 MB',
				socket: 'AM5',
				manufacturer: 'AMD',
			},
			{
				id: '8',
				img: '',
				name: 'Процессор AMD Ryzen 7 7800X3D 4.2(5.0)GHz 96MB sAM5 BOX',
				TDP: '120',
				score: '80',
				price: '64999',
				baseClock: '4.2 GHz',
				boostClock: '5.0 GHz',
				cores: '8',
				threads: '16',
				cache: '96 MB',
				socket: 'AM5',
				manufacturer: 'AMD',
			},
			{
				id: '9',
				img: '',
				name: 'Процессор AMD Ryzen 9 7900X OEM',
				TDP: '120',
				score: '82',
				price: '64999',
				baseClock: '4.7 GHz',
				boostClock: '5.6 GHz',
				cores: '12',
				threads: '24',
				cache: '76 MB',
				socket: 'AM5',
				manufacturer: 'AMD',
			},
			{
				id: '10',
				img: '',
				name: 'Процессор Intel Xeon W9-3495X OEM',
				TDP: '350',
				score: '96',
				price: '649999',
				baseClock: '1.9 GHz',
				boostClock: '4.8 GHz',
				cores: '56',
				threads: '112',
				cache: '105 MB',
				socket: 'LGA4677',
				manufacturer: 'Intel',
			},
			{
				id: '11',
				img: '',
				name: 'Процессор AMD EPYC 9654P OEM',
				TDP: '360',
				score: '98',
				price: '519999',
				baseClock: '2.4 GHz',
				boostClock: '3.7 GHz',
				cores: '96',
				threads: '192',
				cache: '384 MB',
				socket: 'SP5',
				manufacturer: 'AMD',
			},
			{
				id: '12',
				img: '',
				name: 'Процессор Intel Core i7-14700K BOX',
				TDP: '253',
				score: '85',
				price: '51999',
				baseClock: '3.4 GHz',
				boostClock: '5.6 GHz',
				cores: '20 (8P + 12E)',
				threads: '28',
				cache: '33 MB',
				socket: 'LGA1700',
				manufacturer: 'Intel',
			},
			{
				id: '13',
				img: '',
				name: 'Процессор AMD Ryzen 7 7700X BOX',
				TDP: '105',
				score: '81',
				price: '38999',
				baseClock: '4.5 GHz',
				boostClock: '5.4 GHz',
				cores: '8',
				threads: '16',
				cache: '40 MB',
				socket: 'AM5',
				manufacturer: 'AMD',
			},
			{
				id: '14',
				img: '',
				name: 'Процессор Intel Xeon Platinum 8480+ OEM',
				TDP: '300',
				score: '97',
				price: '599999',
				baseClock: '2.0 GHz',
				boostClock: '3.7 GHz',
				cores: '60',
				threads: '120',
				cache: '112.5 MB',
				socket: 'LGA4677',
				manufacturer: 'Intel',
			},
			{
				id: '15',
				img: '',
				name: 'Процессор AMD Ryzen 5 7600 BOX',
				TDP: '65',
				score: '78',
				price: '25999',
				baseClock: '3.8 GHz',
				boostClock: '5.1 GHz',
				cores: '6',
				threads: '12',
				cache: '38 MB',
				socket: 'AM5',
				manufacturer: 'AMD',
			},
		]);
	},

	async down(db) {
		return db.collection('cpu').updateMany([]);
	},
};
