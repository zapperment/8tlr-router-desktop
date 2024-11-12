import { frontendUpdateInterval } from "../constants";

interface TimeoutHandler {
  fhyd: NodeJS.Timeout | null;
  tang: NodeJS.Timeout | null;
  duri: NodeJS.Timeout | null;
  poml: NodeJS.Timeout | null;
  tiff: NodeJS.Timeout | null;
  coco: NodeJS.Timeout | null;
  plum: NodeJS.Timeout | null;
  flam: NodeJS.Timeout | null;
}

export function createUpdater(midiMessageType: MidiMessageType) {
  const timeoutHandler: TimeoutHandler = {
    fhyd: null,
    tang: null,
    duri: null,
    poml: null,
    tiff: null,
    coco: null,
    plum: null,
    flam: null,
  };

  return (uiUpdate: UiUpdate) => {
    const { type, track, sketch } = uiUpdate;
    if (type !== midiMessageType) {
      return;
    }
    if (timeoutHandler[track]) {
      clearTimeout(timeoutHandler[track]);
    }
    [
      document.getElementById(`lamp-${track}-live-${midiMessageType}`),
      document.getElementById(`lamp-${track}-reason-${sketch}-${midiMessageType}`),
    ].forEach((element) => element.classList.add(`lamp-${midiMessageType}-lit`));
    timeoutHandler[track] = setTimeout(() => {
      [
        document.getElementById(`lamp-${track}-live-${midiMessageType}`),
        document.getElementById(`lamp-${track}-reason-${sketch}-${midiMessageType}`),
      ].forEach((element) => element.classList.remove(`lamp-${midiMessageType}-lit`));
      timeoutHandler[track] = null;
    }, frontendUpdateInterval);
  };
}
