import { Solution } from '../../utilities/solver.ts';

type LiteralPacket = {
	version: number;
	type: 4;
	value: number;
};

type OperatorPacket = {
	version: number;
	type: number;
	subPackets: Packet[];
	value: number;
};

type Packet = LiteralPacket | OperatorPacket;

export default class Day16 implements Solution {
	solvePart1(input: string[]) {
		const binary = input[0]
			.split('')
			.map((i) => parseInt(i, 16).toString(2).padStart(4, '0'))
			.join('')
			.split('');

		const parsed = this.parse(binary);
		const flat = this.flat(parsed);

		return flat.reduce((a, b) => a + b.version, 0);
	}

	solvePart2(input: string[]) {
		const binary = input[0]
			.split('')
			.map((i) => parseInt(i, 16).toString(2).padStart(4, '0'))
			.join('')
			.split('');

		const [parsed] = this.parse(binary);
		return parsed.value;
	}

	private parse(packet: string[]): Packet[] {
		const version = parseInt(packet.splice(0, 3).join(''), 2);
		const type = parseInt(packet.splice(0, 3).join(''), 2);

		return type === 4
			? this.parseLiteral(version, packet)
			: this.parseOperator(version, type, packet);
	}

	private parseLiteral(version: number, packet: string[]): LiteralPacket[] {
		const literal: string[] = [];
		while (true) {
			const [first, ...rest] = packet.splice(0, 5).join('');
			literal.push(...rest);
			if (first === '0') {
				break;
			}
		}

		return [
			{
				version,
				type: 4,
				value: parseInt(literal.join(''), 2),
			}
		];
	}

	private parseOperator(version: number, type: number, packet: string[]): OperatorPacket[] {
		const lengthTypeId = parseInt(packet.splice(0, 1).join(''), 2);
		return lengthTypeId === 0
			? this.parseOperatorWithFixedLength(version, type, packet)
			: this.parseOperatorWithFixedSubPackets(version, type, packet);
	}

	private parseOperatorWithFixedLength(
		version: number,
		type: number,
		packet: string[]
	): OperatorPacket[] {
		const length = parseInt(packet.splice(0, 15).join(''), 2);
		const subPacketBits = packet.splice(0, length);
		const subPackets: Packet[] = [];

		while (true) {
			const result = this.parse(subPacketBits);
			subPackets.push(...result);
			if (!subPacketBits.length) {
				break;
			}
		}

		return [
			{
				version,
				type,
				subPackets,
				value:this.computeValue(type, subPackets)
			}
		];
	}

	private parseOperatorWithFixedSubPackets(
		version: number,
		type: number,
		packet: string[]
	): OperatorPacket[] {
		const subPacketsCount = parseInt(packet.splice(0, 11).join(''), 2);
		const subPackets: Packet[] = [];

		while (true) {
			const result = this.parse(packet);
			subPackets.push(...result);
			if (subPackets.length === subPacketsCount) {
				break;
			}
		}

		return [
			{
				version,
				type,
				subPackets,
				value: this.computeValue(type, subPackets)
			}
		];
	}

	private computeValue(type: number, subPackets: Packet[]) {
		const values = subPackets.map(s => s.value);

		switch(type) {
			case 0:
				return values.reduce((a,b) => a+b, 0);
			case 1:
				return values.reduce((a,b) => a*b, 1);
			case 2:
				return Math.min(...values);
			case 3:
				return Math.max(...values);
			case 5:
				return Number(values[0] > values[1]);
			case 6:
				return Number(values[0] < values[1]);
			case 7:
				return Number(values[0] === values[1]);
				default:
				throw new Error('unknown type');
		}
	}

	private flat(packets: Packet[]) {
		const result: Packet[] = [];

		result.push(...packets);
		const subPackets = packets
			.filter((f): f is OperatorPacket => 'subPackets' in f)
			.flatMap((f) => f.subPackets);
		if (subPackets.length) {
			result.push(...this.flat(subPackets));
		}
		return result;
	}
}
