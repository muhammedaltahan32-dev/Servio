import { Apriori } from "node-apriori";

const MIN_CONFIDENCE = Number(process.env.RECOMMENDATION_MIN_CONFIDENCE) || 0.1;
const DEFAULT_MIN_SUPPORT = Number(process.env.RECOMMENDATION_MIN_SUPPORT) || 0.02;

const itemsetKey = (items) =>
	[...items]
		.map(Number)
		.sort((a, b) => a - b)
		.join(",");

export const recommendCompanions = async (transactions, dishId, limit = 5) => {
	if (!Array.isArray(transactions) || transactions.length < 2) return [];

	const numericDishId = Number(dishId);
	const dishTransactions = transactions.filter((transaction) => transaction.includes(numericDishId));
	if (dishTransactions.length < 2) return [];

	const minimumSupport = Math.min(1, Math.max(DEFAULT_MIN_SUPPORT, 2 / dishTransactions.length));
	const apriori = new Apriori(minimumSupport);
	const { itemsets = [] } = await apriori.exec(dishTransactions);
	const supportByItemset = new Map(itemsets.map(({ items, support }) => [itemsetKey(items), Number(support)]));
	const targetSupport = supportByItemset.get(itemsetKey([numericDishId]));
	if (!targetSupport) return [];
	const companionCounts = new Map();
	for (const transaction of transactions) {
		for (const item of transaction) companionCounts.set(item, (companionCounts.get(item) ?? 0) + 1);
	}

	return itemsets
		.filter(({ items }) => items.length === 2 && items.map(Number).includes(numericDishId))
		.map(({ items, support }) => {
			const companionId = Number(items.find((id) => Number(id) !== numericDishId));
			const pairCount = Number(support);
			const companionSupport = (companionCounts.get(companionId) ?? 0) / transactions.length;
			const confidence = pairCount / targetSupport;
			const lift = companionSupport ? confidence / companionSupport : 0;
			return { dishId: companionId, support: pairCount / transactions.length, confidence, lift };
		})
		.filter(
			(rule) => Number.isFinite(rule.confidence) && rule.confidence >= MIN_CONFIDENCE && Number.isFinite(rule.lift),
		)
		.sort((a, b) => b.lift - a.lift || b.confidence - a.confidence || b.support - a.support)
		.slice(0, limit);
};

