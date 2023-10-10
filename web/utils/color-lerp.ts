function lerpColor(a: number, b: number) {
	const ar = a >> 16;
	const ag = (a >> 8) & 0xff;
	const ab = a & 0xff;

	const br = b >> 16;
	const bg = (b >> 8) & 0xff;
	const bb = b & 0xff;

	return (amount: number) => {
		const rr = ar + amount * (br - ar);
		const rg = ag + amount * (bg - ag);
		const rb = ab + amount * (bb - ab);

		return (rr << 16) + (rg << 8) + (rb | 0);
	};
}

export function lerpMultipleColors(colorMap: Record<number, number>) {
	const keys = Object.keys(colorMap).map(Number).sort();
	const reverseKeys = keys.slice().reverse();
	const lerpMap = keys.reduce<Record<string, (amount: number) => number>>(
		(acc, key, i) => {
			const next = keys[i + 1];

			if (next === undefined) {
				return acc;
			}

			acc[`${key}:${next}`] = lerpColor(colorMap[key], colorMap[next]);

			return acc;
		},
		{},
	);

	return (amount: number) => {
		const end = keys.find((i) => i >= amount);
		const start = reverseKeys.find((i) => i <= amount);

		if (start === end) {
			return colorMap[start];
		}

		const diff = end - start;
		const weightAmount = (1 / diff) * (amount - start);

		return lerpMap[`${start}:${end}`](weightAmount);
	};
}

export function hexToColor(i: number) {
	const c = (i & 0x00ffffff).toString(16).toUpperCase();

	return "#" + "00000".substring(0, 6 - c.length) + c;
}

function hexToRGB(hex: number) {
	var r = hex >> 16;
	var g = (hex >> 8) & 0xff;
	var b = hex & 0xff;

	return [r, g, b] as const;
}

function RGBToHex(r: number, g: number, b: number) {
	var bin = (r << 16) | (g << 8) | b;

	return parseInt("0x" + bin.toString(16), 16);
}
