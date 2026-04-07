import { Accessor } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";

type MediaProps = {
	media: Accessor<string>;
};

export const Media = ({ media }: MediaProps) => {
	return (
    <box
      class="bar-item media"
      visible={media.as((x) => Boolean(x))}
    >
      <Gtk.GestureClick
        onPressed={async (ctrl) => {
          const button = ctrl.get_current_button();
          switch (button) {
            case Gdk.BUTTON_PRIMARY:
              await execAsync("waybar-mpris --send toggle")
              break;
            case Gdk.BUTTON_SECONDARY:
              execAsync("hyprctl dispatch togglespecialworkspace spotify");
              break;
          }
        }}
				button={0}
      />
			<label label={media} />
		</box>
	);
};
