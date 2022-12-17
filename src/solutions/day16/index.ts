import { Solution } from '../../utilities/solver.ts';

type Valve = {
	valve: string;
	rate: number;
	leadsTo: string[];
};

type VisitedPath = {
	valve: string;
	time: number;
	currentFlow: number;
	totalFlow: number;
};

type Path = {
	visited: string[];
	visitedPaths: VisitedPath[];
	pressures: number[];
	currentFlow: number;
	totalFlow: number;
	time: number;
};

type Paths = {
	from: string;
	to: Record<string, number>;
};

export default class Day15 implements Solution {
	private regexp =
		/Valve (?<valve>\w+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<leadsTo>[\w\, ]+)/gm;

	solvePart1(input: string[]) {
		const valves = input.map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			return {
				valve: groups['valve'],
				rate: parseInt(groups['rate']),
				leadsTo: groups['leadsTo'].split(', '),
			};
		}).reduce((agg, curr) => {
			agg[curr.valve] = curr;
			return agg;
		}, {} as Record<string, Valve>);

		const map = Object.values(valves).reduce((agg, curr) => {
			if (!curr.rate && curr.valve !== 'AA') {
				return agg;
			}
			agg[curr.valve] = this.bfs(curr.valve, valves);
			return agg;
		}, {} as Record<string, Record<string, number>>);

		const r = this.go('AA', valves, map, {
			currentFlow: 0,
			totalFlow: 0,
			time: 0,
			visited: [],
			visitedPaths: [],
			pressures: [],
		});

		r.forEach((r) => {
			if (r.pressures.length < 30) {
				r.pressures.push(
					...new Array(30 - r.pressures.length).fill(r.currentFlow),
				);
			}
			r.totalFlow = r.pressures.slice(0, 30).reduce((a, b) => a + b, 0);
		});

		return r.sort((a, b) => b.totalFlow - a.totalFlow)[0].totalFlow;
	}

	bfs(root: string, all: Record<string, Valve>) {
		const queue: { valve: string; time: number }[] = [];
		let c: { valve: string; time: number } | undefined = {
			valve: root,
			time: 0,
		};
		const result: Record<string, number> = {};

		while (c) {
			result[c.valve] = c.time;

			queue.push(
				...all[c.valve].leadsTo.filter((q) =>
					!Object.keys(result).includes(q)
				).map((q) => ({ valve: q, time: c!.time + 1 })),
			);
			c = queue.shift();
		}

		return result;
	}

	go(
		current: string,
		all: Record<string, Valve>,
		map: Record<string, Record<string, number>>,
		path: Path,
	): Path[] {
		const toVisit = Object.values(all).filter((a) =>
			a.rate && !path.visited.includes(a.valve)
		);

		if (path.time >= 30 || !toVisit.length) {
			return [path];
		}

		return toVisit.map((t) => {
			const pathCopy = {
				...path,
				visited: [...path.visited, t.valve],
				visitedPaths: [...path.visitedPaths],
				pressures: [...path.pressures],
			};

			const pathLength = map[current][t.valve];
			pathCopy.time += map[current][t.valve] + 1;
			pathCopy.totalFlow += (pathLength + 1) * pathCopy.currentFlow;
			pathCopy.pressures.push(
				...new Array(pathLength + 1).fill(pathCopy.currentFlow),
			);
			pathCopy.currentFlow += all[t.valve].rate;

			pathCopy.visitedPaths.push({
				valve: t.valve,
				time: pathCopy.time,
				currentFlow: pathCopy.currentFlow,
				totalFlow: pathCopy.totalFlow,
			});

			return this.go(t.valve, all, map, pathCopy);
		}).flat();
	}

	solvePart2(input: string[]) {
		const valves = input.map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			return {
				valve: groups['valve'],
				rate: parseInt(groups['rate']),
				leadsTo: groups['leadsTo'].split(', '),
			};
		}).reduce((agg, curr) => {
			agg[curr.valve] = curr;
			return agg;
		}, {} as Record<string, Valve>);

		const map = Object.values(valves).reduce((agg, curr) => {
			if (!curr.rate && curr.valve !== 'AA') {
				return agg;
			}
			agg[curr.valve] = this.bfs(curr.valve, valves);
			return agg;
		}, {} as Record<string, Record<string, number>>);

		const r = this.go('AA', valves, map, {
			currentFlow: 0,
			totalFlow: 0,
			time: 0,
			visited: [],
			visitedPaths: [],
			pressures: [],
		});

		const allPaths = r.map((p) => p.visitedPaths);

		const bestPressures: Record<string, number> = {};

		let counter = 1;

		while (true) {
			console.log('counter is', counter);

			allPaths.forEach((a) => {
				const firstN = a.slice(0, counter);
				const key = firstN.map((f) => f.valve).sort((a, b) =>
					a.localeCompare(b)
				).join('|');

				const lastValve = firstN.findLast((f) => f.time <= 26)!;
				const totalPressure = lastValve.totalFlow +
					(lastValve.time >= 26
						? 0
						: (26 - lastValve.time) * lastValve.currentFlow);

				if (!bestPressures[key] || bestPressures[key] < totalPressure) {
					bestPressures[key] = totalPressure;
				}
			});

			counter++;
			if (!allPaths.some((a) => a.length >= counter)) {
				break;
			}
		}

		let bestPressure = 0;

		Object.entries(bestPressures).sort((a, b) => a[0].localeCompare(b[0]))
			.forEach(([key, pressure], i, arr) => {
				const keys = key.split('|');
				const pairs = arr.filter(([otherKey]) =>
					otherKey.split('|').every((k) => !keys.includes(k))
				);

				pairs.forEach(([, otherPressure]) => {
					if ((pressure + otherPressure) > bestPressure) {
						bestPressure = pressure + otherPressure;
					}
				});
			}, {} as Record<string, number>);

		return bestPressure;
	}
}
