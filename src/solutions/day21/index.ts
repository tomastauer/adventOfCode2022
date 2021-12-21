import { Solution } from '../../utilities/solver.ts';

type Universe = {
	playing: 1 | 2;
	scores: {
		player1: number;
		player2: number;
	}
	positions: {
		player1: number;
		player2: number;
	}
}

export default class Day21 implements Solution {
	private dice = 0;
	private rolledTimes = 0;

	solvePart1(input: string[]) {
		this.dice = 0;
		let [player1, player2] = input.map(i => parseInt(i.split(': ')[1]));
		const scores = {
			player1: 0,
			player2: 0
		};
		let playing = 1;

		while(scores.player1 < 1000 && scores.player2 < 1000) {
			if(playing === 1) {
				player1 = (player1 + this.roll()) % 10 || 10;
				scores.player1 += player1;
				playing  = 2;
			} else {
				player2 = (player2 + this.roll()) % 10 || 10;
				scores.player2 += player2;
				playing = 1;
			}
		}

		return Math.min(scores.player1, scores.player2) * this.rolledTimes;
	}

	solvePart2(input: string[]) {
		const [player1, player2] = input.map(i => parseInt(i.split(': ')[1]));
	
		const initialUniverse: Universe = {
			playing: 1,
			scores: {
				player1: 0,
				player2: 0
			}, 
			positions: {
				player1,
				player2
			},
		};

		return Math.max(...Object.values(this.iterate(initialUniverse)));
	}

	private memo: Record<string, { 1: number, 2: number}> = {};

	private iterate(universe: Universe): {1:number, 2:number} {
		if(this.memo[this.serializeUniverse(universe)]) {
			return this.memo[this.serializeUniverse(universe)];
		}

		const result = this.expand(universe).map(newUniverse => {
			if(newUniverse.scores.player1 >= 21 ) {
				return { 1: 1, 2: 0} 
			} else if(newUniverse.scores.player2 >= 21) {
				return { 1: 0, 2: 1} 
			} else {
				return this.iterate(newUniverse);
			}

		}).reduce((agg, curr) => {
			agg[1] += curr[1];
			agg[2] += curr[2];

			return agg;
		}, { 1: 0, 2: 0});

	
		this.memo[this.serializeUniverse(universe)] = result;

		return result;
	}

	private expand(universe: Universe): Universe[] {
		return [1,2,3].flatMap(x => [1,2,3].flatMap(y => [1,2,3].flatMap(z => {
			const sum = x + y + z;
			const newPos = ((universe.playing === 1 ? universe.positions.player1 : universe.positions.player2) + sum) % 10 || 10;
			return {
				playing: universe.playing === 1 ? 2 : 1,
				positions: {
					player1: universe.playing === 1 ? newPos : universe.positions.player1,
					player2: universe.playing === 2 ? newPos : universe.positions.player2,
				},
				scores: {
					player1: universe.playing === 1 ? universe.scores.player1 + newPos : universe.scores.player1,
					player2: universe.playing === 2 ? universe.scores.player2 + newPos : universe.scores.player2
				},
			}
		})))
	}

	private serializeUniverse(universe: Universe) {
		return `${universe.playing}|${universe.positions.player1},${universe.positions.player2}|${universe.scores.player1},${universe.scores.player2}`;
	}

	private roll() {
		return new Array(3).fill(0).reduce((acc) => {
			this.dice = ((this.dice + 1) % 100);
			this.rolledTimes++;
			return acc + this.dice;
		}, 0);
	}
}
