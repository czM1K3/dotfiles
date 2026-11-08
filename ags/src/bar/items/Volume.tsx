import { createBinding, createComputed } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { wp } from "../../services/audio";
import { Meter } from "../components/Meter";

const onPressed = (ctrl: Gtk.GestureClick) => {
	if (ctrl.get_current_button() !== Gdk.BUTTON_PRIMARY) return;
	execAsync([
		"hyprctl",
		"dispatch",
		'hl.dsp.exec_cmd("pavucontrol", { float = true })',
	]).catch(console.error);
};

export const volumeIcon = (volume: number, mute: boolean) => {
	if (mute || volume <= 0) return "󰝟";
	if (volume < 0.34) return "󰕿";
	if (volume < 0.67) return "󰖀";
	return "󰕾";
};

export const Volume = () => {
	// No WirePlumber: no item.
	if (!wp) return null;

	// These are null while there is no default speaker.
	const volume = createBinding(wp, "defaultSpeaker", "volume");
	const mute = createBinding(wp, "defaultSpeaker", "mute");
	const hasSpeaker = createBinding(wp, "defaultSpeaker").as(Boolean);

	const v = () => volume() ?? 0;

	return (
		<box visible={hasSpeaker}>
			<Meter
				name="volume"
				modifiers={mute.as((m) => (m ? "muted" : ""))}
				icon={createComputed(() => volumeIcon(v(), mute() ?? false))}
				fraction={volume.as((x) => x ?? 0)}
				label={volume.as((x) => `${Math.round((x ?? 0) * 100)}%`)}
				onPressed={onPressed}
			/>
		</box>
	);
};
