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
  handleSketchChange: ({ outputIndex, channelIndex }: { outputIndex: number; channelIndex: number }) => void;
}

export function createMidiMessageRouter({ outputs, handleSketchChange }: Args): MidiMessageRouter {
  const selectedOutputIndices = new Array<number>(8).fill(0);
  const shiftChannel = new Array<boolean>(8).fill(false);

  return (deltaTime: number, inputMidiMessage: MidiMessage) => {
    const outputMidiMessage: MidiMessage = [...inputMidiMessage];
    const inputChannel = getMidiChannel(inputMidiMessage);
    if (inputChannel > 7) {
      loggers.other(`   ${deltaTime} ${formatMidiMessage(inputMidiMessage, "pretty")} !!! invalid channel`);
      return null;
    }

    const isProgramChangeMessage = isProgramChange(inputMidiMessage);
    if (isProgramChangeMessage) {
      // send not off messages on previous sketch channel / port
      handleSketchChange({
        outputIndex: selectedOutputIndices[inputChannel],
        channelIndex: shiftChannel[inputChannel] ? inputChannel + 8 : inputChannel,
      });

      const sketchIndex = inputMidiMessage[1];

      /*
       * 0 => 0
       * 1 => 0
       * 2 => 1
       * 3 => 1
       * 4 => 2
       * 5 => 2
       * 6 => 3
       * 7 => 3
       */
      selectedOutputIndices[inputChannel] = Math.floor(sketchIndex / 2);

      /*
       * 0 => false
       * 1 => true
       * 2 => false
       * 3 => true
       * 4 => false
       * 5 => true
       * 6 => false
       * 7 => true
       */
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
        `${" ".repeat(leftPadding)}${deltaTime} ${formatMidiMessage(inputMidiMessage, "pretty")} >>> ${formatMidiMessage(outputMidiMessage, "pretty")} | port: ${outputPortIndex + 1}`,
      );
    } else {
      loggers.pgm(`     ${deltaTime} ${formatMidiMessage(inputMidiMessage, "pretty")}`);
    }

    return {
      outputPortIndex,
      outputMidiMessage,
    };
  };
}
