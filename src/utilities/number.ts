export function isBetween(
	value: unknown,
	lowerBound: number,
	upperBound: number,
) {
	const n = Number(value);
	return n >= lowerBound && n <= upperBound;
}
