import { Solution } from '../../utilities/solver.ts';

type Position = {
	x: number;
	y: number;
};

export default class Day23 implements Solution {
	directions = ['n', 's', 'w', 'e'] as const;

	solvePart1(input: string[]) {
		let positions = new Map<string, Position>();

		for (let y = 0; y < input.length; y++) {
			for (let x = 0; x < input[y].length; x++) {
				if (input[y][x] === '#') {
					positions.set(`${x},${y}`, { x, y });
				}
			}
		}

		let currentDirection: typeof this.directions[number] = 'n';

		for (let i = 0; i < 10; i++) {
			const potentialNewPositions = Array.from(positions.values()).map(
				(p) => {
					if (this.isIsolated(p, positions)) {
						return { from: { ...p }, to: { ...p } };
					}

					const nextDir = this.getNextDirection(
						p,
						positions,
						currentDirection as typeof this.directions[number],
					);
					switch (nextDir) {
						case 'n':
							return {
								from: { ...p },
								to: { x: p.x, y: p.y - 1 },
							};
						case 'e':
							return {
								from: { ...p },
								to: { x: p.x + 1, y: p.y },
							};
						case 'w':
							return {
								from: { ...p },
								to: { x: p.x - 1, y: p.y },
							};
						case 's':
							return {
								from: { ...p },
								to: { x: p.x, y: p.y + 1 },
							};
						default:
							return { from: { ...p }, to: { ...p } };
					}
				},
			).reduce(
				(agg, curr) => {
					const toSerialized = `${curr.to.x},${curr.to.y}`;
					(agg[toSerialized] = agg[toSerialized] ?? []).push(curr);
					return agg;
				},
				{} as Record<
					string,
					{
						from: { x: number; y: number };
						to: { x: number; y: number };
					}[]
				>,
			);

			positions = Object.values(potentialNewPositions).reduce(
				(agg, curr) => {
					if (curr.length > 1) {
						curr.forEach((c) => {
							agg.set(`${c.from.x},${c.from.y}`, c.from);
						});
					} else {
						agg.set(`${curr[0].to.x},${curr[0].to.y}`, curr[0].to);
					}

					return agg;
				},
				new Map<string, Position>(),
			);

			currentDirection = this.directions[
				(this.directions.indexOf(currentDirection) + 1) %
				this.directions.length
			];
		}

		const arr = Array.from(positions.values());
		const xs = arr.map((p) => p.x);
		const ys = arr.map((p) => p.y);

		const minY = Math.min(...ys);
		const maxY = Math.max(...ys);
		const minX = Math.min(...xs);
		const maxX = Math.max(...xs);

		return (Math.abs(maxY - minY) + 1) * (Math.abs(maxX - minX) + 1) -
			positions.size;
	}

	getNextDirection(
		{ x, y }: Position,
		positions: Map<string, Position>,
		currentDirection: typeof this.directions[number],
	) {
		const adjacent = {
			n: [{ x: x - 1, y: y - 1 }, { x, y: y - 1 }, {
				x: x + 1,
				y: y - 1,
			}],
			w: [{ x: x - 1, y: y - 1 }, { x: x - 1, y }, {
				x: x - 1,
				y: y + 1,
			}],
			s: [{ x: x - 1, y: y + 1 }, { x, y: y + 1 }, {
				x: x + 1,
				y: y + 1,
			}],
			e: [{ x: x + 1, y: y - 1 }, { x: x + 1, y }, {
				x: x + 1,
				y: y + 1,
			}],
		};

		for (let d = 0; d < 4; d++) {
			const dir = this.directions[
				(this.directions.indexOf(currentDirection) + d) % 4
			];

			if (adjacent[dir].every((p) => !positions.has(`${p.x},${p.y}`))) {
				return dir;
			}
		}

		return null;
	}

	isIsolated({ x, y }: Position, positions: Map<string, Position>) {
		const adjacent = [
			{ x: x + 1, y },
			{ x: x + 1, y: y + 1 },
			{ x: x + 1, y: y - 1 },
			{ x, y: y + 1 },
			{ x, y: y - 1 },
			{ x: x - 1, y },
			{ x: x - 1, y: y + 1 },
			{ x: x - 1, y: y - 1 },
		];
		return adjacent.every((p) => !positions.has(`${p.x},${p.y}`));
	}

	solvePart2(input: string[]) {
		let positions = new Map<string, Position>();

		for (let y = 0; y < input.length; y++) {
			for (let x = 0; x < input[y].length; x++) {
				if (input[y][x] === '#') {
					positions.set(`${x},${y}`, { x, y });
				}
			}
		}

		let currentDirection: typeof this.directions[number] = 'n';

		for (let i = 0; i < 10000; i++) {
			const potentialNewPositions = Array.from(positions.values()).map(
				(p) => {
					if (this.isIsolated(p, positions)) {
						return { from: { ...p }, to: { ...p } };
					}

					const nextDir = this.getNextDirection(
						p,
						positions,
						currentDirection as typeof this.directions[number],
					);
					switch (nextDir) {
						case 'n':
							return {
								from: { ...p },
								to: { x: p.x, y: p.y - 1 },
							};
						case 'e':
							return {
								from: { ...p },
								to: { x: p.x + 1, y: p.y },
							};
						case 'w':
							return {
								from: { ...p },
								to: { x: p.x - 1, y: p.y },
							};
						case 's':
							return {
								from: { ...p },
								to: { x: p.x, y: p.y + 1 },
							};
						default:
							return { from: { ...p }, to: { ...p } };
					}
				},
			).reduce(
				(agg, curr) => {
					const toSerialized = `${curr.to.x},${curr.to.y}`;
					(agg[toSerialized] = agg[toSerialized] ?? []).push(curr);
					return agg;
				},
				{} as Record<
					string,
					{
						from: { x: number; y: number };
						to: { x: number; y: number };
					}[]
				>,
			);

			positions = Object.values(potentialNewPositions).reduce(
				(agg, curr) => {
					if (curr.length > 1) {
						curr.forEach((c) => {
							agg.set(`${c.from.x},${c.from.y}`, c.from);
						});
					} else {
						agg.set(`${curr[0].to.x},${curr[0].to.y}`, curr[0].to);
					}

					return agg;
				},
				new Map<string, Position>(),
			);

			currentDirection = this.directions[
				(this.directions.indexOf(currentDirection) + 1) %
				this.directions.length
			];

			if (
				Array.from(positions.values()).every((p) =>
					this.isIsolated(p, positions)
				)
			) {
				return i + 2;
			}
		}

		return 0;
	}
}
