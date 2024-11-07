import type { MidiMessage } from "@julusian/midi";

import { isSketchSwitch } from "./isSketchSwitch";
import { isNoteOn } from "./isNoteOn";
import { isNoteOff } from "./isNoteOff";
import { isControlChange } from "./isControlChange";
import { isAfterTouch } from "./isAfterTouch";
import { isPitchBend } from "./isPitchBend";

export function getMidiMessageType(midiMessage: MidiMessage): MidiMessageType | null {
  if (isSketchSwitch(midiMessage)) {
    return "sketch";
  }
  if (isNoteOn(midiMessage)) {
    return "note-on";
  }
  if (isNoteOff(midiMessage)) {
    return "note-off";
  }
  if (isControlChange(midiMessage)) {
    return "cc";
  }
  if (isAfterTouch(midiMessage)) {
    return "at";
  }
  if (isPitchBend(midiMessage)) {
    return "sketch";
  }
  return null;
}
