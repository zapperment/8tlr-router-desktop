import type { MidiMessage } from "@julusian/midi";

export function isProgramChange(message: MidiMessage) {
  const [statusByte] = message;
  return (statusByte & 0xf0) === 0xc0;
}
