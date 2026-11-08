import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { notifications } from "../../services/notifications";

const onClick = (ctrl: Gtk.GestureClick) => {
	switch (ctrl.get_current_button()) {
		case Gdk.BUTTON_PRIMARY:
			execAsync(["swaync-client", "-t", "-sw"]).catch(console.error);
			break;
		case Gdk.BUTTON_SECONDARY:
			execAsync(["swaync-client", "-d", "-sw"]).catch(console.error);
			break;
	}
};

export const Notifications = () => (
	<box
		class="bar-item notifications"
		visible={notifications((x) => x.count > 0)}
	>
		<Gtk.GestureClick onPressed={onClick} button={0} />
		<label label={notifications((x) => (x.dnd ? "" : ""))} class="icon" />
		<label label={notifications((x) => x.count.toString())} />
	</box>
);
