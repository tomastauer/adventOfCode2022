import { Solution } from '../../utilities/solver.ts';

export default class Day07 implements Solution {
	solvePart1(input: string[]) {
		const positions = input[0].split(',').map((c) => parseInt(c));
		const min = Math.min(...positions);
		const max = Math.max(...positions);

		const map: Record<number, number> = {};

		for (let i = min; i <= max; i++) {
			map[i] = positions.reduce((a, c) => a + Math.abs(c - i), 0);
		}

		return Math.min(...Object.values(map));
	}

	solvePart2(input: string[]) {
		const positions = input[0].split(',').map((c) => parseInt(c));
		const min = Math.min(...positions);
		const max = Math.max(...positions);

		const map: Record<number, number> = {};

		for (let i = min; i <= max; i++) {
			map[i] = positions.reduce(
				(a, c) => a + (Math.abs(c - i) * (Math.abs(c - i) + 1)) / 2,
				0
			);
		}

		return Math.min(...Object.values(map));
	}
}
