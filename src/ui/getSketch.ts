import type { MidiMessage } from "@julusian/midi";
import { getMidiChannel } from "../midi";

export function getSketch(midiMessage: MidiMessage, portIndex: number): Sketch {
  const channel = getMidiChannel(midiMessage);
  return (portIndex * 2 + (channel > 7 ? 1 : 0) + 1) as Sketch;
}
