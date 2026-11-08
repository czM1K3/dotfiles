import app from "ags/gtk4/app";
import { createBinding, createComputed, createState } from "ags";
import { Astal } from "ags/gtk4";
import GLib from "gi://GLib";
import { wp } from "../services/audio";
import { brightness } from "../services/brightness";
import { Meter } from "../bar/components/Meter";
import { volumeIcon } from "../bar/items/Volume";

const HIDE_AFTER_MS = 1500;

/**
 * On-screen display for volume and brightness. It shows itself whenever
 * either value changes, so it works no matter what changed it.
 */
export const Osd = () => {
	const [visible, setVisible] = createState(false);
	let timer = 0;

	const show = () => {
		setVisible(true);
		if (timer) GLib.source_remove(timer);
		timer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, HIDE_AFTER_MS, () => {
			timer = 0;
			setVisible(false);
			return GLib.SOURCE_REMOVE;
		});
	};

	const volume = wp ? createBinding(wp, "defaultSpeaker", "volume") : null;
	const mute = wp ? createBinding(wp, "defaultSpeaker", "mute") : null;
	volume?.subscribe(show);
	mute?.subscribe(show);
	brightness?.subscribe(show);

	const { BOTTOM } = Astal.WindowAnchor;

	return (
		<window
			visible={visible}
			name="osd"
			namespace="osd"
			class="Osd"
			layer={Astal.Layer.OVERLAY}
			exclusivity={Astal.Exclusivity.IGNORE}
			keymode={Astal.Keymode.NONE}
			anchor={BOTTOM}
			marginBottom={80}
			application={app}
		>
			<box class="osd" orientation={1}>
				{volume && mute && (
					<Meter
						name="volume"
						modifiers={mute.as((m) => (m ? "muted" : ""))}
						icon={createComputed(() => volumeIcon(volume() ?? 0, mute() ?? false))}
						fraction={volume.as((x) => x ?? 0)}
						label={volume.as((x) => `${Math.round((x ?? 0) * 100)}%`)}
					/>
				)}
				{brightness && (
					<Meter
						name="brightness"
						icon="󰃠"
						fraction={brightness}
						label={brightness.as((x) => `${Math.round(x * 100)}%`)}
					/>
				)}
			</box>
		</window>
	);
};
