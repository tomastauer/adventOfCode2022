export function isBetween(
	value: unknown,
	lowerBound: number,
	upperBound: number,
) {
	const n = Number(value);
	return n >= lowerBound && n <= upperBound;
}

export function range(from: number, to: number) {
	return new Array(to - from + 1).fill(0).map((_, i) => i + from);
}
