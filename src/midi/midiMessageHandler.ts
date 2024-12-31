import type { MidiMessage } from "@julusian/midi";

interface Args {
  midiMessageRouter: MidiMessageRouter;
  observeMessage: (midiMessage: MidiMessage, portIndex: number) => void;
  uiUpdater: (midiMessage: MidiMessage, portIndex: number, isGlobal: boolean) => void;
  isDuplicate: (midiMessage: MidiMessage) => boolean;
}

export function createMidiMessageHandler({ midiMessageRouter, observeMessage, uiUpdater, isDuplicate }: Args) {
  return (deltaTime: number, midiMessage: MidiMessage) => {
    if (isDuplicate(midiMessage)) {
      return;
    }
    const routingResult = midiMessageRouter(deltaTime, midiMessage);
    if (routingResult === null) {
      return;
    }
    const { outputPortIndex, outputMidiMessage, outputIsGlobal } = routingResult;

    uiUpdater(outputMidiMessage, outputPortIndex, outputIsGlobal);
    if (!outputIsGlobal) {
      observeMessage(outputMidiMessage, outputPortIndex);
    }
  };
}
