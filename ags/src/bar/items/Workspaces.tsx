import { Gdk, Gtk } from "ags/gtk4";
import type AstalHyprland from "gi://AstalHyprland";
import { createBinding, For } from "ags";
import { hyprland } from "../../utils/globals";
import { getAppInfo } from "../../utils/apps";

type WorkspacesProps = {
	gdkmonitor: Gdk.Monitor;
};

type WorkspaceButtonProps = {
	ws: AstalHyprland.Workspace;
};

type AppIconProps = {
	window: AstalHyprland.Client;
};

export const Workspaces = ({ gdkmonitor }: WorkspacesProps) => {
	const workspaces = createBinding(hyprland, "workspaces").as((workspaces) =>
		workspaces.filter((ws) => ws.id > 0).sort((a, b) => a.id - b.id),
	);
	const focusedWorkspace = createBinding(hyprland, "focusedWorkspace").as(
		(x) => x?.id || 0,
	);

	const AppIcon = ({ window }: AppIconProps) => {
		const windowClass = window.class;
		const appInfo = getAppInfo(windowClass);
		const iconName = appInfo?.iconName || "application-x-executable";
		const title = createBinding(window, "title");
		const xwayland = createBinding(window, "xwayland");
		const classes = xwayland((xwayland) => {
			const classes = ["icon"];
			if (xwayland) {
				classes.push("xwayland");
			}
			return classes;
		});

		return (
			<image
				cssClasses={classes}
				iconName={iconName}
				tooltipMarkup={title}
				pixelSize={15}
			/>
		);
	};

	const WorkspaceButton = ({ ws }: WorkspaceButtonProps) => {
		const windows = createBinding(ws, "clients");
		const showWindows = windows((w) => w.length !== 0);

		const classNames = focusedWorkspace((fws) => {
			const classes = ["workspace"];
			if (fws && fws === ws.id) {
				classes.push("active");
			}
			if (ws.monitor?.model === gdkmonitor.model) {
				classes.push("current-monitor");
			}
			return classes;
		});

		return (
			<box cssClasses={classNames}>
				<Gtk.GestureClick
					onPressed={(ctrl) => {
						if (ctrl.get_current_button() === Gdk.BUTTON_PRIMARY) {
							ws.focus();
						}
					}}
				/>
				<box>
					<label label={ws.id.toString()} class="number" />
					<box visible={showWindows}>
						<For each={windows}>{(w) => <AppIcon window={w} />}</For>
					</box>
				</box>
			</box>
		);
	};

	return (
		<box class="bar-item workspaces">
			<For each={workspaces}>{(ws) => <WorkspaceButton ws={ws} />}</For>
		</box>
	);
};
