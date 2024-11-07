import type { MidiMessage, Output } from "@julusian/midi";
import { createMidiMessageRouter, loggers } from "./createMidiMessageRouter";
import { sketchSwitchControlChangeNumber } from "../constants";

const outputs: Output[] = new Array(4).fill(null).map(() => ({
  sendMessage: vi.fn(),
  closePort: vi.fn(),
  getPortCount: vi.fn(),
  getPortName: vi.fn(),
  openPort: vi.fn(),
  openVirtualPort: vi.fn(),
  send: vi.fn(),
  destroy: vi.fn(),
  isPortOpen: vi.fn(),
  openPortByName: vi.fn(),
}));

const NOTE_ON_CH1_C2_V100: MidiMessage = [0x90, 0x30, 0x64];
const NOTE_ON_CH9_C2_V100: MidiMessage = [0x98, 0x30, 0x64];
const SKETCH_SWITCH_2: MidiMessage = [0xb0, sketchSwitchControlChangeNumber, 0x10];
const SKETCH_SWITCH_3: MidiMessage = [0xb0, sketchSwitchControlChangeNumber, 0x20];

vi.mock("debug", () => ({ default: () => vi.fn() }));

let result: MidiMessageRouterResult | null;
let midiMessageRouter: MidiMessageRouter;

describe("The router function created by createMidiMessageRouter", () => {
  beforeEach(() => {
    midiMessageRouter = createMidiMessageRouter({ outputs });
  });

  describe("when no sketch switch MIDI message has been received previously", () => {
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

    describe("and it receives a MIDI message on a channel greater than 8", () => {
      beforeEach(() => {
        result = midiMessageRouter(0, NOTE_ON_CH9_C2_V100);
      });

      it("logs an error message", () => {
        expect(loggers.other).toHaveBeenCalledWith("   [NO]  ch:  9 | note: C  3 | vel:   100 !!! invalid channel");
      });

      it("does not route the message to any port", () => {
        expect(outputs[0].sendMessage).not.toHaveBeenCalled();
      });

      it("returns null", () => {
        expect(result).toBeNull();
      });
    });
  });

  describe("when it receives a sketch switch control change for sketch 2", () => {
    beforeEach(() => {
      result = midiMessageRouter(0, SKETCH_SWITCH_2);
    });
    it(`Logs a debug message that indicates that MIDI messages arriving on channel 1
         will now be routed to channel 9 on the same output port`, () => {
      expect(loggers.sketch).toHaveBeenCalledWith("  [SK]  ch:  1 | skt:     2 | val:    16");
    });
    it("returns the correct result", () => {
      expect(result).toMatchInlineSnapshot(`
        {
          "outputMidiMessage": [
            184,
            119,
            16,
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
      result = midiMessageRouter(0, SKETCH_SWITCH_3);
    });
    it(`Logs a debug message that indicates that MIDI messages arriving on channel 1
         will now be routed to channel 1 on output port 2`, () => {
      expect(loggers.sketch).toHaveBeenCalledWith("  [SK]  ch:  1 | skt:     3 | val:    32");
    });
    it("returns the correct result", () => {
      expect(result).toMatchInlineSnapshot(`
        {
          "outputMidiMessage": [
            176,
            119,
            32,
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
