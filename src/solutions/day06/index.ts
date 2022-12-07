import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const window: string[] = [];

		for (let i = 0; i < input[0].length; i++) {
			if (window.length === 4) {
				window.shift();
			}
			window.push(input[0][i]);

			if (new Set(window).size === 4) {
				return i + 1;
			}
		}
		return 0;
	}

	solvePart2(input: string[]) {
		const window: string[] = [];

		for (let i = 0; i < input[0].length; i++) {
			if (window.length === 14) {
				window.shift();
			}
			window.push(input[0][i]);

			if (new Set(window).size === 14) {
				return i + 1;
			}
		}
		return 0;
	}
}
