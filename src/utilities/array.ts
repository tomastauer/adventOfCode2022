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

export function addBorder(array: number[][], borderValue: number) {
	const result: number[][] = [];
	for(let y = 0; y < array.length+2;y++) {
		const line = [borderValue];
		for(let x = 0; x < array[0].length; x++) {
			if(y === 0 || y === array.length+1) {
				line.push(borderValue);
			} else {
				line.push(array[y-1][x]);
			}
		}
		line.push(borderValue);
		result.push(line);
	}

	return result;
}