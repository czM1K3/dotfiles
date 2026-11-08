import AstalBattery from "gi://AstalBattery";

/** The UPower display device, or null when UPower is unavailable. */
const getBattery = (): AstalBattery.Device | null => {
	try {
		return AstalBattery.get_default() ?? null;
	} catch (e) {
		console.error("Battery service unavailable:", e);
		return null;
	}
};

export const battery = getBattery();
