import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { OsdModule, revealed, setRevealed, visible } from "./OsdModule";
import giCairo from "cairo";

export const Osd = () => {
	const { TOP, BOTTOM, RIGHT, LEFT } = Astal.WindowAnchor;
	let win: Astal.Window;

	return (
		<window
			name="osd"
			namespace="osd"
			application={app}
			anchor={TOP | BOTTOM | RIGHT | LEFT}
			layer={Astal.Layer.OVERLAY}
			visible={visible}
			$={(self) => (win = self)}
			onNotifyVisible={({ visible }) => {
				if (visible) {
					win.get_native()?.get_surface()?.set_input_region(new giCairo.Region());
				}
			}}
    >
    <revealer
        revealChild={revealed}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.END}
       onNotifyChildRevealed={({ childRevealed }) =>
          setRevealed(childRevealed)
       }
      >
        <box
          marginBottom={5}
          marginTop={5}
          marginEnd={5}
          marginStart={5}
        >
          <OsdModule visible={visible} />
        </box>
      </revealer>
		</window>
	);
};
