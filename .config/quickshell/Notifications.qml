import QtQuick
import Quickshell
import Quickshell.Io

// swaync status: bell + notification count (dimmed bell when do-not-disturb is on)
Pill {
  id: root

  clickable: true

  property int count: 0
  property bool dnd: false

  Process {
    running: true
    command: ["swaync-client", "-s"]
    stdout: SplitParser {
      onRead: data => {
        try {
          const s = JSON.parse(data);
          root.count = s.count;
          root.dnd = s.dnd;
        } catch (e) {
          console.warn("swaync: bad output:", data);
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

  Row {
    spacing: 6

    Text {
      anchors.verticalCenter: parent.verticalCenter
      // nf-fa-bell / nf-fa-bell_slash
      text: root.dnd ? "" : ""
      color: root.dnd ? Theme.textDim : Theme.text
      font.family: Theme.iconFont
      font.pixelSize: Theme.fontSize + 1
    }

    Text {
      anchors.verticalCenter: parent.verticalCenter
      visible: root.count > 0
      text: root.count
      color: Theme.text
      font.family: Theme.font
      font.pixelSize: Theme.fontSize
      font.bold: true
    }
  }

  onClicked: mouse => {
    if (mouse.button === Qt.LeftButton)
      root.run(["swaync-client", "-t", "-sw"]);
    else
      root.run(["swaync-client", "-d", "-sw"]);
  }
}
