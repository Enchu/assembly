import { useCPUApiStore } from '@/store/cpuStore';
import { fetchCPUsFromAPI } from '@/lib/utils/common';

export const fetchCPUs = async () => {
	const { setCPUs, setLoading, setError } = useCPUApiStore.getState();

	setLoading(true);
	setError(null);

	try {
		const data = await fetchCPUsFromAPI();
		setCPUs(data);
	} catch (err) {
		setError((err as Error).message);
	} finally {
		setLoading(false);
	}
};
