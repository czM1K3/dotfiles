import type { Accessor } from "ags";
import { Gtk } from "ags/gtk4";

type MeterProps = {
	/** Item name, used as a CSS class (e.g. "battery"). */
	name: string;
	/** Extra CSS classes, space separated; may change over time. */
	modifiers?: Accessor<string>;
	icon: string | Accessor<string>;
	/** Bar fill, 0 to 1. */
	fraction: Accessor<number>;
	/** Text drawn over the bar. */
	label: Accessor<string>;
	/** Optional element placed to the right of the bar. */
	suffix?: JSX.Element;
	onPressed?: (ctrl: Gtk.GestureClick) => void;
};

/** Icon + progress bar with text overlaid + optional suffix. */
export const Meter = ({
	name,
	modifiers,
	icon,
	fraction,
	label,
	suffix,
	onPressed,
}: MeterProps) => (
	<box
		class={
			modifiers
				? modifiers.as((m) => `bar-item meter ${name} ${m}`)
				: `bar-item meter ${name}`
		}
	>
		{onPressed && <Gtk.GestureClick onPressed={onPressed} button={0} />}
		<label class="icon" label={icon} />
		<Gtk.Overlay>
			<Gtk.ProgressBar
				class="level"
				valign={Gtk.Align.CENTER}
				fraction={fraction}
			/>
			<label $type="overlay" class="percentage" label={label} />
		</Gtk.Overlay>
		{suffix}
	</box>
);
