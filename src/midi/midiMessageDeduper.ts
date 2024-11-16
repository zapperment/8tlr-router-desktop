import type { MidiMessage } from "@julusian/midi";
import createDebug from "debug";
import { formatMidiMessage } from "../utils";
import { convertNoteOffToNoteOnZeroVel } from "./convertNoteOffToNoteOnZeroVel";

const logDuplicate = createDebug("8tlr-router:midi:deduper:is-duplicate");
const logNoDuplicate = createDebug("8tlr-router:midi:deduper:no-duplicate");

function log(isDuplicate: boolean, midiMessage: MidiMessage) {
  if (isDuplicate) {
    logDuplicate(`Duplicate: ${formatMidiMessage(midiMessage)}`);
  } else {
    logNoDuplicate(`No duplicate: ${formatMidiMessage(midiMessage)}`);
  }
}

export function createMidiMessageDeduper() {
  const lastThreeByteMessage: (number | null)[][] = new Array(256)
    .fill(null)
    .map(() => new Array(256).fill(null).map(() => null));
  const lastTwoByteMessage: (number | null)[] = new Array(256).fill(null).map(() => null);

  return (midiMessage: MidiMessage) => {
    if (midiMessage.length === 2) {
      // MIDI message with two bytes,
      // e.g. channel pressure, program change
      const [status, data] = midiMessage;
      const isDuplicate = lastTwoByteMessage[status] === data;
      lastTwoByteMessage[status] = data;
      log(isDuplicate, midiMessage);
      return isDuplicate;
    }
    if (midiMessage.length === 3) {
      const normalisedMidiMessage = convertNoteOffToNoteOnZeroVel(midiMessage);
      // MIDI messages with three bytes,
      // e.g. note on, control change
      const [status, data1, data2] = normalisedMidiMessage;
      const isDuplicate = lastThreeByteMessage[status][data1] === data2;
      lastThreeByteMessage[status][data1] = data2;
      log(isDuplicate, normalisedMidiMessage);
      return isDuplicate;
    }
    // don't dedupe MIDI messages that don't have 2 or 3 bytes,
    // e.g. clock, system reset, system exclusive
    log(false, midiMessage);
    return false;
  };
}
