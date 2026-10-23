import { useEffect } from "react";
import { definePluginApp, useSettings } from "@get-bb/plugin-sdk/app";
import { createComposerController } from "./composer.ts";
import { parseSendShortcut } from "./settings.ts";

export default definePluginApp((app) => {
  const controller = createComposerController();

  function SettingsSync() {
    const { values, isLoading } = useSettings();
    useEffect(() => {
      if (isLoading || !values) return;
      controller.setShortcut(parseSendShortcut(values.sendShortcut));
    }, [values?.sendShortcut, isLoading]);
    return null;
  }

  app.slots.experimental_appOverlay({
    id: "send-shortcut-settings",
    component: SettingsSync,
  });
  app.contentScripts.register({
    id: "ctrl-enter-send",
    mount: ({ signal }) => controller.mount(signal),
  });
});
