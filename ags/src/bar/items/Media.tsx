import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { media } from "../../services/media";

const onClick = (ctrl: Gtk.GestureClick) => {
	switch (ctrl.get_current_button()) {
		case Gdk.BUTTON_PRIMARY:
			execAsync(["sh", "-c", "~/.local/bin/mpris-ctl play-pause"]).catch(console.error);
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

const onScroll = (_: Gtk.EventControllerScroll, _dx: number, dy: number) => {
	if (dy === 0) return;
	execAsync([
		"sh",
		"-c",
		"~/.local/bin/mpris-ctl " + (dy > 0 ? "next-player" : "prev-player"),
	]).catch(console.error);
};

export const Media = () => (
	<box class="bar-item media" visible={media((x) => Boolean(x))}>
		<Gtk.GestureClick onPressed={onClick} button={0} />
		<Gtk.EventControllerScroll
			flags={Gtk.EventControllerScrollFlags.VERTICAL}
			onScroll={onScroll}
		/>
		<label label={media} />
	</box>
);
