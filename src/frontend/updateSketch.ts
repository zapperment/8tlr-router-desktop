export function updateSketch(uiUpdate: UiUpdate) {
  const { type, track, sketch } = uiUpdate;

  if (type !== "sketch") {
    return;
  }

  for (let currSketch = 1; currSketch <= 8; currSketch++) {
    const elements = [];

    elements.push(document.getElementById(`slot-${track}-reason-${currSketch}`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-note`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-cc`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-at`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-pb`));

    for (const element of elements) {
      if (currSketch === sketch) {
        element.classList.remove("inactive");
      } else {
        element.classList.add("inactive");
      }
    }
  }
}
