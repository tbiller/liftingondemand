
export function capitalize(str) {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function title(str) {
	if (!str) return '';
	const parts = str.split(' ')
	return parts.map((part) => capitalize(part)).join(' ');
}


