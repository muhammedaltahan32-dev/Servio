export const deepClone = (value) => JSON.parse(JSON.stringify(value));

export const setAtPath = (source, path, value) => {
	const keys = path.split(".");
	const result = { ...source };
	let sourceCursor = source;
	let resultCursor = result;
	for (const key of keys.slice(0, -1)) {
		sourceCursor = sourceCursor?.[key] ?? {};
		resultCursor[key] = { ...sourceCursor };
		resultCursor = resultCursor[key];
	}
	resultCursor[keys[keys.length - 1]] = value;
	return result;
};

export const getAtPath = (source, path) => path.split(".").reduce((current, key) => current?.[key], source);

export const updateAtPath = (source, path, value) => {
	if (Object.is(getAtPath(source, path), value)) return source;
	const updated = setAtPath(source, path, value);
	if (path !== "presetName") updated.presetName = "custom";
	return updated;
};

export const humanize = (value) => value
	.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
	.replace(/[_-]/g, " ")
	.replace(/\b\w/g, (letter) => letter.toUpperCase());

export const isColor = (value) => typeof value === "string" && typeof CSS !== "undefined" && CSS.supports("color", value);
export const isHexColor = (value) => typeof value === "string" && /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value);

export const toPickerHex = (value) => {
	if (isHexColor(value)) {
		const hex = value.slice(1);
		return `#${hex.length === 3 ? [...hex].map((character) => character + character).join("") : hex}`;
	}
	const rgb = typeof value === "string" && value.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
	if (!rgb) return "#000000";
	return `#${rgb.slice(1).map((channel) => Math.min(255, Number(channel)).toString(16).padStart(2, "0")).join("")}`;
};

export const parseSizeValue = (value) => {
	if (typeof value === "number") return value;
	const match = String(value).trim().match(/^(-?(?:\d+\.?\d*|\.\d+))/);
	return match ? Number(match[1]) : 0;
};

export const formatSizeValue = (value, currentValue, control) => {
	const normalized = Number(Number(value).toFixed(3));
	if (typeof currentValue === "number") return normalized;
	const unit = String(currentValue).trim().match(/[a-z%]+$/i)?.[0] ?? control.unit;
	return `${normalized}${unit === "sp" ? "" : unit}`;
};
