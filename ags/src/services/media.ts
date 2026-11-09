import { createSubprocess } from "ags/process";

// waybar-mpris doesn't escape backslashes in titles, which breaks JSON.parse.
const unescapedBackslash = /\\(?!["\\])/g;

export const media = createSubprocess<string>(
	"",
	["sh", "-c", "~/.local/bin/mpris-status"],
	(raw) => {
		const fixed = raw.replace(unescapedBackslash, "\\\\");
    try {
      const parsed = JSON.parse(fixed);
      const selected = parsed["selected"];
      if (!selected) return "";
			return (selected["status"] === "playing" ? "󰏤 " : "󰐊 ") + (selected["artist"] || "") + " - " + (selected["title"] || "");
		} catch {
			console.warn("media: failed to parse waybar-mpris output:", raw);
			return "";
		}
	},
);
