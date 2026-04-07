import { createSubprocess } from "ags/process";
import AstalHyprland from "gi://AstalHyprland";
import AstalTray from "gi://AstalTray";

export const hyprland = AstalHyprland.get_default();
export const tray = AstalTray.get_default();

const jsonFixRegex = /(\\)[^"]/gm;
export const media = createSubprocess<string>(
	"",
	[
		"bash",
		"-c",
		"waybar-mpris --autofocus --pause 󰏤 --play 󰐊 --order 'SYMBOL:ARTIST:TITLE'",
	],
	(raw) => {
		const rawFix = raw.replaceAll(jsonFixRegex, (x) => "\\" + x);
		try {
			return JSON.parse(rawFix)["text"] || "";
		} catch (e: unknown) {
			return "ERROR: " + rawFix;
		}
	},
);

const gameModeRegex = /^variant\s{0,}int32\s{0,}(\d{1,})$/;
export const gamemode = createSubprocess<number>(
	0,
	[
		"bash",
		"-c",
		"dbus-monitor --session \"type='signal',interface='org.freedesktop.DBus.Properties',sender='com.feralinteractive.GameMode',path='/com/feralinteractive/GameMode'\"",
	],
	(raw, prev) => {
		const result = raw.match(gameModeRegex);
		if (result === null || result.length !== 2) return prev;
		return parseInt(result[1]);
	},
);

export type CustomNotificationsType = {
	dnd: boolean;
	count: number;
};
export const customNotifications = createSubprocess<CustomNotificationsType>(
	{ dnd: false, count: 0 },
	["bash", "-c", "swaync-client -s"],
	(raw) => {
		const parsed = JSON.parse(raw);
		return {
			count: parsed["count"],
			dnd: parsed["dnd"],
		};
	},
);
