import type { MidiMessage } from "@julusian/midi";
import { isNoteOn, isNoteOff, isSketchSwitch, isControlChange, isAfterTouch, isPitchBend } from "../midi";

export function getType(midiMessage: MidiMessage): MidiMessageType | null {
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
    return "pb";
  }
  if (isSketchSwitch(midiMessage)) {
    return "sketch";
  }
  return null;
}
