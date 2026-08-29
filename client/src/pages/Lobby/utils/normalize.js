export const normalizeStatus = (status) => {
	if (!status) return "new";

	const normalized = String(status).trim().toLowerCase().replace(/_/g, "").replace(/\s+/g, "");

	if (normalized.includes("available")) return "ready";
	if (normalized.includes("occupied")) return "occupied";
	if (normalized.includes("clean")) return "preparing";
	if (normalized.includes("delay")) return "delayed";

	return "new";
};
export const getTableNumber = (table) => table?.table_number ?? table?.number ?? table?.id ?? "--";
export const getCapacity = (table) => Number(table?.capacity ?? table?.chairsCount ?? 4) || 4;
export const getTableSizeType = (capacity) => {
	if (capacity < 4) return "small";
	if (capacity < 7) return "medium";
	return "large";
};
