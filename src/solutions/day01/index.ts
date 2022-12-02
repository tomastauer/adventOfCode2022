import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		return input.join('\n').split('\n\n').map((e) =>
			e.split('\n').map((e) => parseInt(e)).reduce((acc, curr) =>
				acc + curr
			)
		).sort((a, b) => b - a)[0];
	}

	solvePart2(input: string[]) {
		const snacks = input.join('\n').split('\n\n').map((e) =>
			e.split('\n').map((e) => parseInt(e)).reduce((acc, curr) =>
				acc + curr
			)
		).sort((a, b) => b - a);

		return snacks[0] + snacks[1] + snacks[2];
	}
}
