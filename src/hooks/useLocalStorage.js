import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		const item = window.localStorage.getItem(key);
		if (!item) {
			window.localStorage.setItem(key, JSON.stringify(initialValue));
			return initialValue;
		}

		try {
			return JSON.parse(item);
		} catch (error) {
			console.log(error);
			console.log(
				'Error parsing item from local storage. Deleting value',
				{
					key,
					item,
				}
			);
			window.localStorage.removeItem(key);
			console.log('Setting initial value', initialValue);
			window.localStorage.setItem(key, JSON.stringify(initialValue));
			return initialValue;
		}
	});

	function setValue(value) {
		try {
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;

			setStoredValue(valueToStore);

			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.log(error);
		}
	}

	function listener(event) {
		if (event.key === key) {
			try {
				setValue(JSON.parse(event.newValue));
			} catch (error) {
				console.log(error);
			}
		}
	}

	useEffect(() => {
		window.addEventListener('storage', listener);

		return () => {
			window.removeEventListener('storage', listener);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [storedValue, setValue];
}
