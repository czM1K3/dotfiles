import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { Accessor, createBinding, onCleanup } from "ags";
import { Time } from "./items/Time";
import { Workspaces } from "./items/Workspaces";
import { Media } from "./items/Media";
import { Gamemode } from "./items/Gamemode";
import { Notifications } from "./items/Notifications";
import { type CustomNotificationsType } from "../utils/globals";
import { Keyboard } from "./items/Keyboard";
import { Tray } from "./items/Tray";

type BarProps = JSX.IntrinsicElements["window"] & {
  gdkmonitor: Gdk.Monitor;
  media: Accessor<string>;
  gamemode: Accessor<number>;
  notifications: Accessor<CustomNotificationsType>;
};

export const Bar = ({ gdkmonitor, media, gamemode, notifications, $ }: BarProps) => {
	let bar: Astal.Window;

  const monitor = createBinding(gdkmonitor, "connector").as((x) => x || "nic");
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
			$={(self) => {
				bar = self;
				if ($) $(self);
			}}
		>
			<centerbox cssName="centerbox" orientation={Gtk.Orientation.HORIZONTAL}>
				<box $type="start">
					{/*<button
						$type="start"
						onClicked={() => execAsync("echo hello").then(console.log)}
						hexpand
						halign={Gtk.Align.CENTER}
					>
						<label label={monitor} />
          </button>*/}
          <Workspaces gdkmonitor={gdkmonitor} />
					<Media media={media} />
        </box>
				<box $type="center" hexpand halign={Gtk.Align.CENTER}>
					<Time />
				</box>
        <box $type="end">
          <Keyboard />
          <Tray />
          <Gamemode gamemode={gamemode} />
          <Notifications notifications={notifications} />
        </box>
			</centerbox>
		</window>
	);
};
