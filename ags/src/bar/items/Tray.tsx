import type AstalTray from "gi://AstalTray";
import { createBinding, For, onCleanup } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import { tray } from "../../services/tray";

const hiddenTitles = ["spotify", "Thunderbird Daily"];

const items = createBinding(tray, "items").as((items) =>
	items.filter((item) => item.id !== null && !hiddenTitles.includes(item.title)),
);

const TrayItem = ({ item }: { item: AstalTray.TrayItem }) => {
	let popover: Gtk.PopoverMenu;

	const toggleMenu = () =>
		popover.visible ? popover.popdown() : popover.popup();

	return (
		<box
			class="item"
			$={(self) => {
				const id = popover.connect("notify::visible", () => {
					if (popover.visible) self.add_css_class("active");
					else self.remove_css_class("active");
				});
				onCleanup(() => popover.disconnect(id));
			}}
		>
			<image
				gicon={createBinding(item, "gicon")}
				tooltipMarkup={item.tooltipMarkup || item.title}
				pixelSize={14}
			/>
			<Gtk.GestureClick
				button={0}
				onPressed={() => item.about_to_show()}
				onReleased={(ctrl, _, x, y) => {
					switch (ctrl.get_current_button()) {
						case Gdk.BUTTON_PRIMARY:
							item.activate(x, y);
							break;
						case Gdk.BUTTON_SECONDARY:
							toggleMenu();
							break;
						case Gdk.BUTTON_MIDDLE:
							item.secondary_activate(x, y);
							break;
					}
				}}
			/>
			<Gtk.PopoverMenu
				menuModel={item.menuModel}
				position={Gtk.PositionType.TOP}
				$={(self) => {
					popover = self;
					self.insert_action_group("dbusmenu", item.actionGroup);

					const conns = [
						item.connect("notify::action-group", () =>
							self.insert_action_group("dbusmenu", item.actionGroup),
						),
						item.connect("notify::menu-model", () =>
							self.set_menu_model(item.menuModel),
						),
					];
					onCleanup(() => conns.forEach((id) => item.disconnect(id)));
				}}
			/>
		</box>
	);
};

export const Tray = () => (
	<box class="bar-item tray">
		<For each={items}>{(item) => <TrayItem item={item} />}</For>
	</box>
);
