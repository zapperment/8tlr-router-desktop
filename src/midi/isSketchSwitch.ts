import type { MidiMessage } from "@julusian/midi";
import { sketchSwitchControlChangeNumber } from "../constants";

export function isSketchSwitch(message: MidiMessage) {
  const [statusByte, controlNumber] = message;
  return (statusByte & 0xf0) === 0xb0 && controlNumber === sketchSwitchControlChangeNumber;
}
