import type { MidiMessage, Output } from "@julusian/midi";
import createDebug from "debug";
import { formatMidiMessage } from "../utils";

const debug = createDebug("8tlr-router:midi:sendAllNotesOff");

interface Args {
  outputs: Output[];
  noteStatuses?: boolean[][][];
}

/* The function name is actually a bit of a misnomer; Reason ignores
 * MIDI all-notes-off or all-sounds-off messages completely; to avoid
 * hanging notes, we keep track of current notes playing and send note
 * on messages with velocity 0 for these
 */
export function sendAllNotesOff({ outputs, noteStatuses }: Args) {
  for (let outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
    for (let channelIndex = 0; channelIndex < 16; channelIndex++) {
      for (let noteIndex = 0; noteIndex < 128; noteIndex++) {
        if (
          noteStatuses === undefined ||
          noteStatuses[outputIndex][channelIndex][noteIndex] === false
        ) {
          continue;
        }

        // note on with velocity 0
        const noteOn: MidiMessage = [0x90 + channelIndex, noteIndex, 0x00];
        debug(
          `Send note on with velocity zero (${formatMidiMessage(noteOn)}) to port ${outputIndex + 1} on channel ${channelIndex + 1}`,
        );
        outputs[outputIndex].sendMessage(noteOn);
      }
    }
  }
}
