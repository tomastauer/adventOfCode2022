import { Solution } from '../../utilities/solver.ts';

export default class Day02 implements Solution {
	solvePart1(input: string[]) {
		let x = 0;
		let depth = 0;

		input
			.map((i) => {
				const [command, distance] = i.split(' ');
				return { command, distance: parseInt(distance) };
			})
			.forEach((c) => {
				if (c.command === 'forward') {
					x += c.distance;
				}

				if (c.command === 'down') {
					depth += c.distance;
				}

				if (c.command === 'up') {
					depth -= c.distance;
				}
			});

		return x * depth;
	}

	solvePart2(input: string[]) {
		let x = 0;
		let depth = 0;
		let aim = 0;

		input
			.map((i) => {
				const [command, distance] = i.split(' ');
				return { command, distance: parseInt(distance) };
			})
			.forEach((c) => {
				if (c.command === 'forward') {
					x += c.distance;
					depth += aim * c.distance;
				}

				if (c.command === 'down') {
					aim += c.distance;
				}

				if (c.command === 'up') {
					aim -= c.distance;
				}
			});

		return x * depth;
	}
}
