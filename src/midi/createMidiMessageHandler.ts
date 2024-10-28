import type { MidiMessage } from "@julusian/midi";

interface Args {
  midiMessageRouter: MidiMessageRouter;
  observeMessage: (midiMessage: MidiMessage, portIndex: number) => void;
  uiUpdater: (midiMessage: MidiMessage, portIndex: number) => void;
}

export function createMidiMessageHandler({ midiMessageRouter, observeMessage, uiUpdater }: Args) {
  return (_: number, midiMessage: MidiMessage) => {
    const routingResult = midiMessageRouter(midiMessage);
    if (routingResult === null) {
      return;
    }
    const { outputPortIndex, outputMidiMessage } = routingResult;

    uiUpdater(outputMidiMessage, outputPortIndex);
    observeMessage(outputMidiMessage, outputPortIndex);

    return routingResult;
  };
}
