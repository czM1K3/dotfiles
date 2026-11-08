import { createSubprocess } from "ags/process";

export type NotificationsState = {
	dnd: boolean;
	count: number;
};

const initial: NotificationsState = { dnd: false, count: 0 };

export const notifications = createSubprocess<NotificationsState>(
	initial,
	["swaync-client", "-s"],
	(raw, prev) => {
		try {
			const { count, dnd } = JSON.parse(raw);
			return { count: Number(count) || 0, dnd: Boolean(dnd) };
		} catch {
			return prev;
		}
	},
);
