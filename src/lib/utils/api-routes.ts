import { Db, MongoClient } from 'mongodb';

export const getDbAndReqBody = async (
	clientPromise: Promise<MongoClient>,
	req: Request | null,
) => {
	const db = (await clientPromise).db(process.env.NEXT_PUBLIC_DB_NAME);

	if (req) {
		const reqBody = await req.json();
		return { db, reqBody };
	}

	return { db };
};

export const getCPU = async (db: Db, fieldName: string) => {
	const cpu = await db.collection('cpu').find().toArray();
	return cpu;
};

export const getGPU = async (db: Db, fieldName: string) => {
	const gpu = await db.collection('gpu').find().toArray();
	return gpu;
};

export const getMotherboard = async (db: Db, fieldName: string) => {
	const motherboard = await db.collection('motherboard').find().toArray();
	return motherboard;
};

export const getRAM = async (db: Db, fieldName: string) => {
	const ram = await db.collection('ram').find().toArray();
	return ram;
};

export const getPowerSupply = async (db: Db, fieldName: string) => {
	const powerSupply = await db.collection('power_supply').find().toArray();
	return powerSupply;
};
