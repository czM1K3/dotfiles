import { createSubprocess } from "ags/process";

// waybar-mpris doesn't escape backslashes in titles, which breaks JSON.parse.
const unescapedBackslash = /\\(?!["\\])/g;

export const media = createSubprocess<string>(
	"",
	[
		"waybar-mpris",
		"--autofocus",
		"--pause",
		"󰏤",
		"--play",
		"󰐊",
		"--order",
		"SYMBOL:ARTIST:TITLE",
	],
	(raw) => {
		const fixed = raw.replace(unescapedBackslash, "\\\\");
		try {
			return JSON.parse(fixed)["text"] || "";
		} catch {
			console.warn("media: failed to parse waybar-mpris output:", raw);
			return "";
		}
	},
);
