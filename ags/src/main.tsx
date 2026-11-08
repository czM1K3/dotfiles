import app from "ags/gtk4/app";
import { createBinding, For, onCleanup, This } from "ags";
import { Bar } from "./bar/Bar";

export const main = () => {
	const monitors = createBinding(app, "monitors");

	return (
		<For each={monitors}>
			{(monitor) => (
				<This this={app}>
					<Bar gdkmonitor={monitor} $={(self) => onCleanup(() => self.destroy())} />
				</This>
			)}
		</For>
	);
};
