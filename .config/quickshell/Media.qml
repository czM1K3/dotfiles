import QtQuick
import Quickshell
import Quickshell.Io

Pill {
  id: root

  clickable: true

  property string text: ""

  visible: text !== ""

  // Streams one JSON line per player update, e.g. {"text": "󰐊 Artist - Title", ...}
  Process {
    running: true
    command: ["waybar-mpris", "--autofocus", "--pause", "󰏤", "--play", "󰐊", "--order", "SYMBOL:ARTIST:TITLE"]
    stdout: SplitParser {
      onRead: data => {
        // waybar-mpris emits stray backslashes that are invalid JSON escapes
        const fixed = data.replace(/\\[^"]/g, m => "\\" + m);
        try {
          root.text = JSON.parse(fixed).text || "";
        } catch (e) {
          console.warn("waybar-mpris: bad output:", data);
        }
      }
    }
  }

  Process {
    id: ctl
  }

  function run(cmd) {
    ctl.command = cmd;
    ctl.running = true;
  }

  Text {
    text: root.text
    color: Theme.text
    font.family: Theme.font
    font.pixelSize: Theme.fontSize
    font.bold: true
    elide: Text.ElideRight
    width: Math.min(implicitWidth, 500)
  }

  onClicked: mouse => {
    if (mouse.button === Qt.LeftButton)
      root.run(["waybar-mpris", "--send", "toggle"]);
    else
      root.run(["hyprctl", "dispatch", "hl.dsp.workspace.toggle_special(\"spotify\")"]);
  }
}
