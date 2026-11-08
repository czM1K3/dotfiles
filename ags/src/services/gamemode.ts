import { createSubprocess } from "ags/process";

const gameModeRegex = /^\s*variant\s+int32\s+(\d+)$/;

/** Number of clients currently registered with Feral GameMode. */
export const gamemode = createSubprocess<number>(
	0,
	[
		"dbus-monitor",
		"--session",
		"type='signal',interface='org.freedesktop.DBus.Properties',sender='com.feralinteractive.GameMode',path='/com/feralinteractive/GameMode'",
	],
	(raw, prev) => {
		const result = raw.match(gameModeRegex);
		return result ? parseInt(result[1]) : prev;
	},
);
