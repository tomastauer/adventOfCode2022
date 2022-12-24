import { Solution } from '../../utilities/solver.ts';

type State = {
	ore: number;
	clay: number;
	obsidian: number;
	geode: number;
	oreRobots: number;
	clayRobots: number;
	obsidianRobots: number;
	geodeRobots: number;
	log: string[];
	time: number;
	canAfford: string[];
};

type Blueprint = {
	id: number;
	oreOre: number;
	clayOre: number;
	obsidianOre: number;
	obsidianClay: number;
	geodeOre: number;
	geodeObsidian: number;
};

export default class Day19 implements Solution {
	regexp =
		/Blueprint (?<blueprint>\d+): Each ore robot costs (?<oreOre>\d+) ore. Each clay robot costs (?<clayOre>\d+) ore. Each obsidian robot costs (?<obsidianOre>\d+) ore and (?<obsidianClay>\d+) clay. Each geode robot costs (?<geodeOre>\d+) ore and (?<geodeObsidian>\d+) obsidian./gm;

	solvePart1(input: string[]) {
		const blueprints: Blueprint[] = input.map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			return {
				id: parseInt(groups['blueprint']),
				oreOre: parseInt(groups['oreOre']),
				clayOre: parseInt(groups['clayOre']),
				obsidianOre: parseInt(groups['obsidianOre']),
				obsidianClay: parseInt(groups['obsidianClay']),
				geodeOre: parseInt(groups['geodeOre']),
				geodeObsidian: parseInt(groups['geodeObsidian']),
			};
		});

		const initialState: State = {
			ore: 0,
			clay: 0,
			obsidian: 0,
			geode: 0,
			oreRobots: 1,
			clayRobots: 0,
			obsidianRobots: 0,
			geodeRobots: 0,
			log: ['start'],
			time: 0,
			canAfford: [],
		};

		const qualities = blueprints.map((b) =>
			this.play(initialState, b, 24) * b.id
		);
		return qualities.reduce((agg, curr) => agg + curr);
	}

	play(state: State, blueprint: Blueprint, maxTime: number) {
		const states = [state];

		let maxGeode = 0;
		let firstGeode = maxTime;

		const seen = new Set<string>();
		let s: State | undefined;
		while ((s = states.pop())) {
			if (s.time > maxTime) {
				continue;
			}
			if (s.time === maxTime) {
				if (s.geode > maxGeode) {
					console.log(s.geode);
					maxGeode = s.geode;
				}
				continue;
			}

			const serialized = [
				s.ore,
				s.clay,
				s.obsidian,
				s.geode,
				s.oreRobots,
				s.clayRobots,
				s.obsidianRobots,
				s.geodeRobots,
				s.time,
			].join(',');

			if (seen.has(serialized)) {
				continue;
			}

			if (
				s.geode +
						((s.geodeRobots * 2 + maxTime - s.time) *
								(maxTime - s.time)) / 2 < maxGeode
			) {
				continue;
			}

			if (s.time > firstGeode && s.geodeRobots === 0) {
				continue;
			}

			if (s.oreRobots) {
				const timeToBuild = Math.max(
					0,
					Math.ceil((blueprint.oreOre - s.ore) / s.oreRobots),
				) + 1;
				const collected = this.collect(s, timeToBuild);

				states.push({
					...s,
					...collected,
					oreRobots: s.oreRobots + 1,
					ore: collected.ore - blueprint.oreOre,
					log: [...s.log, `${s.time + timeToBuild}: ore bot`],
					canAfford: [],
					time: s.time + timeToBuild,
				});
			}

			if (s.oreRobots) {
				const timeToBuild = Math.max(
					0,
					Math.ceil((blueprint.clayOre - s.ore) / s.oreRobots),
				) + 1;
				const collected = this.collect(s, timeToBuild);
				states.push({
					...s,
					...collected,
					clayRobots: s.clayRobots + 1,
					ore: collected.ore - blueprint.clayOre,
					log: [...s.log, `${s.time + timeToBuild}: clay bot`],
					canAfford: [],
					time: s.time + timeToBuild,
				});
			}

			if (s.oreRobots && s.clayRobots) {
				const timeToBuild = Math.max(
					0,
					Math.ceil(
						(blueprint.obsidianOre - s.ore) / s.oreRobots,
					),
					Math.ceil(
						(blueprint.obsidianClay - s.clay) / s.clayRobots,
					),
				) + 1;
				const collected = this.collect(s, timeToBuild);
				if (s.time + timeToBuild <= maxTime) {
					states.push({
						...s,
						...collected,
						obsidianRobots: s.obsidianRobots + 1,
						ore: collected.ore - blueprint.obsidianOre,
						clay: collected.clay - blueprint.obsidianClay,
						log: [...s.log, `${s.time + timeToBuild}: obs bot`],
						canAfford: [],
						time: s.time + timeToBuild,
					});
				}
			}

			if (s.oreRobots && s.obsidianRobots) {
				const timeToBuild = Math.max(
					0,
					Math.ceil((blueprint.geodeOre - s.ore) / s.oreRobots),
					Math.ceil(
						(blueprint.geodeObsidian - s.obsidian) /
							s.obsidianRobots,
					),
				) + 1;
				if (s.time + timeToBuild <= maxTime) {
					const collected = this.collect(s, timeToBuild);
					states.push({
						...s,
						...collected,
						geodeRobots: s.geodeRobots + 1,
						ore: collected.ore - blueprint.geodeOre,
						obsidian: collected.obsidian - blueprint.geodeObsidian,
						log: [...s.log, `${s.time + timeToBuild}: geode bot`],
						canAfford: [],
						time: s.time + timeToBuild,
					});
					firstGeode = Math.min(firstGeode, s.time + timeToBuild + 1);
				}
			}

			if (!s.geodeRobots) {
				continue;
			}

			states.push({
				...s,
				time: maxTime,
				...this.collect(s, maxTime - s.time),
				log: [...s.log, 'skip'],
			});
		}

		return maxGeode;
	}

	collect(state: State, times = 1) {
		return {
			clay: state.clay + state.clayRobots * times,
			ore: state.ore + state.oreRobots * times,
			geode: state.geode + state.geodeRobots * times,
			obsidian: state.obsidian + state.obsidianRobots * times,
		};
	}

	solvePart2(input: string[]) {
		const blueprints: Blueprint[] = input.slice(0, 3).map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			return {
				id: parseInt(groups['blueprint']),
				oreOre: parseInt(groups['oreOre']),
				clayOre: parseInt(groups['clayOre']),
				obsidianOre: parseInt(groups['obsidianOre']),
				obsidianClay: parseInt(groups['obsidianClay']),
				geodeOre: parseInt(groups['geodeOre']),
				geodeObsidian: parseInt(groups['geodeObsidian']),
			};
		});

		const initialState: State = {
			ore: 0,
			clay: 0,
			obsidian: 0,
			geode: 0,
			oreRobots: 1,
			clayRobots: 0,
			obsidianRobots: 0,
			geodeRobots: 0,
			log: ['start'],
			time: 0,
			canAfford: [],
		};

		const geodes = blueprints.map((b) => this.play(initialState, b, 32));
		return geodes.reduce((agg, curr) => agg * curr);
	}
}
