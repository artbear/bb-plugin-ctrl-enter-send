import { z } from "zod";
import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { sendShortcuts, shortcutLabels } from "./settings.ts";

export default function plugin(bb: BbPluginApi) {
  bb.settings.define({
    sendShortcut: {
      type: "select",
      label: "Send messages with",
      options: [...sendShortcuts],
      experimental_optionLabels: shortcutLabels,
      experimental_schema: z.enum(sendShortcuts),
      default: "ctrl-enter",
    },
  });
}
