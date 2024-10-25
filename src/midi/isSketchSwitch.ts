import type { MidiMessage } from "@julusian/midi";
import { isControlChange } from "./isControlChange";
import { sketchSwitchControlChangeNumber } from "../constants";

export function isSketchSwitch(message: MidiMessage) {
  if (!isControlChange(message)) {
    return false;
  }
  if (message[2] > 7) {
    return false;
  }
  return message[1] === sketchSwitchControlChangeNumber;
}
