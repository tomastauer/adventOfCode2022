export function groupBy<T>(
	items: T[],
	selector: (item: T) => string | number,
): { [key: string]: T[] } {
	return items.reduce((agg: { [key: string]: T[] }, curr) => {
		const s = selector(curr);
		(agg[s] = agg[s] || []).push(curr);
		return agg;
	}, {});
}

export function numberRange(start: number, length: number) {
	return Array.from({ length }, (_, i) => i + start);
}

export function getMaxKey(input: Record<string, unknown>) {
	return Math.max(...Object.keys(input).map((e) => parseInt(e)));
}

export function findMostOftenItem(items: (string | number)[]) {
	const grouped = groupBy(items, (item) => item);
	const groupedByLength = groupBy(
		Object.values(grouped),
		(item) => item.length,
	);
	const maxKey = getMaxKey(groupedByLength);

	return {
		item: groupedByLength[maxKey][0][0],
		occurrences: maxKey,
	};
}

export function areAllItemsSame<T>(items: T[]) {
	return Array.from(new Set(items)).length === 1;
}

export function sum(items: number[]) {
	return items.reduce((agg, curr) => agg + curr, 0);
}
