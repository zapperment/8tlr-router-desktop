import { getNoteName } from "./getNoteName";

describe("The getNoteName function", () => {
  describe.each`
    noteNumber | noteName
    ${0}       | ${"C -2"}
    ${60}      | ${"C  3"}
    ${61}      | ${"C# 3"}
    ${127}     | ${"G  8"}
  `("when it receives note number $noteNumber", ({ noteNumber, noteName }) => {
    it(`returns ${noteName}`, () => {
      expect(getNoteName(noteNumber)).toBe(noteName);
    });
  });
});
