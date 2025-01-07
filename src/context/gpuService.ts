import { useGPUApiStore } from '@/store/gpuStore';
import { fetchGPUsFromAPI } from '@/lib/utils/common';

export const fetchGPUs = async () => {
	const { setGPUs, setLoading, setError } = useGPUApiStore.getState();

	setLoading(true);
	setError(null);

	try {
		const data = await fetchGPUsFromAPI();
		setGPUs(data);
	} catch (err) {
		setError((err as Error).message);
	} finally {
		setLoading(false);
	}
};
