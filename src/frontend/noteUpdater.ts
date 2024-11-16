export function createNoteUpdater() {
  const noteCounts = {
    fhyd: new Array(127).fill(false),
    tang: new Array(127).fill(false),
    duri: new Array(127).fill(false),
    poml: new Array(127).fill(false),
    tiff: new Array(127).fill(false),
    coco: new Array(127).fill(false),
    plum: new Array(127).fill(false),
    flam: new Array(127).fill(false),
  };

  return (uiUpdate: UiUpdate) => {
    const { type, track, sketch, value } = uiUpdate;

    switch (type) {
      case "note-on":
        noteCounts[track][value] = true;
        break;
      case "note-off":
        noteCounts[track][value] = false;
        break;
      default:
        return;
    }

    const isLit = noteCounts[track].some((value) => value);

    [
      document.getElementById(`lamp-${track}-live-note`),
      document.getElementById(`lamp-${track}-reason-${sketch}-note`),
    ].forEach((element) => {
      if (isLit) {
        element.classList.add("lamp-note-lit");
      } else {
        element.classList.remove("lamp-note-lit");
      }
    });
  };
}
