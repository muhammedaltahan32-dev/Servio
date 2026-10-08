import iconsData from "./IconsDataset.json";

export const ICON_DATASET = iconsData.icons;
export const ICON_DATASET_old = [
	// Action
	{ name: "Search", category: "Action", tags: ["find", "lookup", "query"] },
	{ name: "Favorite", category: "Action", tags: ["love", "like", "heart"] },
	{ name: "Settings", category: "Action", tags: ["gear", "options", "config"] },
	{ name: "Delete", category: "Action", tags: ["trash", "remove", "bin"] },
	{ name: "Edit", category: "Action", tags: ["pencil", "modify", "write"] },
	{ name: "Add", category: "Action", tags: ["plus", "create", "new"] },
	{ name: "Check", category: "Action", tags: ["tick", "done", "success"] },
	{ name: "Visibility", category: "Action", tags: ["show", "view", "eye"] },
	{ name: "Lock", category: "Action", tags: ["security", "private", "protect"] },
	{ name: "Star", category: "Action", tags: ["bookmark", "rating", "favorite"] },
	{ name: "Tag", category: "Action", tags: ["label", "price", "discount"] },

	// Navigation
	{ name: "Home", category: "Navigation", tags: ["house", "dashboard", "main"] },
	{ name: "Menu", category: "Navigation", tags: ["hamburger", "sidebar", "options"] },
	{ name: "MapPin", category: "Navigation", tags: ["location", "place", "gps"] },
	{ name: "Globe", category: "Navigation", tags: ["world", "web", "internet"] },

	// Communication & Social
	{ name: "Person", category: "Social", tags: ["user", "profile", "account"] },
	{ name: "Mail", category: "Communication", tags: ["email", "inbox", "letter"] },
	{ name: "Send", category: "Communication", tags: ["submit", "paperplane"] },
	{ name: "Phone", category: "Communication", tags: ["call", "contact"] },
	{ name: "Share", category: "Social", tags: ["export", "link"] },
	{ name: "Chat", category: "Communication", tags: ["comment", "talk"] },
	{ name: "Notifications", category: "Social", tags: ["alert", "ring", "badge"] },

	// Content & Files
	{ name: "Folder", category: "Content", tags: ["directory", "storage"] },
	{ name: "Description", category: "Content", tags: ["document", "paper", "note"] },
	{ name: "Upload", category: "Content", tags: ["submit", "cloud"] },
	{ name: "Download", category: "Content", tags: ["save", "get"] },

	// Device & Tech
	{ name: "Laptop", category: "Device", tags: ["macbook", "pc", "computer"] },
	{ name: "Smartphone", category: "Device", tags: ["mobile", "cell"] },
	{ name: "Cpu", category: "Device", tags: ["chip", "processor"] },
	{ name: "Wifi", category: "Device", tags: ["signal", "wireless"] },

	// Media
	{ name: "Camera", category: "Media", tags: ["photo", "snap"] },
	{ name: "Image", category: "Media", tags: ["picture", "gallery"] },
	{ name: "Video", category: "Media", tags: ["movie", "record"] },
	{ name: "Music", category: "Media", tags: ["audio", "song"] },

	// Commerce & Date
	{ name: "ShoppingCart", category: "Commerce", tags: ["buy", "store", "basket"] },
	{ name: "CreditCard", category: "Commerce", tags: ["payment", "visa"] },
	{ name: "Briefcase", category: "Commerce", tags: ["work", "job", "office"] },
	{ name: "Calendar", category: "Date", tags: ["schedule", "event"] },
	{ name: "Clock", category: "Date", tags: ["time", "timer"] },
	{ name: "Shield", category: "Security", tags: ["protection", "guard"] },
	{ name: "Sun", category: "Toggle", tags: ["light", "day"] },
	{ name: "Moon", category: "Toggle", tags: ["dark", "night"] },
];

export const CATEGORIES = {
  "all": {
    label: "components.iconPicker.categories.all",
    value: "All"
  },
  "weatherAndNature": {
    label: "components.iconPicker.categories.weatherAndNature",
    value: "Weather & Nature"
  },
  "timeAndCalendar": {
    label: "components.iconPicker.categories.timeAndCalendar",
    value: "Time & Calendar"
  },
  "peopleAndAccounts": {
    label: "components.iconPicker.categories.peopleAndAccounts",
    value: "People & Accounts"
  },
  "commerceAndFinance": {
    label: "components.iconPicker.categories.commerceAndFinance",
    value: "Commerce & Finance"
  },
  "actionsAndControls": {
    label: "components.iconPicker.categories.actionsAndControls",
    value: "Actions & Controls"
  },
  "securityAndPrivacy": {
    label: "components.iconPicker.categories.securityAndPrivacy",
    value: "Security & Privacy"
  },
  "travelAndTransport": {
    label: "components.iconPicker.categories.travelAndTransport",
    value: "Travel & Transport"
  },
  "mediaAndCreative": {
    label: "components.iconPicker.categories.mediaAndCreative",
    value: "Media & Creative"
  },
  "productivityAndEditing": {
    label: "components.iconPicker.categories.productivityAndEditing",
    value: "Productivity & Editing"
  },
  "communication": {
    label: "components.iconPicker.categories.communication",
    value: "Communication"
  },
  "analyticsAndData": {
    label: "components.iconPicker.categories.analyticsAndData",
    value: "Analytics & Data"
  },
  "placesAndBusiness": {
    label: "components.iconPicker.categories.placesAndBusiness",
    value: "Places & Business"
  },
  "technology": {
    label: "components.iconPicker.categories.technology",
    value: "Technology"
  },
  "filesAndDocuments": {
    label: "components.iconPicker.categories.filesAndDocuments",
    value: "Files & Documents"
  },
  "healthAndMedical": {
    label: "components.iconPicker.categories.healthAndMedical",
    value: "Health & Medical"
  },
  "education": {
    label: "components.iconPicker.categories.education",
    value: "Education"
  },
  "foodAndDining": {
    label: "components.iconPicker.categories.foodAndDining",
    value: "Food & Dining"
  },
  "sportsAndRecreation": {
    label: "components.iconPicker.categories.sportsAndRecreation",
    value: "Sports & Recreation"
  },
  "other": {
    label: "components.iconPicker.categories.other",
    value: "Other"
  },
};
export const VARIANTS = ["Filled", "Outlined", "Rounded", "TwoTone", "Sharp"];
