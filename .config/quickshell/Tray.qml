import QtQuick
import Quickshell
import Quickshell.Services.SystemTray

Pill {
  id: root

  required property var bar

  spacing: 4
  visible: SystemTray.items.values.length > 0

  Repeater {
    model: SystemTray.items

    delegate: Item {
      id: trayItem

      required property var modelData

      width: 18
      height: 18
      anchors.verticalCenter: parent.verticalCenter

      Image {
        anchors.fill: parent
        source: trayItem.modelData.icon
        sourceSize: Qt.size(36, 36)
        smooth: true
      }

      QsMenuAnchor {
        id: menu
        menu: trayItem.modelData.menu
        anchor.window: root.bar
        anchor.item: trayItem
        anchor.edges: Edges.Bottom
        anchor.gravity: Edges.Bottom
      }

      MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.LeftButton | Qt.RightButton | Qt.MiddleButton
        cursorShape: Qt.PointingHandCursor
        onClicked: mouse => {
          const item = trayItem.modelData;
          if (mouse.button === Qt.LeftButton && !item.onlyMenu)
            item.activate();
          else if (mouse.button === Qt.MiddleButton)
            item.secondaryActivate();
          else if (item.hasMenu)
            menu.open();
        }
      }
    }
  }
}
