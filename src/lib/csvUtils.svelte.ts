export function objectsToCsvString(objs: Object[]) {
	if (objs.length < 1) {
		return {};
	}

	let rows = [];

	// header row
	let firstRow = '';
	const keys = Object.keys(objs[0]);
	for (let i = 0; i < keys.length; i++) {
		firstRow += keys[i];
		if (i < keys.length - 1) {
			firstRow += ',';
		}
	}

	rows.push(firstRow);

	for (const obj of objs) {
		rows.push(
			Object.values(obj)
				.map((val) => JSON.stringify(val).replaceAll(',', ';'))
				.join(',')
		);
	}

	return rows.join('\n');
}
