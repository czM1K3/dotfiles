import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { Time } from "./items/Time";
import { Workspaces } from "./items/Workspaces";
import { Media } from "./items/Media";
import { Gamemode } from "./items/Gamemode";
import { Notifications } from "./items/Notifications";
import { Keyboard } from "./items/Keyboard";
import { Tray } from "./items/Tray";
import { Battery } from "./items/Battery";

type BarProps = JSX.IntrinsicElements["window"] & {
	gdkmonitor: Gdk.Monitor;
};

export const Bar = ({ gdkmonitor, $ }: BarProps) => {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			visible
			name="bar"
			namespace="bar"
			class="Bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
			$={$}
		>
			<centerbox orientation={Gtk.Orientation.HORIZONTAL}>
				<box $type="start">
					<Workspaces gdkmonitor={gdkmonitor} />
					<Media />
				</box>
				<box $type="center">
					<Time />
				</box>
				<box $type="end">
					<Keyboard />
					<Battery />
					<Tray />
					<Gamemode />
					<Notifications />
				</box>
			</centerbox>
		</window>
	);
};
