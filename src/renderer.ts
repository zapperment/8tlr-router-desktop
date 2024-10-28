import "./index.css";
import {
  createAfterTouchUpdater,
  createControlChangeUpdater,
  createNoteUpdater,
  createPitchBendUpdater,
  updateSketch,
} from "./frontend";

const updateAfterTouch = createAfterTouchUpdater();
const updateControlChange = createControlChangeUpdater();
const updateNote = createNoteUpdater();
const updatePitchBend = createPitchBendUpdater();

window.electronAPI.onUiUpdate((uiUpdate: UiUpdate) => {
  updateAfterTouch(uiUpdate);
  updateControlChange(uiUpdate);
  updateNote(uiUpdate);
  updatePitchBend(uiUpdate);
  updateSketch(uiUpdate);
});
