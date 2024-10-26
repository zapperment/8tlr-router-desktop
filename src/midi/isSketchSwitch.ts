import type { MidiMessage } from "@julusian/midi";
import { sketchSwitchControlChangeNumber } from "../constants";

export function isSketchSwitch(message: MidiMessage) {
  const [statusByte, controlNumber, value] = message;
  return (statusByte & 0xf0) === 0xb0 && controlNumber === sketchSwitchControlChangeNumber && value >= 0 && value <= 7;
}
