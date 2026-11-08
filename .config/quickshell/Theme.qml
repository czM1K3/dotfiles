pragma Singleton

import QtQuick
import Quickshell

Singleton {
  readonly property color barBg: Qt.rgba(0.1, 0.1, 0.1, 0.5)
  readonly property color pillBg: Qt.rgba(0.4, 0.4, 0.4, 0.5)
  readonly property color chipBg: Qt.rgba(0.1, 0.1, 0.1, 0.5)
  readonly property color chipFocusedBg: Qt.rgba(0.5, 0.5, 0.5, 0.5)
  readonly property color chipActiveBg: Qt.rgba(0.3, 0.3, 0.3, 0.5)
  readonly property color text: "#ffffff"
  readonly property color textDim: Qt.rgba(0.7, 0.7, 0.7, 1)
  readonly property color textFaint: Qt.rgba(0.5, 0.5, 0.5, 1)
  readonly property color xwayland: Qt.rgba(0.76, 0.27, 0.10, 0.8)

  readonly property string font: "DejaVu Sans"
  readonly property string iconFont: "Symbols Nerd Font"
  readonly property int fontSize: 12
  readonly property int barHeight: 30
}
