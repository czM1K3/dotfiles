import AstalApps from "gi://AstalApps";

const MAX_CACHE_SIZE = 50;
const cache = new Map<string, AstalApps.Application | null>();

let apps: AstalApps.Apps | null = null;

const findApp = (appId: string): AstalApps.Application | null => {
	const list = (apps ??= new AstalApps.Apps()).get_list();
	const term = appId.toLowerCase();

	return (
		list.find(
			(app) =>
				app.entry?.toLowerCase() === term ||
				app.iconName === appId ||
				app.name === appId ||
				app.wm_class === appId,
		) ??
		list.find((app) => app.entry?.toLowerCase().includes(term)) ??
		null
	);
};

export const getAppInfo = (appId: string): AstalApps.Application | null => {
	if (!appId) return null;
	if (cache.has(appId)) return cache.get(appId)!;

	const match = findApp(appId);
	if (cache.size >= MAX_CACHE_SIZE) {
		cache.delete(cache.keys().next().value!);
	}
	cache.set(appId, match);
	return match;
};
