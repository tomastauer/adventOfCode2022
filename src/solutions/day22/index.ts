import { Solution } from '../../utilities/solver.ts';

type Portal = {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
	fromF: string;
	toF: string;
	id: string;
};

export default class Day22 implements Solution {
	solvePart1(input: string[]) {
		const [m, i] = input.join('\n').split('\n\n').map((i) => i.split('\n'));

		const map: string[][] = [];
		m.forEach((r) => {
			map.push(r.split(''));
		});

		const instructions = i[0].replaceAll('L', ',L,').replaceAll('R', ',R,')
			.split(',').map((c) => !['R', 'L'].includes(c) ? parseInt(c) : c);

		const start = { y: 0, x: map[0].indexOf('.') };

		const facings = ['>', 'v', '<', '^'];

		const walkthrough: { x: number; y: number; facing: string }[] = [];

		let currentFacing = '>';
		let currentPosition = start;
		let currentInstruction = instructions.shift();
		walkthrough.push({ ...currentPosition, facing: currentFacing });
		while (currentInstruction) {
			if (currentInstruction === 'R') {
				currentFacing = facings[
					(facings.indexOf(currentFacing) + 1) % facings.length
				];
				walkthrough.find((w) =>
					w.x === currentPosition.x && w.y === currentPosition.y
				)!.facing = currentFacing;
			} else if (currentInstruction === 'L') {
				currentFacing = facings[
					(facings.indexOf(currentFacing) + facings.length - 1) %
					facings.length
				];
				walkthrough.find((w) =>
					w.x === currentPosition.x && w.y === currentPosition.y
				)!.facing = currentFacing;
			} else {
				for (let i = 0; i < currentInstruction; i++) {
					let newPosition = currentPosition;
					if (currentFacing === '>') {
						newPosition = {
							x: currentPosition.x + 1,
							y: currentPosition.y,
						};
						if (
							!map[newPosition.y][newPosition.x] ||
							map[newPosition.y][newPosition.x] === ' '
						) {
							newPosition.x = map[newPosition.y].findIndex((c) =>
								c && c !== ' '
							);
						}
					} else if (currentFacing === 'v') {
						newPosition = {
							x: currentPosition.x,
							y: currentPosition.y + 1,
						};
						if (
							!map[newPosition.y] ||
							!map[newPosition.y][newPosition.x] ||
							map[newPosition.y][newPosition.x] === ' '
						) {
							newPosition.y = map.findIndex((c) =>
								c[newPosition.x] && c[newPosition.x] !== ' '
							);
						}
					} else if (currentFacing === '<') {
						newPosition = {
							x: currentPosition.x - 1,
							y: currentPosition.y,
						};
						if (
							!map[newPosition.y][newPosition.x] ||
							map[newPosition.y][newPosition.x] === ' '
						) {
							newPosition.x = map[newPosition.y].findLastIndex(
								(c) => c && c !== ' ',
							);
						}
					} else if (currentFacing === '^') {
						newPosition = {
							x: currentPosition.x,
							y: currentPosition.y - 1,
						};
						if (
							!map[newPosition.y] ||
							!map[newPosition.y][newPosition.x] ||
							map[newPosition.y][newPosition.x] === ' '
						) {
							newPosition.y = map.findLastIndex((c) =>
								c[newPosition.x] && c[newPosition.x] !== ' '
							);
						}
					}

					if (map[newPosition.y][newPosition.x] === '.') {
						currentPosition = newPosition;
						walkthrough.push({
							...currentPosition,
							facing: currentFacing,
						});
					} else if (map[newPosition.y][newPosition.x] === '#') {
						break;
					}
				}
			}

			currentInstruction = instructions.shift();
		}

		return 1000 * (currentPosition.y + 1) + 4 * (currentPosition.x + 1) +
			facings.indexOf(currentFacing);
	}

	solvePart2(input: string[]) {
		const [m, i] = input.join('\n').split('\n\n').map((i) => i.split('\n'));

		const map: string[][] = [];
		m.forEach((r) => {
			map.push(r.split(''));
		});

		const instructions = i[0].replaceAll('L', ',L,').replaceAll('R', ',R,')
			.split(',').map((c) => !['R', 'L'].includes(c) ? parseInt(c) : c);

		const start = { y: 0, x: map[0].indexOf('.') };

		const facings = ['>', 'v', '<', '^'];

		const walkthrough: { x: number; y: number; facing: string }[] = [];

		const portalsSeed = [
			{ //AB
				x1: 1,
				y1: 0,
				x2: 2,
				y2: 0,
				x3: 0,
				y3: 3,
				x4: 0,
				y4: 4,
				f1: 'v',
				f2: '>',
				id: 'A',
			},
			{ //BD
				x1: 2,
				y1: 0,
				x2: 3,
				y2: 0,
				x3: 0,
				y3: 4,
				x4: 1,
				y4: 4,
				f1: 'v',
				f2: '^',
				id: 'B',
			},
			{ //DE
				x1: 3,
				y1: 0,
				x2: 3,
				y2: 1,
				x3: 2,
				y3: 3,
				x4: 2,
				y4: 2,
				f1: '<',
				f2: '<',
				id: 'C',
			},
			{ //FE
				x1: 2,
				y1: 1,
				x2: 3,
				y2: 1,
				x3: 2,
				y3: 1,
				x4: 2,
				y4: 2,
				f1: '^',
				f2: '<',
				id: 'D',
			},
			{ //CD
				x1: 1,
				y1: 3,
				x2: 2,
				y2: 3,
				x3: 1,
				y3: 3,
				x4: 1,
				y4: 4,
				f1: '^',
				f2: '<',
				id: 'E',
			},
			{ // AG
				x1: 1,
				y1: 0,
				x2: 1,
				y2: 1,
				x3: 0,
				y3: 3,
				x4: 0,
				y4: 2,
				f1: '>',
				f2: '>',
				id: 'F',
			},
			{ //GH
				x1: 1,
				y1: 1,
				x2: 1,
				y2: 2,
				x3: 0,
				y3: 2,
				x4: 1,
				y4: 2,
				f1: '>',
				f2: 'v',
				id: 'G',
			},
		];
		const size = 50;

		const portals = portalsSeed.reduce((agg, curr) => {
			for (let i = 0; i < size; i++) {
				const fromSignX = curr.x1 < curr.x2 ? 1 : -1;
				const fromSignY = curr.y1 < curr.y2 ? 1 : -1;
				const toSignX = curr.x3 < curr.x4 ? 1 : -1;
				const toSignY = curr.y3 < curr.y4 ? 1 : -1;
				const fromXInc = curr.x1 === curr.x2
					? 0
					: i + Math.abs(Math.min(0, fromSignX));
				const fromYInc = curr.y1 === curr.y2
					? 0
					: i + Math.abs(Math.min(0, fromSignY));
				const toXInc = curr.x3 === curr.x4
					? 0
					: i + Math.abs(Math.min(0, toSignX));
				const toYInc = curr.y3 === curr.y4
					? 0
					: i + Math.abs(Math.min(0, toSignY));

				const p = {
					fromX: (curr.x1 * size) + fromSignX * fromXInc,
					fromY: (curr.y1 * size) + fromSignY * fromYInc,
					toX: (curr.x3 * size) + toSignX * toXInc,
					toY: (curr.y3 * size) + toSignY * toYInc,
				};

				const from1 =
					facings[(facings.indexOf(curr.f1) + 2) % facings.length];
				const from2 =
					facings[(facings.indexOf(curr.f2) + 2) % facings.length];

				const from = {
					...p,
					fromF: from1,
					toF: curr.f2,
					id: i < 10 ? curr.id : curr.id.toLowerCase(),
				};
				const to = {
					fromX: p.toX,
					fromY: p.toY,
					toX: p.fromX,
					toY: p.fromY,
					fromF: from2,
					toF: curr.f1,
					id: i < 10 ? curr.id : curr.id.toLowerCase(),
				};

				if (from1 === '>') {
					from.fromX--;
					to.toX--;
				}

				if (from2 === '>') {
					to.fromX--;
					from.toX--;
				}

				if (from1 === 'v') {
					from.fromY--;
					to.toY--;
				}

				if (from2 === 'v') {
					to.fromY--;
					from.toY--;
				}

				agg.push(from);
				agg.push(to);
			}

			return agg;
		}, [] as Portal[]);

		let currentFacing = '>';
		let currentPosition = start;
		let currentInstruction = instructions.shift();
		walkthrough.push({ ...currentPosition, facing: currentFacing });
		while (currentInstruction) {
			if (currentInstruction === 'R') {
				currentFacing = facings[
					(facings.indexOf(currentFacing) + 1) % facings.length
				];
				walkthrough.find((w) =>
					w.x === currentPosition.x && w.y === currentPosition.y
				)!.facing = currentFacing;
			} else if (currentInstruction === 'L') {
				currentFacing = facings[
					(facings.indexOf(currentFacing) + facings.length - 1) %
					facings.length
				];
				walkthrough.find((w) =>
					w.x === currentPosition.x && w.y === currentPosition.y
				)!.facing = currentFacing;
			} else {
				for (let i = 0; i < currentInstruction; i++) {
					let newPosition = currentPosition;

					const p = portals.find((o) =>
						o.fromX === currentPosition.x &&
						o.fromY === currentPosition.y &&
						o.fromF === currentFacing
					);
					if (p) {
						newPosition = {
							x: p.toX,
							y: p.toY,
						};

						if (map[p.toY][p.toX] !== '#') {
							currentFacing = p.toF;
						}
					} else if (currentFacing === '>') {
						newPosition = {
							x: currentPosition.x + 1,
							y: currentPosition.y,
						};
					} else if (currentFacing === 'v') {
						newPosition = {
							x: currentPosition.x,
							y: currentPosition.y + 1,
						};
					} else if (currentFacing === '<') {
						newPosition = {
							x: currentPosition.x - 1,
							y: currentPosition.y,
						};
					} else if (currentFacing === '^') {
						newPosition = {
							x: currentPosition.x,
							y: currentPosition.y - 1,
						};
					}

					if (map[newPosition.y][newPosition.x] === '.') {
						currentPosition = newPosition;
						walkthrough.push({
							...currentPosition,
							facing: currentFacing,
						});
					} else if (map[newPosition.y][newPosition.x] === '#') {
						break;
					}
				}
			}

			currentInstruction = instructions.shift();
		}

		return 1000 * (currentPosition.y + 1) + 4 * (currentPosition.x + 1) +
			facings.indexOf(walkthrough[walkthrough.length - 1].facing);
	}
}
