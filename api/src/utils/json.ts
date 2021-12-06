export function JSONParse(payload: string, reviver?: (this: any, key: string, value: any) => any) {
	try {
		return JSON.parse(payload, reviver);
	} catch(ex) {
		return null;
	}
}

export function JSONStringify(payload: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number) {
	try {
		return JSON.stringify(payload, replacer, space);
	} catch(ex) {
		return null;
	}
}