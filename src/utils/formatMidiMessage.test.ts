import { formatMidiMessage } from "./formatMidiMessage";

describe("The formatMidiMessage function", () => {
  describe.each`
    messageDescription          | midiMessage           | format      | expected
    ${"note on"}                | ${[0x90, 0x3c, 0x64]} | ${"hex"}    | ${"90 3C 64"}
    ${"note on"}                | ${[0x90, 0x3c, 0x64]} | ${"number"} | ${"144  60 100"}
    ${"note on"}                | ${[0x90, 0x3c, 0x64]} | ${"pretty"} | ${"[NO]  ch:  1 | note: C  3 | vel:   100"}
    ${"note off"}               | ${[0x90, 0x3c, 0x00]} | ${"hex"}    | ${"90 3C 00"}
    ${"note off"}               | ${[0x90, 0x3c, 0x0]}  | ${"number"} | ${"144  60   0"}
    ${"note off"}               | ${[0x90, 0x3c, 0x00]} | ${"pretty"} | ${"[NF]  ch:  1 | note: C  3 |           "}
    ${"control change"}         | ${[0xb0, 0x01, 0x64]} | ${"hex"}    | ${"B0 01 64"}
    ${"control change"}         | ${[0xb0, 0x01, 0x64]} | ${"number"} | ${"176   1 100"}
    ${"control change"}         | ${[0xb0, 0x01, 0x64]} | ${"pretty"} | ${"[CC]  ch:  1 | ctrl:    1 | val:   100"}
    ${"aftertouch"}             | ${[0xd0, 0x64]}       | ${"hex"}    | ${"D0 64 __"}
    ${"aftertouch"}             | ${[0xd0, 0x64]}       | ${"number"} | ${"208 100 ___"}
    ${"aftertouch"}             | ${[0xd0, 0x64]}       | ${"pretty"} | ${"[AT]  ch:  1 |            | val:   100"}
    ${"pitch bend (max value)"} | ${[0xe0, 0x7f, 0x7f]} | ${"hex"}    | ${"E0 7F 7F"}
    ${"pitch bend (max value)"} | ${[0xe0, 0x7f, 0x7f]} | ${"number"} | ${"224 127 127"}
    ${"pitch bend (max value)"} | ${[0xe0, 0x7f, 0x7f]} | ${"pretty"} | ${"[PB]  ch:  1 |            | val:  8191"}
    ${"pitch bend (min value)"} | ${[0xe0, 0x00, 0x00]} | ${"hex"}    | ${"E0 00 00"}
    ${"pitch bend (min value)"} | ${[0xe0, 0x00, 0x00]} | ${"number"} | ${"224   0   0"}
    ${"pitch bend (min value)"} | ${[0xe0, 0x00, 0x00]} | ${"pretty"} | ${"[PB]  ch:  1 |            | val: -8192"}
    ${"program change"}         | ${[0xc0, 0x03]}       | ${"hex"}    | ${"C0 03 __"}
    ${"program change"}         | ${[0xc0, 0x03]}       | ${"number"} | ${"192   3 ___"}
    ${"program change"}         | ${[0xc0, 0x03]}       | ${"pretty"} | ${"[PG]  ch:  1 |            | val:     3"}
  `("when it receives $messageDescription and format $format", ({ midiMessage, format, expected }) => {
    it(`returns ${expected}`, () => {
      expect(formatMidiMessage(midiMessage, format)).toBe(expected);
    });
  });
});
//B0 47 3F
