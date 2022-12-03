import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		return input.reduce((agg, curr) => {
			const rucksack1 = new Set(
				curr.substring(0, curr.length / 2).split(''),
			);
			const rucksack2 = curr.substring(curr.length / 2).split('');

			const intersection = (rucksack2.find((r) =>
				rucksack1.has(r)
			)?.charCodeAt(0) ?? 0) - 96;
			return agg + (intersection > 0 ? intersection : intersection + 58);
		}, 0);
	}

	solvePart2(input: string[]) {
		return Object.values(
			input.reduce(
				(
					agg,
					curr,
					i,
				) => ((agg[Math.floor(i / 3)] = agg[Math.floor(i / 3)] ?? [])
					.push(curr),
					agg),
				{} as Record<number, string[]>,
			),
		).reduce((agg, curr) => {
			const rucksack1 = new Set(
				curr[0].split(''),
			);
			const rucksack2 = new Set(curr[1].split(''));
			const intersection = (curr[2].split('').find((c) =>
				rucksack1.has(c) && rucksack2.has(c)
			)?.charCodeAt(0) ?? 0) - 96;
			return agg + (intersection > 0 ? intersection : intersection + 58);
		}, 0);
	}
}
