import type { MidiMessage } from "@julusian/midi";

export function getSketchIndex(midiMessage: MidiMessage) {
  const [, , value] = midiMessage;
  return Math.floor(value / 16);
}
