import { Solution } from '../../utilities/solver.ts';

type Range = {
	from: number;
	to: number;
};

type Instruction = {
	state: 'on' | 'off';
	x: Range;
	y: Range;
	z: Range;
};

type Cube = {
	x: Range;
	y: Range;
	z: Range;
};

type Intersection = {
	a: Instruction;
	b: Instruction;
	i: Cube;
};

export default class Day22 implements Solution {
	solvePart1(input: string[]) {
		const instructions = input.map((i) => this.parse(i));

		const onCubes: Record<string, boolean> = {};
		instructions.forEach(({ state, x, y, z }) => {
			for (let xx = Math.max(-50, x.from); xx <= Math.min(50, x.to); xx++) {
				for (let yy = Math.max(-50, y.from); yy <= Math.min(50, y.to); yy++) {
					for (let zz = Math.max(-50, z.from); zz <= Math.min(50, z.to); zz++) {
						const serialized = this.serializePoint(xx, yy, zz);
						if (state === 'on') {
							onCubes[serialized] = true;
						} else {
							delete onCubes[serialized];
						}
					}
				}
			}
		});
		return Object.values(onCubes).length;
	}

	solvePart2(input: string[]) {
		const instructions = input.map((i) => this.parse(i));
		const toProcess = [...instructions];
		const resultCubes: Cube[] = [];

		while (toProcess.length) {
			const a = toProcess.shift()!;

			const intersecting = toProcess
				.map((b) => {
					const i = this.findIntersection(a, b);
					return i ? { a, b, i } : null;
				})
				.filter((i): i is Intersection => Boolean(i));

			if (!intersecting.length) {
				if (a.state === 'on') {
					resultCubes.push(a);
				}
			} else {
				const { a: aa, b, i } = intersecting[0];

				if (aa.state === 'on' && b.state === 'on') {
					toProcess.unshift(...this.subtract(aa, i));
				} else if (aa.state === 'on' && b.state === 'off') {
					toProcess.unshift(...this.subtract(aa, i));
				}
			}
		}

		return resultCubes.reduce(
			(agg, curr) =>
				agg +
				(Math.abs(curr.x.to - curr.x.from) + 1) *
					(Math.abs(curr.y.to - curr.y.from) + 1) *
					(Math.abs(curr.z.to - curr.z.from) + 1),
			0
		);
	}

	private parse(input: string): Instruction {
		const [_, state, fromX, toX, fromY, toY, fromZ, toZ] =
			/(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(input)!;

		return {
			state: state as 'on' | 'off',
			x: { from: parseInt(fromX), to: parseInt(toX) },
			y: { from: parseInt(fromY), to: parseInt(toY) },
			z: { from: parseInt(fromZ), to: parseInt(toZ) }
		};
	}

	private serializePoint(x: number, y: number, z: number) {
		return `${x}|${y}|${z}`;
	}

	private findIntersection(cubeA: Cube, cubeB: Cube): Cube | null {
		const x = {
			from: Math.max(cubeA.x.from, cubeB.x.from),
			to: Math.min(cubeA.x.to, cubeB.x.to)
		};
		const y = {
			from: Math.max(cubeA.y.from, cubeB.y.from),
			to: Math.min(cubeA.y.to, cubeB.y.to)
		};
		const z = {
			from: Math.max(cubeA.z.from, cubeB.z.from),
			to: Math.min(cubeA.z.to, cubeB.z.to)
		};

		if (x.from <= x.to && y.from <= y.to && z.from <= z.to) {
			return { x, y, z };
		}

		return null;
	}

	private subtract(cubeA: Cube, cubeB: Cube) {
		const takeRange = (axis: keyof Cube, i: number) => {
			const mapping = {
				0: { from: cubeA[axis].from, to: cubeB[axis].from - 1 },
				1: { from: cubeB[axis].from, to: cubeB[axis].to },
				2: { from: cubeB[axis].to + 1, to: cubeA[axis].to }
			} as Record<number, Range>;

			return mapping[i];
		};

		const cubes: Instruction[] = [];

		for (let z = 0; z < 3; z++) {
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 3; x++) {
					if (x === 1 && y === 1 && z === 1) {
						continue;
					}

					cubes.push({
						x: takeRange('x', x),
						y: takeRange('y', y),
						z: takeRange('z', z),
						state: 'on' as const
					});
				}
			}
		}

		return cubes.filter(
			(c) => c.x.to - c.x.from >= 0 && c.y.to - c.y.from >= 0 && c.z.to - c.z.from >= 0
		);
	}
}
