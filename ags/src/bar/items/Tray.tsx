import AstalTray from "gi://AstalTray";
import { tray } from "../../utils/globals";
import { createBinding, For, onCleanup } from "ags";
import { Gdk, Gtk } from "ags/gtk4";

export const Tray = () => {
	const items = createBinding(tray, "items").as((items) =>
		items.filter(
			(item) =>
				item.id !== null && !["spotify", "Thunderbird Daily"].includes(item.title),
		),
	);
	return (
		<box class="bar-item tray">
			<For each={items}>
				{(item) => {
					let popovermenu: Gtk.PopoverMenu;
					return (
						<box
							class={"item"}
							$={(self) => {
								popovermenu.connect("notify::visible", ({ visible }) =>
									self[visible ? "add_css_class" : "remove_css_class"]("active"),
								);
							}}
						>
							<image
								gicon={createBinding(item, "gicon")}
								tooltipMarkup={item.tooltipMarkup || item.title}
								pixelSize={14}
							/>
							<Gtk.GestureClick
								onPressed={() => item.about_to_show()}
								onReleased={(ctrl, _, x, y) => {
									const button = ctrl.get_current_button();
									if (button === Gdk.BUTTON_PRIMARY) {
										item.activate(x, y);
									} else if (button === Gdk.BUTTON_SECONDARY) {
										if (popovermenu) {
											if (popovermenu.visible) {
												popovermenu.popdown();
											} else {
												popovermenu.popup();
											}
										}
									} else if (button === Gdk.BUTTON_MIDDLE) {
										item.secondary_activate(x, y);
									}
								}}
								button={0}
							/>
							<Gtk.PopoverMenu
								menuModel={item.menuModel}
								position={Gtk.PositionType.TOP}
								$={(self) => {
									popovermenu = self;
									self.insert_action_group("dbusmenu", item.actionGroup);

									const conns = [
										item.connect("notify::action-group", (item) => {
											self.insert_action_group("dbusmenu", item.actionGroup);
										}),

										item.connect("notify::menu-model", (item) => {
											self.set_menu_model(item.menuModel);
										}),
									];

									onCleanup(() => {
										conns.map((id) => item.disconnect(id));
									});
								}}
							/>
						</box>
					);
				}}
			</For>
		</box>
	);
};
