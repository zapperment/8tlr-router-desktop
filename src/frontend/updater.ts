import { frontendUpdateInterval } from "../constants";

interface TimeoutHandler {
  fhyd: (NodeJS.Timeout | null)[];
  tang: (NodeJS.Timeout | null)[];
  duri: (NodeJS.Timeout | null)[];
  poml: (NodeJS.Timeout | null)[];
  tiff: (NodeJS.Timeout | null)[];
  coco: (NodeJS.Timeout | null)[];
  plum: (NodeJS.Timeout | null)[];
  flam: (NodeJS.Timeout | null)[];
}

export function createUpdater(midiMessageType: MidiMessageType) {
  const timeoutHandler: TimeoutHandler = {
    fhyd: new Array(8).fill(null),
    tang: new Array(8).fill(null),
    duri: new Array(8).fill(null),
    poml: new Array(8).fill(null),
    tiff: new Array(8).fill(null),
    coco: new Array(8).fill(null),
    plum: new Array(8).fill(null),
    flam: new Array(8).fill(null),
  };

  return (uiUpdate: UiUpdate) => {
    const { type, track, sketch } = uiUpdate;
    if (type !== midiMessageType) {
      return;
    }
    if (timeoutHandler[track][sketch]) {
      clearTimeout(timeoutHandler[track][sketch]);
    }
    [
      document.getElementById(`lamp-${track}-live-${midiMessageType}`),
      document.getElementById(`lamp-${track}-reason-${sketch}-${midiMessageType}`),
    ].forEach((element) => element.classList.add(`lamp-${midiMessageType}-lit`));
    timeoutHandler[track][sketch] = setTimeout(() => {
      [
        document.getElementById(`lamp-${track}-live-${midiMessageType}`),
        document.getElementById(`lamp-${track}-reason-${sketch}-${midiMessageType}`),
      ].forEach((element) => element.classList.remove(`lamp-${midiMessageType}-lit`));
      timeoutHandler[track][sketch] = null;
    }, frontendUpdateInterval);
  };
}
