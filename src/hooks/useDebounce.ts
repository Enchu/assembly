import { useEffect, useState } from 'react';

export function useDebounceValue<T>(value: T, time: number = 250): T {
	const [debounceValue, setDebounce] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounce(value);
		}, time);

		return () => clearTimeout(timer);
	}, [value, time]);

	return debounceValue;
}
