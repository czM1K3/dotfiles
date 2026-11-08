import AstalBattery from "gi://AstalBattery";
import { createBinding, createComputed } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { battery } from "../../services/battery";
import { Meter } from "../components/Meter";

const onClick = (ctrl: Gtk.GestureClick) => {
	if (ctrl.get_current_button() !== Gdk.BUTTON_PRIMARY) return;
	execAsync([
		"hyprctl",
		"dispatch",
		'hl.dsp.exec_cmd("alacritty -e battop", { float = true })',
	]).catch(console.error);
};

const LOW_THRESHOLD = 0.2;

const itemClass = (s: AstalBattery.State, p: number) => {
	const classes: string[] = [];
	if (s === AstalBattery.State.PENDING_CHARGE) classes.push("pending-charge");
	if (s === AstalBattery.State.CHARGING) classes.push("charging");
	else if (p < LOW_THRESHOLD) classes.push("low");
	return classes.join(" ");
};

export const Battery = () => {
	// Machines without a battery (or without UPower) simply get no item.
	if (!battery?.isPresent) return null;

	const percentage = createBinding(battery, "percentage");
	const state = createBinding(battery, "state");
	const rate = createBinding(battery, "energyRate");
	const cls = createComputed(() => itemClass(state(), percentage()));

	return (
		<Meter
			name="battery"
			modifiers={cls}
			icon={state.as((s) =>
				s === AstalBattery.State.CHARGING || s === AstalBattery.State.PENDING_CHARGE
					? "󰂄"
					: "󰁹",
			)}
			fraction={percentage}
			label={percentage.as((p) => `${Math.round(p * 100)}%`)}
			suffix={<label class="rate" label={rate.as((w) => `${w.toFixed(1)} W`)} />}
			onPressed={onClick}
		/>
	);
};
