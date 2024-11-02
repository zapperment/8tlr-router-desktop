import { getNoteName } from "./getNoteName";

describe("The getNoteName function", () => {
  describe.each`
    noteNumber | noteName
    ${0}       | ${"C -1"}
    ${60}      | ${"C  4"}
    ${61}      | ${"C# 4"}
    ${127}     | ${"G  9"}
  `("when it receives note number $noteNumber", ({ noteNumber, noteName }) => {
    it(`returns ${noteName}`, () => {
      expect(getNoteName(noteNumber)).toBe(noteName);
    });
  });
});
