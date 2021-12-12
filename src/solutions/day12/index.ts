import { groupBy } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Cave = {
	name: string;
	neighbors: Cave[];
	isBig: boolean;
};

export default class Day12 implements Solution {
	solvePart1(input: string[]) {
		const caves = this.parseInput(input);

		const paths: Cave[][] = [];
		const stack: Cave[][] = [[caves['start']]];

		while (stack.length) {
			const q = stack.pop()!;
			const last = q[q.length - 1];
			if (last.name === 'end') {
				paths.push(q);
				continue;
			}
			const newPaths = last.neighbors
				.filter((n) => n.isBig || !q.some((w) => w.name === n.name))
				.map((n) => [...q, n]);
			stack.push(...newPaths);
		}

		return paths.length;
	}

	solvePart2(input: string[]) {
		const caves = this.parseInput(input);

		const paths: Cave[][] = [];
		const stack = [{ caves: [caves['start']], containsDouble: false }];

		while (stack.length) {
			const q = stack.pop()!;
			const last = q.caves[q.caves.length - 1];
			if (last.name === 'end') {
				paths.push(q.caves);
				continue;
			}
			const newPaths = last.neighbors
				.filter(
					(n) =>
						n.name !== 'start' &&
						(n.isBig || !q.caves.some((w) => w.name === n.name) || !q.containsDouble)
				)
				.map((n) => ({
					caves: [...q.caves, n],
					containsDouble: q.containsDouble || Object.values(
						groupBy(
							[...q.caves, n].filter((l) => !l.isBig),
							(l) => l.name
						)
					).some((v) => v.length === 2)
				}));

			stack.push(...newPaths);
		}
		return paths.length;
	}

	private parseInput(input: string[]) {
		return input.reduce((a, c) => {
			const [from, to] = c.split('-');

			const fromCave = a[from] || { name: from, neighbors: [], isBig: this.isBigCave(from) };
			const toCave = a[to] || { name: to, neighbors: [], isBig: this.isBigCave(to) };

			fromCave.neighbors.push(toCave);
			toCave.neighbors.push(fromCave);

			a[from] = fromCave;
			a[to] = toCave;

			return a;
		}, {} as Record<string, Cave>);
	}

	private isBigCave(name: string) {
		return name.toLowerCase() !== name;
	}
}
