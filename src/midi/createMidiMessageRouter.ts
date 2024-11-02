import type { MidiMessage, Output } from "@julusian/midi";
import { getMidiChannel } from "./getMidiChannel";
import createDebug from "debug";
import { isSketchSwitch } from "./isSketchSwitch";
import { formatMidiMessage } from "../utils";

// exported for testing only
export const debug = createDebug("8tlr-router:midi:midiMessageRouter");

interface Args {
  outputs: Output[];
}

export function createMidiMessageRouter({ outputs }: Args): MidiMessageRouter {
  const selectedOutputIndices = new Array<number>(8).fill(0);
  const shiftChannel = new Array<boolean>(8).fill(false);

  return (inputMidiMessage: MidiMessage) => {
    const outputMidiMessage: MidiMessage = [...inputMidiMessage];
    const inputChannel = getMidiChannel(inputMidiMessage);
    if (inputChannel > 7) {
      debug(`${formatMidiMessage(inputMidiMessage, "pretty")} !!! invalid channel`);
      return null;
    }

    const isSketchSwitchMessage = isSketchSwitch(inputMidiMessage);
    if (isSketchSwitchMessage) {
      selectedOutputIndices[inputChannel] = Math.floor(inputMidiMessage[2] / 2);
      shiftChannel[inputChannel] = inputMidiMessage[2] % 2 !== 0;
    }
    if (shiftChannel[inputChannel]) {
      outputMidiMessage[0] += 8;
    }
    const outputPortIndex = selectedOutputIndices[inputChannel];
    if (!isSketchSwitchMessage) {
      outputs[outputPortIndex].sendMessage(outputMidiMessage);
      debug(
        `${formatMidiMessage(inputMidiMessage, "pretty")} >>> ${formatMidiMessage(outputMidiMessage, "pretty")} | port: ${outputPortIndex + 1}`,
      );
    } else {
      debug(`${formatMidiMessage(inputMidiMessage, "pretty")}`);
    }

    return {
      outputPortIndex,
      outputMidiMessage,
    };
  };
}
