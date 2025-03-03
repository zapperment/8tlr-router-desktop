import midi from "@julusian/midi";
import type { MidiMessage, Output } from "@julusian/midi";
import { createMidiMessageRouter, loggers } from "./midiMessageRouter";

vi.mock("@julusian/midi");

const mockedMidi = vi.mocked(midi);

const outputs: Output[] = new Array(4).fill(null).map(() => new mockedMidi.Output());

const NOTE_ON_CH1_C2_V100: MidiMessage = [0x90, 0x30, 0x64];
const NOTE_ON_CH9_C2_V100: MidiMessage = [0x98, 0x30, 0x64];
const CC_71_CH1_V100: MidiMessage = [0xb0, 0x47, 0x64];
const CC_71_CH9_V100: MidiMessage = [0xb8, 0x47, 0x64];
const PROGRAM_CHANGE_2: MidiMessage = [0xc0, 0x01];
const PROGRAM_CHANGE_3: MidiMessage = [0xc0, 0x02];

vi.mock("debug", () => ({ default: () => vi.fn() }));

const handleSketchChange = vi.fn();

let result: MidiMessageRouterResult | null;
let midiMessageRouter: MidiMessageRouter;

describe("The router function created by createMidiMessageRouter", () => {
  beforeEach(() => {
    midiMessageRouter = createMidiMessageRouter({ outputs, handleSketchChange });
  });

  describe("when no program change MIDI message has been received previously", () => {
    describe("and it receives a MIDI message", () => {
      beforeEach(() => {
        result = midiMessageRouter(0, NOTE_ON_CH1_C2_V100);
      });

      it("routes incoming MIDI messages to the default output port", () => {
        expect(outputs[0].sendMessage).toHaveBeenCalledWith(NOTE_ON_CH1_C2_V100);
      });

      it("returns the correct result", () => {
        expect(result).toMatchInlineSnapshot(`
          {
            "outputIsGlobal": false,
            "outputMidiMessage": [
              144,
              48,
              100,
            ],
            "outputPortIndex": 0,
          }
        `);
      });
    });

    describe("and it receives a global MIDI message", () => {
      beforeEach(() => {
        result = midiMessageRouter(0, CC_71_CH1_V100);
      });

      it("routes incoming MIDI messages to all the output ports", () => {
        expect(outputs[0].sendMessage).toHaveBeenCalledWith(CC_71_CH1_V100);
        expect(outputs[0].sendMessage).toHaveBeenCalledWith(CC_71_CH9_V100);
        expect(outputs[1].sendMessage).toHaveBeenCalledWith(CC_71_CH1_V100);
        expect(outputs[1].sendMessage).toHaveBeenCalledWith(CC_71_CH9_V100);
        expect(outputs[2].sendMessage).toHaveBeenCalledWith(CC_71_CH1_V100);
        expect(outputs[2].sendMessage).toHaveBeenCalledWith(CC_71_CH9_V100);
        expect(outputs[3].sendMessage).toHaveBeenCalledWith(CC_71_CH1_V100);
        expect(outputs[3].sendMessage).toHaveBeenCalledWith(CC_71_CH9_V100);
      });

      it("returns the correct result", () => {
        expect(result).toMatchInlineSnapshot(`
          {
            "outputIsGlobal": true,
            "outputMidiMessage": [
              176,
              71,
              100,
            ],
            "outputPortIndex": 0,
          }
        `);
      });
    });

    describe("and it receives a MIDI message on a channel greater than 8", () => {
      beforeEach(() => {
        result = midiMessageRouter(0, NOTE_ON_CH9_C2_V100);
      });

      it("logs an error message", () => {
        expect(loggers.other).toHaveBeenCalledWith("   [NO]  ch:  9 | note: C  2 | vel:   100 !!! invalid channel");
      });

      it("does not route the message to any port", () => {
        expect(outputs[0].sendMessage).not.toHaveBeenCalled();
      });

      it("returns null", () => {
        expect(result).toBeNull();
      });
    });
  });

  describe("when it receives a program change for sketch 2", () => {
    beforeEach(() => {
      result = midiMessageRouter(0, PROGRAM_CHANGE_2);
    });
    it(`Logs a debug message that indicates that a program change message
         with value 1 was received (pgm is zero-based, so 1 is sketch 2)`, () => {
      expect(loggers.pgm).toHaveBeenCalledWith("     [PG]  ch:  1 |            | val:     1");
    });
    it("returns the correct result", () => {
      expect(result).toMatchInlineSnapshot(`
        {
          "outputIsGlobal": false,
          "outputMidiMessage": [
            200,
            1,
          ],
          "outputPortIndex": 0,
        }
      `);
    });
    describe("and then receives a MIDI message on channel 1", () => {
      beforeEach(() => {
        result = midiMessageRouter(0, NOTE_ON_CH1_C2_V100);
      });
      it("routes the MIDI message to channel 9 on output port 1", () => {
        expect(outputs[0].sendMessage).toHaveBeenCalledWith([
          NOTE_ON_CH1_C2_V100[0] + 8,
          NOTE_ON_CH1_C2_V100[1],
          NOTE_ON_CH1_C2_V100[2],
        ]);
      });
      it("returns the correct result", () => {
        expect(result).toMatchInlineSnapshot(`
          {
            "outputIsGlobal": false,
            "outputMidiMessage": [
              152,
              48,
              100,
            ],
            "outputPortIndex": 0,
          }
        `);
      });
    });
  });

  describe("when it receives a sketch switch control change for sketch 3", () => {
    beforeEach(() => {
      result = midiMessageRouter(0, PROGRAM_CHANGE_3);
    });
    it(`Logs a debug message that indicates that a program change message
         with value 1 was received (pgm is zero-based, so 2 is sketch 3)`, () => {
      expect(loggers.pgm).toHaveBeenCalledWith("     [PG]  ch:  1 |            | val:     2");
    });
    it("returns the correct result", () => {
      expect(result).toMatchInlineSnapshot(`
        {
          "outputIsGlobal": false,
          "outputMidiMessage": [
            192,
            2,
          ],
          "outputPortIndex": 1,
        }
      `);
    });
    describe("and then receives a MIDI message on channel 1", () => {
      beforeEach(() => {
        result = midiMessageRouter(0, NOTE_ON_CH1_C2_V100);
      });
      it("routes the MIDI message to channel 1 on output port 2", () => {
        expect(outputs[1].sendMessage).toHaveBeenCalledWith(NOTE_ON_CH1_C2_V100);
      });
      it("returns the correct result", () => {
        expect(result).toMatchInlineSnapshot(`
          {
            "outputIsGlobal": false,
            "outputMidiMessage": [
              144,
              48,
              100,
            ],
            "outputPortIndex": 1,
          }
        `);
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
