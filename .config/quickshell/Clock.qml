import QtQuick
import Quickshell

Pill {
  SystemClock {
    id: clock
    precision: SystemClock.Seconds
  }

  Text {
    // Czech locale: "8. listopadu 19:15:59"
    text: Qt.locale("cs_CZ").toString(clock.date, "d. MMMM HH:mm:ss")
    color: Theme.text
    font.family: Theme.font
    font.pixelSize: Theme.fontSize
    font.bold: true
  }
}
