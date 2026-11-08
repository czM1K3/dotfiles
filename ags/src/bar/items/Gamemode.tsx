import { gamemode } from "../../services/gamemode";

export const Gamemode = () => (
	<box class="bar-item gamemode" visible={gamemode((x) => x !== 0)}>
		<label label={gamemode((x) => `󰺷  ${x}`)} />
	</box>
);
