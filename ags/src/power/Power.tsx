import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { execAsync } from "ags/process";

const actions = [
	{
		label: "Lock",
		icon: "system-lock-screen-symbolic",
		command: "loginctl lock-session",
	},
	{
		label: "Logout",
		icon: "system-log-out-symbolic",
		command: "hyprctl dispatch exit",
	},
	{
		label: "Suspend",
		icon: "weather-clear-night-symbolic",
		command: "systemctl suspend",
	},
	{
		label: "Hibernate",
		icon: "document-save-symbolic",
		command: "systemctl hibernate",
	},
	{
		label: "Reboot",
		icon: "system-reboot-symbolic",
		command: "systemctl reboot",
	},
	{
		label: "Shutdown",
		icon: "system-shutdown-symbolic",
		command: "systemctl poweroff",
	},
];

type ActionButtonProps = {
	label: string;
	icon: string;
	command: string;
};

export const Power = () => {
  let wind: Astal.Window;
	const { TOP, BOTTOM, RIGHT, LEFT } = Astal.WindowAnchor;

	const ActionButton = ({ label, icon, command }: ActionButtonProps) => {
		return (
		<button
      cssClasses={["action-button"]}
      onClicked={() => execAsync(["bash", "-c", command])}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={8}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <image
          iconName={icon}
          pixelSize={48}
          halign={Gtk.Align.CENTER}
        />
        <label label={label} halign={Gtk.Align.CENTER} />
      </box>
    </button>
		);
	};

	return (
		<window
      name="power"
			class="Power"
			anchor={TOP | BOTTOM | LEFT | RIGHT}
			layer={Astal.Layer.OVERLAY}
			keymode={Astal.Keymode.EXCLUSIVE}
			visible={false}
      application={app}
			$={(self) => (wind = self)}
		>
			<Gtk.EventControllerKey
				onKeyPressed={(_, keyval) => {
          // console.log(keyval);
          if (keyval === Gdk.KEY_Escape) {
            wind?.set_visible(false);
					}
				}}
			/>
			<centerbox cssClasses={["wlogout-backdrop"]}>
        <box />
        <box
          cssClasses={["actions-container"]}
          spacing={24}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
        >
          {actions.map(ActionButton)}
        </box>
        <box />
      </centerbox>
		</window>
	);
};
