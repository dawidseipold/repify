export function saveToLocalStorage(key: string, value: any) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key: string) {
	const value = localStorage.getItem(key);

	if (value) {
		try {
			return JSON.parse(value);
		} catch (error) {
			console.error('Error parsing localStorage value:', error);
		}
	}
}
