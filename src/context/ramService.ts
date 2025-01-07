import { fetchRAMsFromAPI } from '@/lib/utils/common';
import { useRAMApiStore } from '@/store/ramStore';

export const fetchRAMs = async () => {
	const { setRAMs, setLoading, setError } = useRAMApiStore.getState();

	setLoading(true);
	setError(null);

	try {
		const data = await fetchRAMsFromAPI();
		setRAMs(data);
	} catch (err) {
		setError((err as Error).message);
	} finally {
		setLoading(false);
	}
};
