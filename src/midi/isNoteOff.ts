import type { MidiMessage } from "@julusian/midi";

export function isNoteOff(message: MidiMessage) {
  const [statusByte, , velocity] = message;
  const status = statusByte & 0xf0;
  return status === 0x80 || (status === 0x90 && velocity === 0x00);
}
