import type { BrowserWindow } from "electron";
import type { MidiMessage } from "@julusian/midi";
import { getTrackName } from "./getTrackName";
import { getMidiMessageType } from "../midi";
import { getSketch } from "./getSketch";

export function createUiUpdater(browserWindow: BrowserWindow) {
  return (midiMessage: MidiMessage, portIndex: number, isGlobal: boolean) => {
    const type = getMidiMessageType(midiMessage);
    if (!type) {
      // we only update the UI for note, control change, aftertouch (poly and channel),
      // pitch bend and sketch change MIDI messages, everything else is irrelevant
      return;
    }
    const track = getTrackName(midiMessage);
    if (isGlobal) {
      // send global message to all sketches
      for (let sketch: Sketch = 1; sketch <= 8; sketch++) {
        browserWindow.webContents.send("ui-update", { type, track, sketch, value: midiMessage[1] });
      }
    } else {
      // not a global message, send to currently active sketch
      const sketch = getSketch(midiMessage, portIndex);
      browserWindow.webContents.send("ui-update", { type, track, sketch, value: midiMessage[1] });
    }
  };
}
