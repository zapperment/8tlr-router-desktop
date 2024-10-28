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
    if (type === "note-on") {
      noteCounts[track][value] = true;
      console.log("Note on:", value);
    }
    if (type === "note-off") {
      noteCounts[track][value]=false;
      console.log("Note off:", value);
    }
    const isLit=noteCounts[track].some(value => value);
    console.log("is lit:", isLit);

    [
      document.getElementById(`lamp-${track}-live-note`),
      document.getElementById(`lamp-${track}-reason-${sketch}-note`)

    ].forEach(element => {
      if (isLit) {
        element.classList.add("lamp-note-lit");
      } else {
        element.classList.remove("lamp-note-lit");
      }
    })
  };
}
