import { createState } from "ags";
import { hyprland } from "../../utils/globals";

export const Keyboard = () => {
  const [layout, setLayout] = createState("🇺🇸");
  
  const conn = hyprland.connect("keyboard-layout", (_, __, x) => {
    setLayout(x !== "Czech (QWERTY)" ? "🇺🇸" : "🇨🇿");
  });
  
  return (
    <box class="bar-item keyboard" onDestroy={() => hyprland.disconnect(conn)}>
      <label label={layout} />
    </box>
  );
};
