import type { MidiMessage, Output } from "@julusian/midi";
import createDebug from "debug";
import { formatMidiMessage } from "../utils";

const debug = createDebug("8tlr-router:midi:sendAllNotesOff");

interface Args {
  outputs: Output[];
  noteStatuses: boolean[][][];
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
        if (noteStatuses[outputIndex][channelIndex][noteIndex] === false) {
          continue;
        }

        // note on with velocity 0
        const noteOff: MidiMessage = [0x90 + channelIndex, noteIndex, 0x00];
        debug(`${" ".repeat(41)}>>> ${formatMidiMessage(noteOff, "pretty")} | port: ${outputIndex + 1}`);
        outputs[outputIndex].sendMessage(noteOff);
      }
    }
  }
}
