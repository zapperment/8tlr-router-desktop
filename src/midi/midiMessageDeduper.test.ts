import type { MidiMessage } from "@julusian/midi";
import { createMidiMessageDeduper } from "./midiMessageDeduper";

describe("A dedupe function", () => {
  let dedupeMidiMessage: (midiMessage: MidiMessage) => boolean;
  let isDuplicate: boolean;
  beforeEach(() => {
    dedupeMidiMessage = createMidiMessageDeduper();
  });
  describe("when I check if a three-byte-long MIDI message is a duplicate", () => {
    beforeEach(() => {
      isDuplicate = dedupeMidiMessage([1, 2, 3]);
    });
    it("returns false", () => {
      expect(isDuplicate).toBeFalsy();
    });
    describe("and I check the same message again", () => {
      beforeEach(() => {
        isDuplicate = dedupeMidiMessage([1, 2, 3]);
      });
      it("returns true", () => {
        expect(isDuplicate).toBeTruthy();
      });
      describe("and I check the same message once again", () => {
        beforeEach(() => {
          isDuplicate = dedupeMidiMessage([1, 2, 3]);
        });
        it("returns true again", () => {
          expect(isDuplicate).toBeTruthy();
        });
      });
    });
    describe("and I check a different three-byte-long MIDI message with identical first two bytes", () => {
      beforeEach(() => {
        isDuplicate = dedupeMidiMessage([1, 2, 4]);
      });
      it("returns false", () => {
        expect(isDuplicate).toBeFalsy();
      });
      describe("and I check the first message again", () => {
        beforeEach(() => {
          isDuplicate = dedupeMidiMessage([1, 2, 3]);
        });
        it("returns false", () => {
          expect(isDuplicate).toBeFalsy();
        });
      });
    });
    describe("and I check a different three-byte-long MIDI message with identical first byte", () => {
      beforeEach(() => {
        isDuplicate = dedupeMidiMessage([1, 3, 5]);
      });
      it("returns false", () => {
        expect(isDuplicate).toBeFalsy();
      });
      describe("and I check the first message again", () => {
        beforeEach(() => {
          isDuplicate = dedupeMidiMessage([1, 2, 3]);
        });
        it("returns true", () => {
          expect(isDuplicate).toBeTruthy();
        });
        describe("and I check the second message again", () => {
          beforeEach(() => {
            isDuplicate = dedupeMidiMessage([1, 3, 5]);
          });
          it("returns true", () => {
            expect(isDuplicate).toBeTruthy();
          });
        });
      });
    });
  });
  describe("when it receives a MIDI note on message C4 with velocity 100", () => {
    beforeEach(() => {
      isDuplicate = dedupeMidiMessage([0x90, 0x3c, 0x64]);
    });
    it("returns false", () => {
      expect(isDuplicate).toBeFalsy();
    });
    describe("followed by a note off message for the same note", () => {
      beforeEach(() => {
        isDuplicate = dedupeMidiMessage([0x80, 0x3c, 0x40]);
      });
      it("returns false", () => {
        expect(isDuplicate).toBeFalsy();
      });
      describe("followed by another C4 / vel 100", () => {
        beforeEach(() => {
          isDuplicate = dedupeMidiMessage([0x90, 0x3c, 0x64]);
        });
        it("returns false", () => {
          expect(isDuplicate).toBeFalsy();
        });
        describe("followed by another C4 note off", () => {
          beforeEach(() => {
            isDuplicate = dedupeMidiMessage([0x80, 0x3c, 0x40]);
          });
          it("returns false", () => {
            expect(isDuplicate).toBeFalsy();
          });
        });
      });
    });
  });
});
