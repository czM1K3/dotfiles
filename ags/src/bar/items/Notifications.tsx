import { Accessor } from "ags";
import { CustomNotificationsType } from "../../utils/globals";
import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";

type NotificationsProps = {
	notifications: Accessor<CustomNotificationsType>;
};

export const Notifications = ({ notifications }: NotificationsProps) => {
	const icon = notifications.as((x) => (x.dnd ? "" : ""));
	const count = notifications.as((x) => x.count);
	return (
    <box class="bar-item notifications" visible={count.as((x) => x > 0)}>
      <Gtk.GestureClick
           onPressed={async (ctrl) => {
             const button = ctrl.get_current_button();
             switch (button) {
               case Gdk.BUTTON_PRIMARY:
                 await execAsync("swaync-client -t -sw")
                 break;
               case Gdk.BUTTON_SECONDARY:
                 await execAsync("swaync-client -d -sw");
                 break;
             }
           }}
				button={0}
			/>
			<box>
				<label label={icon} class="icon" />
				<label label={count.as((x) => x.toString())} />
			</box>
		</box>
	);
};
