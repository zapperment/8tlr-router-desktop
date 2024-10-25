import type { MidiMessage } from "@julusian/midi";
import { formatHex } from "./formatHex";

export function formatMidiMessage(midiMessage: MidiMessage, hex = true) {
  if (hex) {
    return `${midiMessage.map((messagePart) => formatHex(messagePart)).join(" ")}`;
  }
  return `${midiMessage.map((messagePart) => String(messagePart).padStart(3, " ")).join(" ")}`;
}
