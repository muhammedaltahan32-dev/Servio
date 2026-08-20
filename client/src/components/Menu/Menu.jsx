import Content from "./Content.jsx";
import Item from "./Item.jsx";
import { MenuRoot } from "./Menu.Root.jsx";
import Provider from "./Provider.jsx";
import Trigger from "./Trigger.jsx";
export const Menu = ({ open, defaultOpen, onClose, ...props }) => (
	<Provider open={open} defaultOpen={defaultOpen} onClose={onClose}>
		<MenuRoot {...props} />
	</Provider>
);
Menu.displayName = "Menu";
Menu.Content = Content;
Menu.Trigger = Trigger;
Menu.Item = Item;
