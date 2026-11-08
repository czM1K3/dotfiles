import { brightness } from "../../services/brightness";
import { Meter } from "../components/Meter";

export const Brightness = () => {
	// No controllable backlight: no item.
	if (!brightness) return null;

	return (
		<Meter
			name="brightness"
			icon="󰃠"
			fraction={brightness}
			label={brightness.as((x) => `${Math.round(x * 100)}%`)}
		/>
	);
};
