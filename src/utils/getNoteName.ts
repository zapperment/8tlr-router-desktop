export function getNoteName(noteNumber: number): string {
  if (noteNumber < 0 || noteNumber > 127) {
    throw new Error("Note number must be between 0 and 127");
  }

  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const note = noteNames[noteNumber % 12];
  const octave = Math.floor(noteNumber / 12) - 2;

  return `${String(note).padEnd(2, " ")}${String(octave).padStart(2, " ")}`;
}
