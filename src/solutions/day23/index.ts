import { range } from '../../utilities/number.ts';
import { Solution } from '../../utilities/solver.ts';

type Amphipod = 'A' | 'B' | 'C' | 'D';

type Space = { i: 0 | 1 | 2 | 3 | 4 | 5 | 6; v: '.' | Amphipod };

type Home = { i: 0 | 1 | 2 | 3; v: [Space, Space] };

type Situation = {
	hallway: [Space, Space, Space, Space, Space, Space, Space];
	homes: [Home, Home, Home, Home];
	score: number;
};

export default class Day23 implements Solution {
	private memo!: Map<string, number>;

	solvePart1(input: string[]) {
		this.memo = new Map<string, number>();
		const initialSituation = this.parse(input);
		this.iterate(initialSituation);

		const solution = Array.from(this.memo.entries()).find(
			([key]) => key === '.......|AA|BB|CC|DD'
		);
		return solution?.[1] ?? 0;
	}

	solvePart2(input: string[]) {
		this.memo = new Map<string, number>();
		const newInput = [...input.slice(0, 3), '  #D#C#B#A#', '  #D#B#A#C#', ...input.slice(3)];
		const initialSituation = this.parse(newInput, 4);
		this.iterate(initialSituation);

		const solution = Array.from(this.memo.entries()).find(
			([key]) => key === '.......|AAAA|BBBB|CCCC|DDDD'
		);
		return solution?.[1] ?? 0;
	}

	private iterate(situation: Situation) {
		const serialized = this.serialize(situation);
		const fromMemo = this.memo.get(serialized);
		if (fromMemo !== undefined && fromMemo <= situation.score) {
			return;
		}

		this.memo.set(this.serialize(situation), situation.score);

		const newSituations = situation.hallway
			.filter(({ v, i }) => v !== '.' && this.canReachHome(i, situation))
			.flatMap(({ i }) => this.goHome(i, situation));

		newSituations.push(
			...situation.homes
				.filter(({ i }) => this.shouldTouchHome(i, situation))
				.flatMap(({ i }) => {
					return this.getAvailableHallways(i, situation).flatMap((a) =>
						this.goToHallway(i, a, situation)
					);
				})
		);

		newSituations.forEach((c) => {
			this.iterate(c);
		});
	}

	private parse(input: string[], positions = 2): Situation {
		const p = new Array(positions)
			.fill(0)
			.map((_, i) => input[i + 2])
			.map((l) => [3, 5, 7, 9].map((i) => l[i] as Amphipod));

		return {
			hallway: new Array(7).fill('.').map((v, i) => ({ i, v })),
			homes: [0, 1, 2, 3].map((i) => ({
				i,
				v: new Array(positions).fill(0).map((_, q) => ({ i: 0, v: p[q][i] }))
			})),
			score: 0
		} as Situation;
	}

	private getHomeIndex(amphipod: Amphipod) {
		return amphipod.charCodeAt(0) - 65;
	}

	private getAmphipod(index: number) {
		return String.fromCharCode(index + 65) as Amphipod;
	}

	private getAvailableHallways(homeIndex: number, situation: Situation) {
		const availableHallways = [];
		for (let i = this.getLeftHallway(homeIndex); i >= 0; i--) {
			if (situation.hallway[i].v !== '.') {
				break;
			}
			availableHallways.push(i);
		}

		for (let i = this.getRightHallway(homeIndex); i < 7; i++) {
			if (situation.hallway[i].v !== '.') {
				break;
			}
			availableHallways.push(i);
		}

		return availableHallways;
	}

	private getLeftHallway(homeIndex: number) {
		return homeIndex + 1;
	}

	private getRightHallway(homeIndex: number) {
		return homeIndex + 2;
	}

	private goToHallway(homeIndex: number, hallwayIndex: number, situation: Situation) {
		const c = this.clone(situation);
		const home = c.homes[homeIndex];
		const homePosition = this.getHomePosition(homeIndex, c) + 1;
		const a = home.v[homePosition].v as Amphipod;

		const distance = homePosition + 1 + this.getDistanceToHome(hallwayIndex, homeIndex);
		c.score += this.getScore(distance, a);

		home.v[homePosition].v = '.';
		c.hallway[hallwayIndex].v = a;
		return c;
	}

	private isHomeReady(amphipod: Amphipod, situation: Situation) {
		const homeIndex = this.getHomeIndex(amphipod);
		return situation.homes[homeIndex].v.every((v) => [amphipod, '.'].includes(v.v));
	}

	private shouldTouchHome(homeIndex: number, situation: Situation) {
		const amphipod = this.getAmphipod(homeIndex);

		return situation.homes[homeIndex].v
			.map((h) => h.v)
			.some((s) => ![amphipod, '.'].includes(s));
	}

	private canReachHome(hallwayIndex: number, situation: Situation) {
		const a = situation.hallway[hallwayIndex];
		if (a.v === '.') {
			throw new Error('a space');
		}

		if (!this.isHomeReady(a.v, situation)) {
			return false;
		}

		const homeIndex = this.getHomeIndex(a.v);
		const hallwaysInTheWay = this.getHallwayIndicesOnThePath(hallwayIndex, homeIndex);
		return hallwaysInTheWay.every((h) => situation.hallway[h].v === '.');
	}

	private goHome(hallwayIndex: number, situation: Situation) {
		const c = this.clone(situation);
		const a = c.hallway[hallwayIndex].v as Amphipod;
		const homeIndex = this.getHomeIndex(a);

		const homePosition = this.getHomePosition(homeIndex, c);

		const distance = homePosition + 1 + this.getDistanceToHome(hallwayIndex, homeIndex);

		c.homes[homeIndex].v[homePosition].v = a;
		c.hallway[hallwayIndex].v = '.';
		c.score += this.getScore(distance, a);

		return c;
	}

	private getHomePosition(homeIndex: number, situation: Situation) {
		return situation.homes[homeIndex].v.filter((i) => i.v === '.').length - 1;
	}

	private getDistanceToHome(hallwayIndex: number, homeIndex: number) {
		const distances = [
			2, 1, 1, 3, 5, 7, 8, 4, 3, 1, 1, 3, 5, 6, 6, 5, 3, 1, 1, 3, 4, 8, 7, 5, 3, 1, 1, 2
		];
		return distances[homeIndex * 7 + hallwayIndex];
	}

	private getScore(distance: number, a: Amphipod) {
		const mapping: Record<Amphipod, number> = {
			A: 1,
			B: 10,
			C: 100,
			D: 1000
		};

		return mapping[a] * distance;
	}

	private getHallwayIndicesOnThePath(hallwayIndex: number, homeIndex: number) {
		if ([1, 2].includes(hallwayIndex - homeIndex)) {
			return [];
		} else if (hallwayIndex > homeIndex + 2) {
			return range(homeIndex + 2, hallwayIndex - 1);
		} else {
			return range(hallwayIndex + 1, homeIndex + 1);
		}
	}

	private clone(situation: Situation): Situation {
		return {
			hallway: [...situation.hallway.map((s) => ({ ...s }))],
			homes: situation.homes.map((h) => ({ ...h, v: [...h.v.map((f) => ({ ...f }))] })),
			score: situation.score
		} as Situation;
	}

	private print(s: Situation) {
		console.log(
			[
				'#############',
				`#${s.hallway[0].v}${s.hallway[1].v}.${s.hallway[2].v}.${s.hallway[3].v}.${s.hallway[4].v}.${s.hallway[5].v}${s.hallway[6].v}#`,
				`###${s.homes[0].v[0].v}#${s.homes[1].v[0].v}#${s.homes[2].v[0].v}#${s.homes[3].v[0].v}###`,
				`  #${s.homes[0].v[1].v}#${s.homes[1].v[1].v}#${s.homes[2].v[1].v}#${s.homes[3].v[1].v}#`,
				`  #########`
			].join('\n')
		);
	}

	private serialize(s: Situation) {
		return `${s.hallway.map((h) => h.v).join('')}|${s.homes
			.map((h) => h.v.map((f) => f.v).join(''))
			.join('|')}`;
	}
}
