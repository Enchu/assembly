import { getCPU, getDbAndReqBody } from '@/lib/utils/api-routes';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
	const { db } = await getDbAndReqBody(clientPromise, null);

	return NextResponse.json(await getCPU(db, ''));
}
