import QtQuick
import Quickshell
import Quickshell.Wayland

PanelWindow {
  id: bar

  anchors {
    top: true
    left: true
    right: true
  }

  implicitHeight: Theme.barHeight
  color: "transparent"
  WlrLayershell.namespace: "quickshell-bar"

  Rectangle {
    anchors.fill: parent
    color: Theme.barBg
  }

  Row {
    id: left
    anchors {
      left: parent.left
      verticalCenter: parent.verticalCenter
      leftMargin: 5
    }
    spacing: 10

    Workspaces { screenName: bar.screen.name }
    Media {}
  }

  Clock {
    anchors.centerIn: parent
  }

  Row {
    id: right
    anchors {
      right: parent.right
      verticalCenter: parent.verticalCenter
      rightMargin: 5
    }
    spacing: 10

    Keyboard {}
    Tray { bar: bar }
    Notifications {}
  }
}
