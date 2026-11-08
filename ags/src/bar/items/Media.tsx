import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { media } from "../../services/media";

const onClick = (ctrl: Gtk.GestureClick) => {
	switch (ctrl.get_current_button()) {
		case Gdk.BUTTON_PRIMARY:
			execAsync(["waybar-mpris", "--send", "toggle"]).catch(console.error);
			break;
		case Gdk.BUTTON_SECONDARY:
			execAsync([
				"hyprctl",
				"dispatch",
				'hl.dsp.workspace.toggle_special("spotify")',
			]).catch(console.error);
			break;
	}
};

export const Media = () => (
	<box class="bar-item media" visible={media((x) => Boolean(x))}>
		<Gtk.GestureClick onPressed={onClick} button={0} />
		<label label={media} />
	</box>
);
