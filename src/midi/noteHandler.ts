import createDebug from "debug";
import type { Input, Output, MidiMessage } from "@julusian/midi";
import { sendAllNotesOff } from "./sendAllNotesOff";
import { isNoteOn } from "./isNoteOn";
import { isNoteOff } from "./isNoteOff";
import { getMidiChannel } from "./getMidiChannel";
import { formatMidiMessage } from "../utils";

const debug = createDebug("8tlr-router:midi:note-handler");

interface Args {
  input: Input;
  outputs: Output[];
  isDuplicate: (midiMessage: MidiMessage) => boolean;
  uiUpdater: (midiMessage: MidiMessage, portIndex: number, isGlobal: boolean) => void;
}

export function createNoteHandler({ input, outputs, isDuplicate, uiUpdater }: Args) {
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
        debug(`${" ".repeat(42)}>>> ${formatMidiMessage(noteOff, "pretty")} | port: ${outputIndex + 1}`);
        outputs[outputIndex].sendMessage(noteOff);
        uiUpdater(noteOff, outputIndex, false);

        // we are creating a MIDI message sent to the output
        // eventually, the router will receive this same MIDI message,
        // but by then, it would be routed to the wrong output;
        // the midiMessageDeduper makes sure this future note off
        // message is ignored
        isDuplicate([0x90, noteIndex, 0x00]);

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
