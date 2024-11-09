import type { BrowserWindow } from "electron";
import type { MidiMessage } from "@julusian/midi";
import { getTrackName } from "./getTrackName";
import { getMidiMessageType } from "../midi";
import { getSketch } from "./getSketch";

export function createUiUpdater(browserWindow: BrowserWindow) {
  return (midiMessage: MidiMessage, portIndex: number) => {
    const type = getMidiMessageType(midiMessage);
    if (!type) {
      // we only update the UI for note, control change, aftertouch (poly and channel),
      // pitch bend and sketch change MIDI messages, everything else is irrelevant
      return;
    }
    const track = getTrackName(midiMessage);
    const sketch = getSketch(midiMessage, portIndex);
    browserWindow.webContents.send("ui-update", { type, track, sketch, value: midiMessage[1] });
  };
}
