import type { MidiMessage, Output } from "@julusian/midi";
import { getMidiChannel } from "./getMidiChannel";
import createDebug from "debug";
import { isProgramChange } from "./isProgramChange";
import { formatMidiMessage } from "../utils";
import { getMidiMessageType } from "./getMidiMessageType";

export const loggers = {
  ["note-on"]: createDebug("8tlr-router:midi:router:note-on"),
  ["note-off"]: createDebug("8tlr-router:midi:router:note-off"),
  cc: createDebug("8tlr-router:midi:router:cc"),
  at: createDebug("8tlr-router:midi:router:at"),
  pb: createDebug("8tlr-router:midi:router:pb"),
  pgm: createDebug("8tlr-router:midi:router:pgm"),
  other: createDebug("8tlr-router:midi:router:other"),
};

const leftPaddings = {
  ["note-on"]: 1,
  ["note-off"]: 0,
  cc: 6,
  at: 6,
  pb: 6,
  pgm: 5,
  other: 3,
};

interface Args {
  outputs: Output[];
}

export function createMidiMessageRouter({ outputs }: Args): MidiMessageRouter {
  const selectedOutputIndices = new Array<number>(8).fill(0);
  const shiftChannel = new Array<boolean>(8).fill(false);

  return (_: number, inputMidiMessage: MidiMessage) => {
    const outputMidiMessage: MidiMessage = [...inputMidiMessage];
    const inputChannel = getMidiChannel(inputMidiMessage);
    if (inputChannel > 7) {
      loggers.other(`   ${formatMidiMessage(inputMidiMessage, "pretty")} !!! invalid channel`);
      return null;
    }

    const isProgramChangeMessage = isProgramChange(inputMidiMessage);
    if (isProgramChangeMessage) {
      const sketchIndex = inputMidiMessage[1];
      selectedOutputIndices[inputChannel] = Math.floor(sketchIndex / 2);
      shiftChannel[inputChannel] = sketchIndex % 2 !== 0;
    }
    if (shiftChannel[inputChannel]) {
      outputMidiMessage[0] += 8;
    }
    const outputPortIndex = selectedOutputIndices[inputChannel];
    if (!isProgramChangeMessage) {
      const midiMessageType = getMidiMessageType(inputMidiMessage);
      const logger = midiMessageType === null ? loggers.other : loggers[midiMessageType];
      const leftPadding = midiMessageType === null ? leftPaddings.other : leftPaddings[midiMessageType];
      outputs[outputPortIndex].sendMessage(outputMidiMessage);
      logger(
        `${" ".repeat(leftPadding)}${formatMidiMessage(inputMidiMessage, "pretty")} >>> ${formatMidiMessage(outputMidiMessage, "pretty")} | port: ${outputPortIndex + 1}`,
      );
    } else {
      loggers.pgm(`     ${formatMidiMessage(inputMidiMessage, "pretty")}`);
    }

    return {
      outputPortIndex,
      outputMidiMessage,
    };
  };
}
