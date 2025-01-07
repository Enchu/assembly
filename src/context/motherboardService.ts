import { fetchMotherboardsFromAPI } from '@/lib/utils/common';
import { useMotherboardApiStore } from '@/store/motherboardStore';

export const fetchMotherboards = async () => {
	const { setMotherboards, setLoading, setError } =
		useMotherboardApiStore.getState();

	setLoading(true);
	setError(null);

	try {
		const data = await fetchMotherboardsFromAPI();
		setMotherboards(data);
	} catch (err) {
		setError((err as Error).message);
	} finally {
		setLoading(false);
	}
};
