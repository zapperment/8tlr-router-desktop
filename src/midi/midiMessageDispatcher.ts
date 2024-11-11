import type { MidiMessage } from "@julusian/midi";
import createDebugger from "debug";
import { formatMidiMessage } from "../utils";

const debug = createDebugger("8tlr-router:midi:dispatcher");

interface Args {
  midiMessageHandler: (deltaTime: number, midiMessage: MidiMessage) => MidiMessageRouterResult;
}

interface MidiMessageWithDeltaTime {
  midiMessage: MidiMessage;
  deltaTime: number;
}

export function createMidiMessageDispatcher({ midiMessageHandler }: Args) {
  const queue: MidiMessageWithDeltaTime[] = [];
  let intervalHandler: NodeJS.Timeout | null = null;

  function startDispatchingMidiMessages() {
    debug("Start dispatcher");
    intervalHandler = setInterval(() => {
      if (queue.length === 0) {
        return;
      }
      if (queue.length > 1) {
        debug(`Dispatch ${queue.length} MIDI messages`);
        for (let i = 0; i < queue.length; i++) {
          const { midiMessage, deltaTime } = queue[i];
          debug(`${formatMidiMessage(midiMessage, "pretty")} | ${deltaTime}`);
        }
      }
      for (let i = 0; i < queue.length; i++) {
        const { midiMessage, deltaTime } = queue.pop();
        midiMessageHandler(deltaTime, midiMessage);
      }
    });
  }

  function stopDispatchingMidiMessages() {
    debug("Stop dispatcher");
    clearInterval(intervalHandler);
  }

  function dispatchMidiMessage(deltaTime: number, midiMessage: MidiMessage) {
    queue.push({ midiMessage, deltaTime });
  }

  return {
    startDispatchingMidiMessages,
    stopDispatchingMidiMessages,
    dispatchMidiMessage,
  };
}
