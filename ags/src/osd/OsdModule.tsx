import { Accessor, createState, onCleanup } from "ags";
import Wp from "gi://AstalWp";
import { timeout } from "ags/time";
import { VolumeIcon } from "../utils/icons";
import { Gtk } from "ags/gtk4";
import Brightness from "../services/brightness";

export const [visible, setVisible] = createState(false);
export const [revealed, setRevealed] = createState(false);

type OsdModuleProps = {
	visible: Accessor<boolean>;
};

export const OsdModule = ({ visible }: OsdModuleProps) => {
	const brightness = Brightness.get_default();
	const speaker = Wp.get_default()?.get_default_speaker();

	const [iconName, iconName_set] = createState("");
	const [value, setValue] = createState(0);
	let firstStart = true;
	let count = 0;

  const show = (v: number, icon: string) => {
		setVisible(true);
		setRevealed(true);
		setValue(v);
		iconName_set(icon);
		count++;

		timeout(3000, () => {
			count--;
			if (count === 0) {
				setRevealed(false);
			}
		});
	};

	return (
		<box
			class={"main"}
			$={() => {
				if (brightness) {
					const brightnessconnect = brightness.connect("notify::screen", () => {
						show(brightness.screen, "ds-sun-symbolic");
					});
					onCleanup(() => brightness.disconnect(brightnessconnect));
				} else {
					console.warn("OSD: brightness monitoring unavailable");
				}
				timeout(500, () => (firstStart = false));
				if (speaker) {
					const volumeconnect = speaker.connect("notify::volume", () => {
						if (firstStart) return;
						show(speaker.volume, VolumeIcon.peek());
					});
					const muteconnect = speaker.connect("notify::mute", () => {
						if (firstStart) return;
						show(speaker.volume, VolumeIcon.peek());
					});
					onCleanup(() => {
						speaker.disconnect(volumeconnect);
						speaker.disconnect(muteconnect);
					});
				}
			}}
		>
			<overlay>
				<image
					$type={"overlay"}
					iconName={iconName((i) => i)}
					class={value((v) => `osd-icon ${v < 0.1 ? "low" : ""}`)}
					valign={Gtk.Align.CENTER}
					halign={Gtk.Align.START}
					pixelSize={24}
        />
				<label label={iconName} />
				<levelbar
					orientation={Gtk.Orientation.HORIZONTAL}
					widthRequest={300}
					heightRequest={56}
					valign={Gtk.Align.CENTER}
					value={value((v) => v)}
				/>
			</overlay>
		</box>
	);
};
