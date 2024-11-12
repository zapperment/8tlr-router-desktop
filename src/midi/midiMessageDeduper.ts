import type { MidiMessage } from "@julusian/midi";

export function createMidiMessageDeduper() {
  const lastThreeByteMessage: (number | null)[][] = new Array(128)
    .fill(null)
    .map(() => new Array(128).fill(null).map(() => null));
  const lastTwoByteMessage: (number | null)[] = new Array(128).fill(null).map(() => null);

  return (midiMessage: MidiMessage) => {
    switch (midiMessage.length) {
      case 2: {
        // MIDI message with two bytes,
        // e.g. channel pressure, program change
        const [status, data] = midiMessage;
        const isDuplicate = lastTwoByteMessage[status] === data;
        lastTwoByteMessage[status] = data;
        return isDuplicate;
      }
      case 3: {
        // MIDI messages with three bytes,
        // e.g. note on, control change
        const [status, data1, data2] = midiMessage;
        const isDuplicate = lastThreeByteMessage[status][data1] === data2;
        lastThreeByteMessage[status][data1] = data2;
        return isDuplicate;
      }
      default:
        // don't dedupe MIDI messages that don't have 2 or 3 bytes,
        // e.g. clock, system reset, system exclusive
        return false;
    }
  };
}
