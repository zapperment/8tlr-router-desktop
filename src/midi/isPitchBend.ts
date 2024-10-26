import type { MidiMessage } from "@julusian/midi";

export function isPitchBend(midiMessage: MidiMessage) {
  const [statusByte] = midiMessage;
  return (statusByte & 0xf0) === 0xe0;
}
