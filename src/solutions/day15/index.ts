import { Solution } from '../../utilities/solver.ts';

export default class Day15 implements Solution {
	private regexp =
		/Sensor at x=(?<sx>[-\d]+), y=(?<sy>[-\d]+): closest beacon is at x=(?<bx>[-\d]+), y=(?<by>[-\d]+)/gm;

	getDistance(
		pos1: { x: number; y: number },
		pos2: { x: number; y: number },
	) {
		return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
	}

	solvePart1(input: string[]) {
		const map = input.map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			const sensor = {
				x: parseInt(groups['sx']),
				y: parseInt(groups['sy']),
			};
			const beacon = {
				x: parseInt(groups['bx']),
				y: parseInt(groups['by']),
			};

			return {
				sensor,
				beacon,
				distance: this.getDistance(sensor, beacon),
			};
		});

		const xs = [
			...map.map((c) => c.beacon.x),
			...map.map((c) => c.sensor.x),
		];
		const maxDistance = Math.max(...map.map((c) => c.distance));
		const [min, max] = [
			Math.min(...xs) - maxDistance,
			Math.max(...xs) + maxDistance,
		];

		let counter = 0;

		for (let x = min; x < max; x++) {
			const d = { x, y: 2000000 };
			if (
				map.some((m) => m.distance >= this.getDistance(d, m.sensor)) &&
				!map.some((m) => this.getDistance(d, m.beacon) === 0)
			) {
				counter++;
			}
		}

		return counter;
	}

	getBoundaries({ x, y }: { x: number; y: number }, distance: number) {
		const result = [];

		for (let i = 0; i < distance; i++) {
			result.push({ x: x + i, y: y - distance + i });
			result.push({ x: x - i, y: y + distance - i });
			result.push({ x: x - distance + i, y: y - i });
			result.push({ x: x + distance - i, y: y + i });
		}

		return result;
	}

	solvePart2(input: string[]) {
		const map = input.map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			const sensor = {
				x: parseInt(groups['sx']),
				y: parseInt(groups['sy']),
			};
			const beacon = {
				x: parseInt(groups['bx']),
				y: parseInt(groups['by']),
			};

			return {
				sensor,
				beacon,
				distance: this.getDistance(sensor, beacon),
			};
		});

		let solution: { x: number; y: number } = { x: 0, y: 0 };

		map.forEach((m) => {
			for (
				const b of this.getBoundaries(m.sensor, m.distance + 1).filter(
					(b) =>
						b.x >= 0 && b.x <= 4000000 && b.y >= 0 &&
						b.y <= 4000000,
				)
			) {
				if (
					map.every((m) => m.distance < this.getDistance(b, m.sensor))
				) {
					solution = b;
					return;
				}
			}
		});

		return solution.x * 4000000 + solution.y;
	}
}
