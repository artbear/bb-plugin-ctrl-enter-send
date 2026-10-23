import assert from "node:assert/strict";
import test from "node:test";
import { createFakePluginHost } from "@get-bb/plugin-sdk/testing";
import plugin from "./server.ts";

test("settings accept all send modes and reject invalid saved values", async () => {
  const { bb, harness } = createFakePluginHost({ pluginId: "ctrl-enter-send" });
  try {
    await plugin(bb);
    for (const sendShortcut of ["ctrl-enter", "enter", "shift-enter", null]) {
      await harness.behavior.setSettings({ sendShortcut });
    }
    await assert.rejects(
      harness.behavior.setSettings({ sendShortcut: "alt-enter" }),
    );
    await assert.rejects(harness.behavior.setSettings({ sendShortcut: true }));
  } finally {
    await harness.lifecycle.dispose();
  }
});
