import app from "ags/gtk4/app";
import { createBinding, For, onCleanup, This } from "ags";
import { Bar } from "./bar/Bar";
import { customNotifications, gamemode, media } from "./utils/globals";
// import { Osd } from "./osd/Osd";
// import { Power } from "./power/Power";

export const main = () => {
  // Osd();
  // Power();
  
  const monitors = createBinding(app, "monitors");
  <For each={monitors}>
    {(monitor) => (
      <This this={app}>
        <Bar
          gdkmonitor={monitor}
          media={media}
          gamemode={gamemode}
          notifications={customNotifications}
          $={(self) => onCleanup(() => self.destroy())}
        />
      </This>
    )}
  </For>
};