import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		return input.map((i) => parseInt(i)).filter((c, i, a) => i > 0 && c - a[i - 1] > 0).length;
	}

	solvePart2(input: string[]) {
		return input
			.map((i) => parseInt(i))
			.map((c, i, a) => (i < 2 ? 0 : c + a[i - 1] + a[i - 2]))
			.slice(2)
			.filter((c, i, a) => i > 0 && c - a[i - 1] > 0).length;
	}
}
