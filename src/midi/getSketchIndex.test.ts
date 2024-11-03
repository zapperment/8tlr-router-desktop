import { getSketchIndex } from "./getSketchIndex";

describe("The getSketchIndex function", () => {
  describe.each`
    midiMessage          | value
    ${[0xb0, 0x77, 0]}   | ${0}
    ${[0xb0, 0x77, 15]}  | ${0}
    ${[0xb0, 0x77, 16]}  | ${1}
    ${[0xb0, 0x77, 127]} | ${7}
  `("when it receives MIDI message $midiMessage", ({ midiMessage, value }) => {
    it(`returns ${value}`, () => {
      expect(getSketchIndex(midiMessage)).toBe(value);
    });
  });
});
