export function updateSketch(uiUpdate: UiUpdate) {
  const { track, sketch } = uiUpdate;
  for (let currSketch = 1; currSketch <= 8; currSketch++) {
    const elements = [];

    elements.push(document.getElementById(`slot-${track}-reason-${currSketch}`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-note`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-cc`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-at`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-pb`));
    elements.push(document.getElementById(`lamp-${track}-reason-${currSketch}-sketch`));

    for (const element of elements) {
      if (currSketch === sketch) {
        element.classList.remove("inactive");
      } else {
        element.classList.add("inactive");
      }
    }
  }
}
