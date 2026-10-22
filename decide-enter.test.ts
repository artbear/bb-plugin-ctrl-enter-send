import assert from "node:assert/strict";
import test from "node:test";
import { decideEnter, type EnterContext, type EnterKey } from "./decide-enter.ts";

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

test("bare Enter inserts a newline", () => {
  assert.equal(decideEnter(baseKey, ready), "newline");
});

test("Ctrl+Enter and Command+Enter submit", () => {
  assert.equal(decideEnter({ ...baseKey, ctrlKey: true }, ready), "submit");
  assert.equal(decideEnter({ ...baseKey, metaKey: true }, ready), "submit");
});

test("a repeated submit chord is consumed without sending again", () => {
  assert.equal(
    decideEnter({ ...baseKey, ctrlKey: true, repeat: true }, ready),
    "swallow",
  );
});

test("Ctrl+Enter stays native when the send button cannot submit", () => {
  assert.equal(
    decideEnter({ ...baseKey, ctrlKey: true }, { ...ready, submitAvailable: false }),
    "ignore",
  );
});

test("Shift+Enter, Alt+Enter, and the terminal chord stay native", () => {
  assert.equal(decideEnter({ ...baseKey, shiftKey: true }, ready), "ignore");
  assert.equal(decideEnter({ ...baseKey, altKey: true }, ready), "ignore");
  assert.equal(
    decideEnter({ ...baseKey, ctrlKey: true, shiftKey: true }, ready),
    "ignore",
  );
});

test("suggestion menu, voice recording, and IME keep Enter", () => {
  assert.equal(decideEnter(baseKey, { ...ready, menuOpen: true }), "ignore");
  assert.equal(decideEnter(baseKey, { ...ready, voiceActive: true }), "ignore");
  assert.equal(decideEnter({ ...baseKey, isComposing: true }, ready), "ignore");
  assert.equal(decideEnter({ ...baseKey, keyCode: 229 }, ready), "ignore");
});

test("Enter outside the composer is ignored", () => {
  assert.equal(
    decideEnter(baseKey, { ...ready, inComposerEditor: false }),
    "ignore",
  );
});
