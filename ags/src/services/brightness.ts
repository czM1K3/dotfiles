import Gio from "gi://Gio";
import GLib from "gi://GLib";
import type { Accessor } from "ags";
import { createState } from "ags";

const BACKLIGHT_DIR = "/sys/class/backlight";
const decoder = new TextDecoder();

const readNumber = (path: string): number => {
	try {
		const [ok, bytes] = GLib.file_get_contents(path);
		return ok ? parseInt(decoder.decode(bytes).trim()) : NaN;
	} catch {
		return NaN;
	}
};

const findBacklight = (): { path: string; max: number } | null => {
	try {
		const names: string[] = [];
		const children = Gio.File.new_for_path(BACKLIGHT_DIR).enumerate_children(
			"standard::name",
			Gio.FileQueryInfoFlags.NONE,
			null,
		);
		for (let info; (info = children.next_file(null));)
			names.push(info.get_name());
		for (const name of names.sort()) {
			const path = `${BACKLIGHT_DIR}/${name}`;
			const max = readNumber(`${path}/max_brightness`);
			if (max > 0 && !Number.isNaN(readNumber(`${path}/actual_brightness`)))
				return { path, max };
		}
	} catch {
		// No backlight class (desktop, VM, ...).
	}
	return null;
};

const backlight = findBacklight();

const monitors: Gio.FileMonitor[] = [];

const createBrightness = (): Accessor<number> | null => {
	if (!backlight) return null;

	// actual_brightness reflects what the panel really uses, including
	// changes made by firmware hotkeys; the kernel notifies on it.
	const file = `${backlight.path}/actual_brightness`;
	const read = () => {
		const value = readNumber(file);
		return Number.isNaN(value) ? 0 : Math.min(1, value / backlight.max);
	};

	const [value, setValue] = createState(read());

	// GIO coalesces events to one per 800 ms by default, which makes rapid
	// changes feel laggy. Watch both files: "brightness" fires immediately
	// on write, "actual_brightness" once the panel has applied the value.
	for (const name of ["brightness", "actual_brightness"]) {
		try {
			const monitor = Gio.File.new_for_path(
				`${backlight.path}/${name}`,
			).monitor_file(Gio.FileMonitorFlags.NONE, null);
			monitor.set_rate_limit(1);
			monitor.connect("changed", () => setValue(read()));
			monitors.push(monitor); // keep a reference so it isn't collected
		} catch (e) {
			console.error(`Cannot monitor ${name}:`, e);
		}
	}
	return value;
};

/**
 * Internal screen brightness as a 0 to 1 fraction, or null when this
 * machine has no controllable backlight.
 */
export const brightness = createBrightness();
