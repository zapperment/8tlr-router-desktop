import type { MidiMessage, Output } from "@julusian/midi";
import { getMidiChannel } from "./getMidiChannel";
import createDebug from "debug";
import { isSketchSwitch } from "./isSketchSwitch";

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
      debug(`Invalid data - received MIDI message on channel ${inputChannel + 1}`);
      return null;
    }

    const isSketchSwitchMessage = isSketchSwitch(inputMidiMessage);
    if (isSketchSwitchMessage) {
      selectedOutputIndices[inputChannel] = Math.floor(inputMidiMessage[2] / 2);
      shiftChannel[inputChannel] = inputMidiMessage[2] % 2 !== 0;
      debug(`Sketch switch ${inputMidiMessage[2] + 1}: out=${selectedOutputIndices} / shift=${shiftChannel}`);
    }
    if (shiftChannel[inputChannel]) {
      outputMidiMessage[0] += 8;
    }
    const outputPortIndex = selectedOutputIndices[inputChannel];
    debug(`Output port index: ${outputPortIndex}`);
    if (!isSketchSwitchMessage) {
      outputs[outputPortIndex].sendMessage(outputMidiMessage);
    }

    return {
      outputPortIndex,
      outputMidiMessage,
    };
  };
}
