import { Solution } from '../../utilities/solver.ts';

type Target = {
	fromX: number;
	toX: number;
	fromY: number;
	toY: number;
};

export default class Day17 implements Solution {
	solvePart1(input: string[]) {
		const target = this.parseInput(input[0]);
		const velocities: [number, number][] = [];
		for (let x = 1; x < target.toX; x++) {
			for (let y = 1; y < 200; y++) {
				velocities.push([x, y]);
			}
		}

		return Math.max(
			...velocities
				.map((v) => this.testVelocity(target, v))
				.filter(([result]) => result)
				.flatMap(([, pos]) => pos)
				.map(([, y]) => y)
		);
	}

	solvePart2(input: string[]) {
		const target = this.parseInput(input[0]);
		const velocities: [number, number][] = [];
		for (let x = 1; x <= target.toX; x++) {
			for (let y = target.toY; y < 200; y++) {
				velocities.push([x, y]);
			}
		}

		return velocities.map((v) => this.testVelocity(target, v)).filter(([result]) => result)
			.length;
	}

	private testVelocity(
		target: Target,
		velocity: [number, number]
	): [boolean, [number, number][]] {
		const position: [number, number] = [0, 0];
		const currentVelocity = [...velocity];
		const positions: [number, number][] = [];

		while (position[0] <= target.toX && position[1] >= target.toY) {
			if (position[0] >= target.fromX && position[1] <= target.fromY) {
				return [true, positions];
			}

			position[0] += currentVelocity[0];
			position[1] += currentVelocity[1];
			currentVelocity[0] = Math.max(0, currentVelocity[0] - 1);
			currentVelocity[1]--;
			positions.push([...position]);
		}

		return [false, []];
	}

	private parseInput(input: string): Target {
		const [, fromX, toX, fromY, toY] = /target area: x=([\d-]+)..([\d-]+), y=([\d-]+)..([\d-]+)/
			.exec(input)!
			.map((o) => parseInt(o));
		return {
			fromX: Math.min(fromX, toX),
			toX: Math.max(fromX, toX),
			fromY: Math.max(fromY, toY),
			toY: Math.min(fromY, toY)
		};
	}
}
