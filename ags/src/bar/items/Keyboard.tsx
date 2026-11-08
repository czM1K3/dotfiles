import { createState } from "ags";
import { hyprland } from "../../services/hyprland";

const flagFor = (layout: string) => (layout === "Czech (QWERTY)" ? "🇨🇿" : "🇺🇸");

export const Keyboard = () => {
	const [layout, setLayout] = createState(flagFor(""));

	const conn = hyprland.connect("keyboard-layout", (_, __, x) => {
		setLayout(flagFor(x));
	});

	return (
		<box class="bar-item keyboard" onDestroy={() => hyprland.disconnect(conn)}>
			<label label={layout} />
		</box>
	);
};
