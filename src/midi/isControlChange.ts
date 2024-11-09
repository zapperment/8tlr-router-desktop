import type { MidiMessage } from "@julusian/midi";

export function isControlChange(message: MidiMessage) {
  const [statusByte] = message;
  return (statusByte & 0xf0) === 0xb0;
}
