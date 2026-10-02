const formatters = new Map();

export const formatCurrency = (value, language = "en") => {
	const locale = language === "ar" ? "ar" : "en-US";
	let formatter = formatters.get(locale);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" });
		formatters.set(locale, formatter);
	}
	return formatter.format(Number(value ?? 0));
};
