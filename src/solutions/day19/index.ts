import { makePairs } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Coord = [number, number, number];
type Coords = Coord[];

type ParsedScanner = {
	scannerId: number;
	coords: Coords;
};

type Scanner = {
	scannerId: number;
	coords: Coord;
};

export default class Day19 implements Solution {
	solvePart1(input: string[]) {
		const [base, ...rest] = this.parse(input);

		let baseCoords = [...base.coords];
		const scanners: Scanner[] = [{ scannerId: 0, coords: [0, 0, 0] }];

		const predicate = (scanner: ParsedScanner) =>
			!scanners.map((s) => s.scannerId).includes(scanner.scannerId);

		while (rest.some(predicate)) {
			rest.filter(predicate).forEach((r) => {
				const variants = this.getAllVariants(r.coords);

				const alignment = this.tryToAlign(baseCoords, variants);
				if (alignment) {
					const [coords, variant] = alignment;
					scanners.push({ scannerId: r.scannerId, coords });
					baseCoords = this.removeDuplicatedCoords([...baseCoords, ...variant]);
				}
			});
		}

		return baseCoords.length;
	}

	solvePart2(input: string[]) {
		const [base, ...rest] = this.parse(input);

		let baseCoords = [...base.coords];
		const scanners: Scanner[] = [{ scannerId: 0, coords: [0, 0, 0] }];

		const predicate = (scanner: ParsedScanner) =>
			!scanners.map((s) => s.scannerId).includes(scanner.scannerId);

		while (rest.some(predicate)) {
			rest.filter(predicate).forEach((r) => {
				const variants = this.getAllVariants(r.coords);

				const alignment = this.tryToAlign(baseCoords, variants);
				if (alignment) {
					const [coords, variant] = alignment;
					scanners.push({ scannerId: r.scannerId, coords });
					baseCoords = this.removeDuplicatedCoords([...baseCoords, ...variant]);
				}
			});
		}

		return Math.max(
			...makePairs(scanners)
				.map(([a, b]) => [a.coords, b.coords])
				.map(
					([[ax, ay, az], [bx, by, bz]]) =>
						Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz)
				)
		);
	}

	private removeDuplicatedCoords(coords: Coords) {
		return coords.filter(
			(item, idx, array) => array.findIndex((c) => this.sameCoord(c, item)) === idx
		);
	}

	private tryToAlign(base: Coords, variants: Coords[]): [Coord, Coords] | null {
		const randomBase = new Array(20)
			.fill(0)
			.map(() => Math.trunc(Math.random() * base.length))
			.map((c) => base[c]);

		for (const v of variants) {
			for (const point of v) {
				for (const basePoint of randomBase) {
					const diff = this.diff(point, basePoint);
					if (
						v.filter((c) => this.includesCoord(base, this.diff(c, diff))).length >= 12
					) {
						return [
							this.diff(basePoint, point),
							v.map((q) => this.diff(q, this.diff(point, basePoint)))
						];
					}
				}
			}
		}

		return null;
	}

	private diff([ax, ay, az]: Coord, [bx, by, bz]: Coord) {
		return [ax - bx, ay - by, az - bz] as Coord;
	}

	private includesCoord(coords: Coords, b: Coord) {
		return coords.some((c) => this.sameCoord(c, b));
	}

	private sameCoord([ax, ay, az]: Coord, [bx, by, bz]: Coord) {
		return ax === bx && ay === by && az === bz;
	}

	private parse(input: string[]): ParsedScanner[] {
		return input
			.join('\n')
			.split('\n\n')
			.map((scanner) => {
				const [header, ...coords] = scanner.split('\n');

				return {
					scannerId: parseInt(/--- scanner (\d+) ---/.exec(header)![1]),
					coords: coords.map((c) => c.split(',').map((d) => parseInt(d))) as Coords
				};
			});
	}

	private getAllVariants(coords: Coords) {
		const map = coords.map((c) => this.getVariants(c));
		return new Array(map[0].length).fill(0).map((_, i) => map.map((m) => m[i]) as Coords);
	}

	private getVariants([x, y, z]: Coord) {
		return [
			[x, y, z],
			[y, -x, z],
			[-x, -y, z],
			[-y, x, z],
			[y, x, -z],
			[x, -y, -z],
			[-y, -x, -z],
			[-x, y, -z],

			[x, -z, y],
			[-z, -x, y],
			[-x, z, y],
			[z, x, y],
			[-z, x, -y],
			[-x, -z, -y],
			[z, -x, -y],
			[x, z, -y],

			[y, z, x],
			[z, -y, x],
			[-y, -z, x],
			[-z, y, x],
			[z, y, -x],
			[-y, z, -x],
			[-z, -y, -x],
			[y, -z, -x]
		];
	}
}
