import { Accessor } from "ags";

type GamemodeProps = {
  gamemode: Accessor<number>;
};

export const Gamemode = ({ gamemode }: GamemodeProps) => {
  return (
    <box class="bar-item gamemode" visible={gamemode.as((x) => x !== 0)}>
      <label label={gamemode.as((x) => `󰺷  ${x}`)} />
    </box>
  );
}