import midi from "@julusian/midi";
import type { Input, Output } from "@julusian/midi";
import { withFatalErrorOnNull } from "../utils";
import { getPortIndex } from "./getPortIndex";

export function initPort<T extends Input | Output>(
  portName: string,
  portType: "input" | "output",
): T {
  let midiInterface: T;

  if (portType === "input") {
    midiInterface = new midi.Input() as T;
  } else {
    midiInterface = new midi.Output() as T;
  }

  const portIndex = withFatalErrorOnNull<number>(
    `MIDI ${portType} port ${portName} not found`,
  )(() => getPortIndex(midiInterface, portName));

  midiInterface.openPort(portIndex);

  return midiInterface;
}
