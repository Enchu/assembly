import { usePowerSupplyApiStore } from '@/store/power-supply';
import {
	fetchMotherboardsFromAPI,
	fetchPowerSupplysFromAPI,
} from '@/lib/utils/common';

export const fetchPowerSupplys = async () => {
	const { setPowerSupplies, setLoading, setError } =
		usePowerSupplyApiStore.getState();

	setLoading(true);
	setError(null);

	try {
		const data = await fetchPowerSupplysFromAPI();
		setPowerSupplies(data);
	} catch (err) {
		setError((err as Error).message);
	} finally {
		setLoading(false);
	}
};
