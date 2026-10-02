const toPixels = (value) => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string" || !/^\s*\d+(?:\.\d+)?(?:px)?\s*$/.test(value)) return null;
	return Number.parseFloat(value);
};

export const getColumnBounds = (column, tokens) => {
	const min = toPixels(column.minWidth) ?? tokens.size.tableMinColumnWidth;
	const max = Math.max(toPixels(column.maxWidth) ?? tokens.size.tableMaxColumnWidth, min);
	return { min, max };
};

export const getColumnWidth = (column, columnWidths, tokens) => {
	const { min, max } = getColumnBounds(column, tokens);
	const requested = toPixels(columnWidths[column.field] ?? column.width) ?? tokens.size.tableDefaultColumnWidth;
	return Math.max(min, Math.min(max, requested));
};
