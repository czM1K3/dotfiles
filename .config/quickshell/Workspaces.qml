import QtQuick
import Quickshell
import Quickshell.Io
import Quickshell.Hyprland

Pill {
  id: root

  // Connector name of the monitor this bar lives on (e.g. "DP-1")
  required property string screenName

  spacing: 2
  padding: 6

  function setWorkspace(id) {
    focusProc.command = ["hyprctl", "dispatch", `hl.dsp.focus({workspace=${id}})`];
    focusProc.running = true;
  }

  Process {
    id: focusProc
  }

  // Resolve a window class to an icon path: desktop entry (by id / StartupWMClass),
  // then the class itself as an icon name, then a generic fallback.
  function iconFor(cls) {
    if (!cls)
      return Quickshell.iconPath("application-default-icon");

    const lower = cls.toLowerCase();
    let entry = DesktopEntries.heuristicLookup(cls);
    if (!entry)
      entry = DesktopEntries.applications.values.find(e =>
        e.id.toLowerCase() === lower || (e.startupClass && e.startupClass.toLowerCase() === lower));

    const candidates = [entry ? entry.icon : "", cls, lower];
    for (const name of candidates) {
      const path = name ? Quickshell.iconPath(name, true) : "";
      if (path !== "")
        return path;
    }
    return Quickshell.iconPath("application-default-icon");
  }

  Repeater {
    model: ScriptModel {
      values: Hyprland.workspaces.values
        .filter(ws => ws.id > 0)
        .sort((a, b) => a.id - b.id)
    }

    delegate: Rectangle {
      id: chip

      required property var modelData
      readonly property var ws: modelData
      readonly property bool onThisMonitor: ws.monitor && ws.monitor.name === root.screenName

      height: root.implicitHeight - 8
      width: chipRow.implicitWidth + 8
      radius: 5
      color: ws.focused ? Theme.chipFocusedBg
           : ws.active && onThisMonitor ? Theme.chipActiveBg
           : Theme.chipBg

      Row {
        id: chipRow
        anchors.centerIn: parent
        spacing: 2

        Text {
          anchors.verticalCenter: parent.verticalCenter
          text: chip.ws.id
          font.family: Theme.font
          font.pixelSize: Theme.fontSize
          font.bold: true
          leftPadding: 2
          rightPadding: 2
          // selected = white, this monitor = light gray, other monitor = grayed out
          color: chip.ws.focused ? Theme.text
               : chip.onThisMonitor ? Theme.textDim
               : Theme.textFaint
        }

        Repeater {
          model: chip.ws.toplevels

          delegate: Rectangle {
            id: appIcon

            required property var modelData
            readonly property var info: modelData.lastIpcObject

            anchors.verticalCenter: parent.verticalCenter
            width: 19
            height: 19
            radius: 4
            color: info && info.xwayland ? Theme.xwayland : "transparent"
            opacity: chip.onThisMonitor || chip.ws.focused ? 1 : 0.45

            Image {
              anchors.centerIn: parent
              width: 15
              height: 15
              sourceSize: Qt.size(30, 30)
              source: root.iconFor(appIcon.info ? appIcon.info.class : "")
              smooth: true
            }
          }
        }
      }

      MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: root.setWorkspace(chip.ws.id)
      }
    }
  }
}
