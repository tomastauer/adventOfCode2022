import { Solution } from '../../utilities/solver.ts';

export default class Day17 implements Solution {
	private pieces = {
		'-': [['#', '#', '#', '#']],
		'+': [['.', '#', '.'], ['#', '#', '#'], ['.', '#', '.']],
		'l': [['#', '#', '#'], ['.', '.', '#'], ['.', '.', '#']],
		'|': [['#'], ['#'], ['#'], ['#']],
		'g': [['#', '#'], ['#', '#']],
	};

	solvePart1(input: string[]) {
		const game: string[][] = [[
			'+',
			'-',
			'-',
			'-',
			'-',
			'-',
			'-',
			'-',
			'+',
		]];
		let highest = 1;

		const pieces = this.piecesGenerator();
		const jets = this.jetGenerator(input[0]);

		for (let i = 0; i < 2022; i++) {
			const piece = pieces.next().value as string[][];
			const startY = highest + 3;
			const totalY = startY + piece.length;
			while (game.length < totalY) {
				game.push(['|', '.', '.', '.', '.', '.', '.', '.', '|']);
			}

			let filledPositions: { x: number; y: number }[] = [];

			for (let py = 0; py < piece.length; py++) {
				for (let px = 0; px < piece[py].length; px++) {
					if (piece[py][px] === '#') {
						game[startY + py][px + 3] = '@';
						filledPositions.push({ x: px + 3, y: startY + py });
					}
				}
			}

			while (true) {
				const jet = jets.next().value as '<' | '>';
				if (jet === '>') {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x + 1])
						)
					) {
						// cannot move to the right
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x + 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x + 1,
							y,
						}));
					}
				} else {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x - 1])
						)
					) {
						// cannot move to the left
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x - 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x - 1,
							y,
						}));
					}
				}

				if (
					filledPositions.some((f) =>
						['#', '-'].includes(game[f.y - 1][f.x])
					)
				) {
					// cannot move down, finished
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '#';
					});

					highest = Math.max(
						highest - 1,
						...filledPositions.map((f) => f.y),
					) + 1;
					break;
				} else {
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '.';
					});

					filledPositions.forEach(({ x, y }) => {
						game[y - 1][x] = '@';
					});

					filledPositions = filledPositions.map(({ x, y }) => ({
						x,
						y: y - 1,
					}));
				}
			}
		}

		return game.findLastIndex((g) => g.includes('#'));
	}

	solvePart2(input: string[]) {
		let game: string[][] = [['+', '-', '-', '-', '-', '-', '-', '-', '+']];
		let highest = 1;

		let pieces = this.piecesGenerator();
		let jets = this.jetGenerator(input[0]);

		for (let i = 0; i < 200000; i++) {
			const piece = pieces.next().value as string[][];
			const startY = highest + 3;
			const totalY = startY + piece.length;
			while (game.length < totalY) {
				game.push(['|', '.', '.', '.', '.', '.', '.', '.', '|']);
			}

			let filledPositions: { x: number; y: number }[] = [];

			for (let py = 0; py < piece.length; py++) {
				for (let px = 0; px < piece[py].length; px++) {
					if (piece[py][px] === '#') {
						game[startY + py][px + 3] = '@';
						filledPositions.push({ x: px + 3, y: startY + py });
					}
				}
			}

			while (true) {
				const jet = jets.next().value as '<' | '>';
				if (jet === '>') {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x + 1])
						)
					) {
						// cannot move to the right
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x + 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x + 1,
							y,
						}));
					}
				} else {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x - 1])
						)
					) {
						// cannot move to the left
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x - 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x - 1,
							y,
						}));
					}
				}

				if (
					filledPositions.some((f) =>
						['#', '-'].includes(game[f.y - 1][f.x])
					)
				) {
					// cannot move down, finished
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '#';
					});

					highest = Math.max(
						highest - 1,
						...filledPositions.map((f) => f.y),
					) + 1;
					break;
				} else {
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '.';
					});

					filledPositions.forEach(({ x, y }) => {
						game[y - 1][x] = '@';
					});

					filledPositions = filledPositions.map(({ x, y }) => ({
						x,
						y: y - 1,
					}));
				}
			}
		}

		const [first, period] = this.tryToFindCycle(game);
		const pattern = game.slice(first, first + period).map((g) =>
			g.join('')
		);

		game = [['+', '-', '-', '-', '-', '-', '-', '-', '+']];
		highest = 1;

		pieces = this.piecesGenerator();
		jets = this.jetGenerator(input[0]);

		let stepsBeforePeriod = 0;
		let stepsForPeriod = 0;

		for (let i = 0; i < 100000; i++) {
			const piece = pieces.next().value as string[][];
			const startY = highest + 3;
			const totalY = startY + piece.length;
			while (game.length < totalY) {
				game.push(['|', '.', '.', '.', '.', '.', '.', '.', '|']);
			}

			let filledPositions: { x: number; y: number }[] = [];

			for (let py = 0; py < piece.length; py++) {
				for (let px = 0; px < piece[py].length; px++) {
					if (piece[py][px] === '#') {
						game[startY + py][px + 3] = '@';
						filledPositions.push({ x: px + 3, y: startY + py });
					}
				}
			}

			while (true) {
				const jet = jets.next().value as '<' | '>';
				if (jet === '>') {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x + 1])
						)
					) {
						// cannot move to the right
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x + 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x + 1,
							y,
						}));
					}
				} else {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x - 1])
						)
					) {
						// cannot move to the left
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x - 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x - 1,
							y,
						}));
					}
				}

				if (
					filledPositions.some((f) =>
						['#', '-'].includes(game[f.y - 1][f.x])
					)
				) {
					// cannot move down, finished
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '#';
					});

					highest = Math.max(
						highest - 1,
						...filledPositions.map((f) => f.y),
					) + 1;
					break;
				} else {
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '.';
					});

					filledPositions.forEach(({ x, y }) => {
						game[y - 1][x] = '@';
					});

					filledPositions = filledPositions.map(({ x, y }) => ({
						x,
						y: y - 1,
					}));
				}
			}

			if (
				game[first] && game[first].join('') === pattern[0] &&
				stepsBeforePeriod === 0
			) {
				stepsBeforePeriod = i;
			}

			if (
				game.length > first + period && stepsForPeriod === 0 &&
				game.slice(first, first + period).map((g) => g.join('')).join(
						',',
					) === pattern.join(',')
			) {
				// We have full period
				stepsForPeriod = i - stepsBeforePeriod;
				break;
			}
		}

		const stepsAfter = 1000000000000 - stepsBeforePeriod;
		const runFor = stepsBeforePeriod + stepsAfter -
			Math.floor(stepsAfter / (stepsForPeriod)) * stepsForPeriod;

		game = [['+', '-', '-', '-', '-', '-', '-', '-', '+']];
		highest = 1;

		pieces = this.piecesGenerator();
		jets = this.jetGenerator(input[0]);

		for (let i = 0; i < runFor; i++) {
			const piece = pieces.next().value as string[][];
			const startY = highest + 3;
			const totalY = startY + piece.length;
			while (game.length < totalY) {
				game.push(['|', '.', '.', '.', '.', '.', '.', '.', '|']);
			}

			let filledPositions: { x: number; y: number }[] = [];

			for (let py = 0; py < piece.length; py++) {
				for (let px = 0; px < piece[py].length; px++) {
					if (piece[py][px] === '#') {
						game[startY + py][px + 3] = '@';
						filledPositions.push({ x: px + 3, y: startY + py });
					}
				}
			}

			while (true) {
				const jet = jets.next().value as '<' | '>';
				if (jet === '>') {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x + 1])
						)
					) {
						// cannot move to the right
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x + 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x + 1,
							y,
						}));
					}
				} else {
					if (
						filledPositions.some((f) =>
							['#', '|'].includes(game[f.y][f.x - 1])
						)
					) {
						// cannot move to the left
					} else {
						filledPositions.forEach(({ x, y }) => {
							game[y][x] = '.';
						});

						filledPositions.forEach(({ x, y }) => {
							game[y][x - 1] = '@';
						});

						filledPositions = filledPositions.map(({ x, y }) => ({
							x: x - 1,
							y,
						}));
					}
				}

				if (
					filledPositions.some((f) =>
						['#', '-'].includes(game[f.y - 1][f.x])
					)
				) {
					// cannot move down, finished
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '#';
					});

					highest = Math.max(
						highest - 1,
						...filledPositions.map((f) => f.y),
					) + 1;
					break;
				} else {
					filledPositions.forEach(({ x, y }) => {
						game[y][x] = '.';
					});

					filledPositions.forEach(({ x, y }) => {
						game[y - 1][x] = '@';
					});

					filledPositions = filledPositions.map(({ x, y }) => ({
						x,
						y: y - 1,
					}));
				}
			}
		}

		return game.findLastIndex((g) => g.includes('#')) +
			Math.floor((1000000000000 - stepsBeforePeriod) / (stepsForPeriod)) *
				period;
	}

	tryToFindCycle(game: string[][]): [number, number] {
		const stringified = game.map((g) => g.join(''));
		const random = Math.round(game.length / 2);

		const candidates = stringified.reduce((agg, curr, idx, arr) => {
			if (curr === arr[random]) {
				agg.push(idx);
			}
			return agg;
		}, [] as number[]);

		const cycles: number[] = [];

		candidates.forEach((c) => {
			for (let i = 0; i < c; i++) {
				if (stringified[random + i] !== stringified[c + i]) {
					return;
				}
			}

			cycles.push(c);
		});

		if (!cycles.length) {
			return [0, 0];
		}

		return [cycles[0], cycles[1] - cycles[0]];
	}

	printGame(game: string[][]) {
		console.log();
		(JSON.parse(JSON.stringify(game)) as string[][]).reverse().forEach((
			g,
		) => console.log(g.join('')));
		console.log();
	}

	*piecesGenerator() {
		const pieces = ['-', '+', 'l', '|', 'g'] as const;
		let currentPiece = 0;

		while (true) {
			yield this.pieces[pieces[currentPiece]];
			currentPiece = (currentPiece + 1) % pieces.length;
		}
	}

	*jetGenerator(input: string) {
		let currentJet = 0;
		while (true) {
			yield input[currentJet];
			currentJet = (currentJet + 1) % input.length;
		}
	}
}
