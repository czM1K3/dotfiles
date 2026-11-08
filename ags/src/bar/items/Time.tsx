import { createPoll } from "ags/time";

const dayMonth = new Intl.DateTimeFormat("cs-CZ", {
	day: "numeric",
	month: "long",
});
const clock = new Intl.DateTimeFormat("cs-CZ", {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
});

const format = () => {
	const now = new Date();
	// "8. listopadu" -> "8.listopadu"
	return `${dayMonth.format(now).replace(" ", "")} ${clock.format(now)}`;
};

export const Time = () => {
	const time = createPoll(format(), 1000, format);

	return (
		<box class="bar-item time">
			<label label={time} />
		</box>
	);
};
