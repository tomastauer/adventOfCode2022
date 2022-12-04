import { numberRange } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		return input.reduce((agg, curr) => {
			const [left, right] = curr.split(',').map((c) =>
				c.split('-').map((d) => parseInt(d))
			);

			return agg +
				((left[0] <= right[0] && left[1] >= right[1]) ||
						(right[0] <= left[0] && right[1] >= left[1])
					? 1
					: 0);
		}, 0);
	}

	solvePart2(input: string[]) {
		return input.reduce((agg, curr) => {
			const [left, right] = curr.split(',').map((c) => {
				const [lower, upper] = c.split('-').map((d) => parseInt(d));
				return numberRange(lower, upper - lower + 1);
			});

			return agg + (left.some((l) => right.includes(l)) ? 1 : 0);
		}, 0);
	}
}
