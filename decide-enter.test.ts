import assert from "node:assert/strict";
import test from "node:test";
import {
  decideEnter,
  type EnterContext,
  type EnterKey,
} from "./decide-enter.ts";
import type { SendShortcut } from "./settings.ts";

const baseKey: EnterKey = {
  key: "Enter",
  shiftKey: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  isComposing: false,
  keyCode: 13,
  repeat: false,
};
const ready: EnterContext = {
  inComposerEditor: true,
  menuOpen: false,
  voiceActive: false,
  submitAvailable: true,
};
const modes: SendShortcut[] = ["ctrl-enter", "enter", "shift-enter"];
const chords: { shortcut: SendShortcut; key: EnterKey }[] = [
  { shortcut: "enter", key: baseKey },
  { shortcut: "ctrl-enter", key: { ...baseKey, ctrlKey: true } },
  { shortcut: "ctrl-enter", key: { ...baseKey, metaKey: true } },
  { shortcut: "shift-enter", key: { ...baseKey, shiftKey: true } },
];

for (const mode of modes) {
  test(`${mode}: only the selected chord sends; the others insert a newline`, () => {
    for (const chord of chords) {
      assert.equal(
        decideEnter(chord.key, ready, mode),
        chord.shortcut === mode ? "submit" : "newline",
      );
      if (chord.shortcut !== mode) continue;
      assert.equal(
        decideEnter({ ...chord.key, repeat: true }, ready, mode),
        "swallow",
      );
      assert.equal(
        decideEnter(chord.key, { ...ready, submitAvailable: false }, mode),
        "swallow",
      );
    }
  });

  test(`${mode}: menus, voice, IME and unrelated shortcuts keep their native handling`, () => {
    for (const chord of chords) {
      for (const context of [
        { ...ready, menuOpen: true },
        { ...ready, voiceActive: true },
        { ...ready, inComposerEditor: false },
      ])
        assert.equal(decideEnter(chord.key, context, mode), "ignore");
      assert.equal(
        decideEnter({ ...chord.key, isComposing: true }, ready, mode),
        "ignore",
      );
      assert.equal(
        decideEnter({ ...chord.key, keyCode: 229 }, ready, mode),
        "ignore",
      );
    }
    for (const changes of [
      { altKey: true },
      { ctrlKey: true, shiftKey: true },
      { metaKey: true, shiftKey: true },
      { ctrlKey: true, metaKey: true },
      { key: "a" },
    ])
      assert.equal(
        decideEnter({ ...baseKey, ...changes }, ready, mode),
        "ignore",
      );
  });
}
