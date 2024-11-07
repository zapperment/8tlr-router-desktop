import type { MidiMessage } from "@julusian/midi";
import { formatHex } from "./formatHex";
import { getMidiChannel, getMidiMessageTypeName, getPitchBendValue, getSketchIndex } from "../midi";
import { getNoteName } from "./getNoteName";

type MidiMessageFormat = "hex" | "number" | "pretty";

export function formatMidiMessage(midiMessage: MidiMessage, format: MidiMessageFormat = "hex"): string {
  if (format === "hex") {
    return `${midiMessage.map((messagePart) => formatHex(messagePart)).join(" ")}${midiMessage.length === 2 ? " __" : ""}`;
  }
  if (format === "number") {
    return `${midiMessage.map((messagePart) => String(messagePart).padStart(3, " ")).join(" ")}${midiMessage.length === 2 ? " ___" : ""}`;
  }
  const midiMessageTypeName = getMidiMessageTypeName(midiMessage);
  const midiChannel = getMidiChannel(midiMessage);
  switch (midiMessageTypeName) {
    case "NO":
      return `[${midiMessageTypeName}]  ch: ${String(midiChannel + 1).padStart(2, " ")} | note: ${getNoteName(midiMessage[1])} | vel: ${String(midiMessage[2]).padStart(5, " ")}`;
    case "NF":
      return `[${midiMessageTypeName}]  ch: ${String(midiChannel + 1).padStart(2, " ")} | note: ${getNoteName(midiMessage[1])} |           `;
    case "CC":
      return `[${midiMessageTypeName}]  ch: ${String(midiChannel + 1).padStart(2, " ")} | ctrl: ${String(midiMessage[1]).padStart(4, " ")} | val: ${String(midiMessage[2]).padStart(5, " ")}`;
    case "AT":
      return `[${midiMessageTypeName}]  ch: ${String(midiChannel + 1).padStart(2, " ")} |            | val: ${String(midiMessage[1]).padStart(5, " ")}`;
    case "PB":
      return `[${midiMessageTypeName}]  ch: ${String(midiChannel + 1).padStart(2, " ")} |            | val: ${String(getPitchBendValue(midiMessage)).padStart(5, " ")}`;
    case "SK":
      return `[${midiMessageTypeName}]  ch: ${String(midiChannel + 1).padStart(2, " ")} | skt:  ${String(getSketchIndex(midiMessage) + 1).padStart(4, " ")} | val: ${String(midiMessage[2]).padStart(5, " ")}`;
    default:
      return `[??]  ch: ${String(midiChannel + 1).padStart(2, " ")} |   ${formatMidiMessage(midiMessage, "hex")} |           `;
  }
}
