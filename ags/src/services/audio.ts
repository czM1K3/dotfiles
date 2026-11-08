import AstalWp from "gi://AstalWp";

/** WirePlumber service, or null when it is unavailable. */
const getWp = (): AstalWp.Wp | null => {
	try {
		return AstalWp.get_default() ?? null;
	} catch (e) {
		console.error("Audio service unavailable:", e);
		return null;
	}
};

export const wp = getWp();
