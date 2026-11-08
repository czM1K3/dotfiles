import { Gdk, Gtk } from "ags/gtk4";
import type AstalHyprland from "gi://AstalHyprland";
import { createBinding, createComputed, For } from "ags";
import { execAsync } from "ags/process";
import { hyprland } from "../../services/hyprland";
import { getAppInfo } from "../../utils/apps";

const workspaces = createBinding(hyprland, "workspaces").as((workspaces) =>
	workspaces.filter((ws) => ws.id > 0).sort((a, b) => a.id - b.id),
);
const focusedWorkspaceId = createBinding(hyprland, "focusedWorkspace").as(
	(ws) => ws?.id ?? 0,
);

const AppIcon = ({ window }: { window: AstalHyprland.Client }) => {
	const iconName =
		getAppInfo(window.class)?.iconName || "application-x-executable";
	const classes = createBinding(window, "xwayland").as((xwayland) =>
		xwayland ? ["icon", "xwayland"] : ["icon"],
	);

	return (
		<image
			cssClasses={classes}
			iconName={iconName}
			tooltipMarkup={createBinding(window, "title")}
			pixelSize={15}
		/>
	);
};

type WorkspaceButtonProps = {
	ws: AstalHyprland.Workspace;
	gdkmonitor: Gdk.Monitor;
};

const WorkspaceButton = ({ ws, gdkmonitor }: WorkspaceButtonProps) => {
	const clients = createBinding(ws, "clients");
	const monitor = createBinding(ws, "monitor");

	const classes = createComputed(() => {
		const classes = ["workspace"];
		if (focusedWorkspaceId() === ws.id) classes.push("active");
		if (monitor()?.model === gdkmonitor.model) classes.push("current-monitor");
		return classes;
	});

	return (
		<box cssClasses={classes}>
			<Gtk.GestureClick
				onPressed={(ctrl) => {
					if (ctrl.get_current_button() !== Gdk.BUTTON_PRIMARY) return;
					execAsync([
						"hyprctl",
						"dispatch",
						`hl.dsp.focus({ workspace = ${ws.id} })`,
					]).catch(console.error);
				}}
			/>
			<label label={ws.id.toString()} class="number" />
			<box visible={clients((c) => c.length !== 0)}>
				<For each={clients}>{(client) => <AppIcon window={client} />}</For>
			</box>
		</box>
	);
};

export const Workspaces = ({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) => (
	<box class="bar-item workspaces">
		<For each={workspaces}>
			{(ws) => <WorkspaceButton ws={ws} gdkmonitor={gdkmonitor} />}
		</For>
	</box>
);
