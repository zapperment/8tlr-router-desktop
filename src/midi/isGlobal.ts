import type { MidiMessage } from "@julusian/midi";
import { isAfterTouch, isControlChange, isPitchBend } from ".";

// “global” MIDI messages are not routed to the currently active sketch,
// but to all the sketches, affecting controls on each sketch's Combinator
export function isGlobal(message: MidiMessage) {
  return isAfterTouch(message) || isControlChange(message) || isPitchBend(message);
}
