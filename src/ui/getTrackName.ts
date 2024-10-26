import type { MidiMessage } from "@julusian/midi";
import { getMidiChannel } from "../midi";

export function getTrackName(midiMessage: MidiMessage): TrackName {
  const channel = getMidiChannel(midiMessage);
  switch (channel) {
    case 0:
    case 8:
      return "fhyd";
    case 1:
    case 9:
      return "tang";
    case 2:
    case 10:
      return "duri";
    case 3:
    case 11:
      return "poml";
    case 4:
    case 12:
      return "tiff";
    case 5:
    case 13:
      return "coco";
    case 6:
    case 14:
      return "plum";
    case 7:
    case 15:
      return "flam";
  }
}
