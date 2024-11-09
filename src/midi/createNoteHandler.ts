import createDebug from "debug";
import type { Input, Output, MidiMessage } from "@julusian/midi";
import { sendAllNotesOff } from "./sendAllNotesOff";
import { isNoteOn } from "./isNoteOn";
import { isNoteOff } from "./isNoteOff";
import { getMidiChannel } from "./getMidiChannel";
import { formatMidiMessage } from "../utils";

const debug = createDebug("8tlr-router:midi:noteHandler");

interface Args {
  input: Input;
  outputs: Output[];
}

export function createNoteHandler({ input, outputs }: Args) {
  const noteStatuses = new Array(4)
    .fill(null)
    .map(() => new Array(16).fill(null).map(() => new Array(128).fill(false)));
  return {
    handleExit: () => {
      sendAllNotesOff({ outputs, noteStatuses });
      debug("Close MIDI ports");
      input.closePort();
      outputs.forEach((output) => output.closePort());
      debug("Program terminated");
    },
    handleSketchChange: ({ outputIndex, channelIndex }: { outputIndex: number; channelIndex: number }) => {
      for (let noteIndex = 0; noteIndex < 128; noteIndex++) {
        if (noteStatuses[outputIndex][channelIndex][noteIndex] === false) {
          continue;
        }
        const noteOff: MidiMessage = [0x90 + channelIndex, noteIndex, 0x00];
        debug(`${" ".repeat(43)}>>> ${formatMidiMessage(noteOff, "pretty")} | port: ${outputIndex + 1}`);
        outputs[outputIndex].sendMessage(noteOff);
        noteStatuses[outputIndex][channelIndex][noteIndex] = false;
      }
    },
    observeMessage: (midiMessage: MidiMessage, portIndex: number) => {
      const channel = getMidiChannel(midiMessage);
      const on = isNoteOn(midiMessage);
      const off = isNoteOff(midiMessage);
      if (on || off) {
        noteStatuses[portIndex][channel][midiMessage[1]] = on;
      }
    },
  };
}
