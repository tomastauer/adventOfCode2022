import { Solution } from '../../utilities/solver.ts';

export default class Day03 implements Solution {
	solvePart1(input: string[]) {
		const result = [];
		const length = input[0].length;

		for (let i = 0; i < length; i++) {
			const ones = input.map((p) => p[i]).filter((p) => p === '1');
			result.push(ones.length > input.length / 2 ? '1' : '0');
		}

		const gamma = parseInt(result.join(''), 2);
		const epsilon = (1 << length) - 1 - gamma;

		return gamma * epsilon;
	}

	solvePart2(input: string[]) {
		const length = input[0].length;

		let oxygen = [...input];
		let co2 = [...input];

		for (let i = 0; i < length; i++) {
			const ones1 = oxygen.map((p) => p[i]).filter((p) => p === '1');
			const ones2 = co2.map((p) => p[i]).filter((p) => p === '1');

			const mostCommon = ones1.length >= oxygen.length / 2 ? '1' : '0';
			const leastCommon = ones2.length >= co2.length / 2 ? '0' : '1';

			if (oxygen.length > 1) {
				oxygen = oxygen.filter((o) => o[i] === mostCommon);
			}

			if (co2.length > 1) {
				co2 = co2.filter((o) => o[i] === leastCommon);
			}
		}

		return parseInt(oxygen.join(''), 2) * parseInt(co2.join(''), 2);
	}
}
