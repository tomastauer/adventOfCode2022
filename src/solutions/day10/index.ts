import { Solution } from '../../utilities/solver.ts';

export default class Day10 implements Solution {
	solvePart1(input: string[]) {
		let tick = 1;
		let registry = 1;
		const tickRegistry: number[] = [1];
		input.forEach((i) => {
			if (i === 'noop') {
				tickRegistry.push(registry);
				tick++;
			} else {
				tickRegistry.push(registry, registry);
				tick++;
				tick++;
				registry += parseInt(i.split(' ')[1]);
			}
		});

		tickRegistry.push(registry);

		return [20, 60, 100, 140, 180, 220].reduce(
			(agg, curr) => agg += curr * tickRegistry[curr],
			0,
		);
	}

	solvePart2(input: string[]) {
		let tick = 1;
		let registry = 1;
		const tickRegistry: number[] = [1];
		input.forEach((i) => {
			if (i === 'noop') {
				tickRegistry.push(registry);
				tick++;
			} else {
				tickRegistry.push(registry, registry);
				tick++;
				tick++;
				registry += parseInt(i.split(' ')[1]);
			}
		});

		tickRegistry.push(registry);

		const crtRegistry = new Array(240).fill(' ');
		for (let i = 0; i < 240; i++) {
			if (
				tickRegistry[i + 1] === i % 40 ||
				tickRegistry[i + 1] === i % 40 - 1 ||
				tickRegistry[i + 1] === i % 40 + 1
			) {
				crtRegistry[i] = '█';
			}
		}

		for (let i = 0; i < 240; i = i + 40) {
			console.log(crtRegistry.slice(i, i + 40).join(''));
		}

		return 0;
	}
}
