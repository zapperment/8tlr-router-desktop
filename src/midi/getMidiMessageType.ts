import type { MidiMessage } from "@julusian/midi";

import { isSketchSwitch } from "./isSketchSwitch";
import { isNoteOn } from "./isNoteOn";
import { isNoteOff } from "./isNoteOff";
import { isControlChange } from "./isControlChange";
import { isAfterTouch } from "./isAfterTouch";
import { isPitchBend } from "./isPitchBend";

export function getMidiMessageType(midiMessage: MidiMessage, verbose = false) {
  if (isSketchSwitch(midiMessage)) {
    return verbose ? "sketch switch" : "SK";
  }
  if (isNoteOn(midiMessage)) {
    return verbose ? "note on" : "NO";
  }
  if (isNoteOff(midiMessage)) {
    return verbose ? "note off" : "NF";
  }
  if (isControlChange(midiMessage)) {
    return verbose ? "control change" : "CC";
  }
  if (isAfterTouch(midiMessage)) {
    return verbose ? "aftertouch" : "AT";
  }
  if (isPitchBend(midiMessage)) {
    return verbose ? "pitch bend" : "PB";
  }
  return null;
}
