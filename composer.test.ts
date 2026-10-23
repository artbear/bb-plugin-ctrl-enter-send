import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { createComposerController } from "./composer.ts";

test("hover hints follow settings and composer state, and are restored on disposal", async () => {
  const dom = new JSDOM(
    '<form data-promptbox><button type="submit" data-promptbox-submit-action aria-label="Queue (Enter)" title="Original" aria-keyshortcuts="Enter">Send</button></form><button type="submit" title="Outside">Other form</button>',
  );
  const globals = [
    "document",
    "window",
    "Element",
    "HTMLButtonElement",
    "MutationObserver",
  ];
  const descriptors = new Map(
    globals.map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  for (const key of globals)
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: Reflect.get(dom.window, key),
    });
  const abort = new dom.window.AbortController();
  const controller = createComposerController();
  const dispose = controller.mount(abort.signal);
  const flush = () =>
    new Promise((resolve) => dom.window.setTimeout(resolve, 0));
  try {
    const button = dom.window.document.querySelector("button")!;
    assert.equal(button.title, "Original");
    controller.setShortcut("ctrl-enter");
    assert.equal(button.title, "Queue (Ctrl+Enter / ⌘+Enter)");
    assert.equal(
      button.getAttribute("aria-keyshortcuts"),
      "Control+Enter Meta+Enter",
    );
    controller.setShortcut("shift-enter");
    assert.equal(button.title, "Queue (Shift+Enter)");
    button.setAttribute("aria-label", "Steer (Enter)");
    await flush();
    assert.equal(button.title, "Steer (Shift+Enter)");
    button.disabled = true;
    await flush();
    assert.equal(button.title, "Original");
    button.disabled = false;
    controller.setShortcut("enter");
    await flush();
    assert.equal(button.title, "Steer (Enter)");
    const second = button.cloneNode(true);
    if (!(second instanceof dom.window.HTMLButtonElement))
      throw new Error("Missing button");
    second.removeAttribute("title");
    second.removeAttribute("aria-keyshortcuts");
    button.parentElement!.append(second);
    await flush();
    assert.equal(second.title, "Steer (Enter)");
    button.type = "button";
    button.setAttribute("aria-label", "Stop run");
    await flush();
    assert.equal(button.title, "Original");
    assert.equal(
      dom.window.document.querySelector('button[title="Outside"]')?.textContent,
      "Other form",
    );
    abort.abort();
    dispose();
    assert.equal(second.hasAttribute("title"), false);
    assert.equal(second.hasAttribute("aria-keyshortcuts"), false);
    assert.equal(button.getAttribute("aria-keyshortcuts"), "Enter");
    controller.setShortcut("ctrl-enter");
    await flush();
    assert.equal(second.hasAttribute("title"), false);
  } finally {
    abort.abort();
    dispose();
    dom.window.close();
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
