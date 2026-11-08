import QtQuick

// Rounded container that wraps its children in a horizontal row.
// Set `clickable` to receive `clicked` for the whole pill.
Rectangle {
  id: root

  default property alias content: row.data
  property alias spacing: row.spacing
  property int padding: 8
  property bool clickable: false

  signal clicked(var mouse)

  implicitWidth: row.implicitWidth + padding * 2
  implicitHeight: Theme.barHeight - 8
  radius: 12
  color: Theme.pillBg

  Row {
    id: row
    anchors.centerIn: parent
    spacing: 0
  }

  MouseArea {
    anchors.fill: parent
    enabled: root.clickable
    acceptedButtons: Qt.LeftButton | Qt.RightButton
    cursorShape: Qt.PointingHandCursor
    onClicked: mouse => root.clicked(mouse)
  }
}
