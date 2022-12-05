import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	getInitialConfig(input: string[]) {
		const [config, steps] = input.join('\n').split('\n\n');
		const crates = config.split('\n').reduce((agg, curr, index, arr) => {
			if (index === arr.length - 1) {
				return agg;
			}

			for (let i = 0; i < curr.length; i = i + 4) {
				const singleCrate = curr[i + 1];
				if (singleCrate !== ' ') {
					(agg[i / 4] = agg[i / 4] || []).push(singleCrate);
				}
			}

			return agg;
		}, [] as string[][]);

		const parsedSteps = steps.split('\n').map((s) => {
			const match =
				/move (?<howMany>\d+) from (?<from>\d+) to (?<to>\d+)/gm.exec(
					s,
				);

			return {
				howMany: parseInt(match?.groups?.howMany!),
				from: parseInt(match?.groups?.from!),
				to: parseInt(match?.groups?.to!),
			};
		});

		return { crates, parsedSteps };
	}

	solvePart1(input: string[]) {
		const { crates, parsedSteps } = this.getInitialConfig(input);

		parsedSteps.forEach((step) => {
			for (let i = 0; i < step.howMany; i++) {
				crates[step.to - 1].unshift(crates[step.from - 1].shift()!);
			}
		});

		return crates.map((c) => c[0]).join('');
	}

	solvePart2(input: string[]) {
		const { crates, parsedSteps } = this.getInitialConfig(input);

		parsedSteps.forEach((step) => {
			const tmp: string[] = [];
			for (let i = 0; i < step.howMany; i++) {
				tmp.unshift(crates[step.from - 1].shift()!);
			}

			for (let i = 0; i < step.howMany; i++) {
				crates[step.to - 1].unshift(tmp[i]);
			}
		});

		return crates.map((c) => c[0]).join('');
	}
}
