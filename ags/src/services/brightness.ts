import Gio from "gi://Gio";
import GLib from "gi://GLib";
import type { Accessor } from "ags";
import { createState } from "ags";
import { monitorFile } from "ags/file";

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
	monitorFile(file, () => setValue(read()));
	return value;
};

/**
 * Internal screen brightness as a 0 to 1 fraction, or null when this
 * machine has no controllable backlight.
 */
export const brightness = createBrightness();
