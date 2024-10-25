import createDebug from "debug";
import type { Input, Output, MidiMessage } from "@julusian/midi";
import { sendAllNotesOff } from "./sendAllNotesOff";
import { isNoteOn } from "./isNoteOn";
import { isNoteOff } from "./isNoteOff";
import { getMidiChannel } from "./getMidiChannel";

const debug = createDebug("8tlr-router:midi:exitHandler");

interface Args {
  input: Input;
  outputs: Output[];
}

export function createExitHandler({ input, outputs }: Args) {
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
