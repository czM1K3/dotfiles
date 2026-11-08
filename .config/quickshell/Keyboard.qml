import QtQuick
import Quickshell
import Quickshell.Hyprland
import Quickshell.Io

// Shows the active layout as a flag: "Czech (coder)" -> US flag, "Czech (QWERTY)" -> CZ flag.
Pill {
  id: root

  property bool qwerty: false

  function update(keymap) {
    root.qwerty = keymap.toLowerCase().includes("qwerty");
  }

  // Initial state
  Process {
    running: true
    command: ["hyprctl", "devices", "-j"]
    stdout: StdioCollector {
      onStreamFinished: {
        try {
          const kbs = JSON.parse(text).keyboards;
          const main = kbs.find(k => k.main) || kbs[0];
          if (main)
            root.update(main.active_keymap);
        } catch (e) {
          console.warn("keyboard: could not parse hyprctl devices");
        }
      }
    }
  }

  // Live changes: "activelayout>>keyboard-name,Layout Name"
  Connections {
    target: Hyprland
    function onRawEvent(event) {
      if (event.name !== "activelayout")
        return;
      const i = event.data.indexOf(",");
      root.update(event.data.substring(i + 1));
    }
  }

  Text {
    text: root.qwerty ? "🇨🇿" : "🇺🇸"
    font.pixelSize: Theme.fontSize + 1
    color: Theme.text
  }
}
