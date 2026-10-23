---
name: ctrl-enter-send
description: "Configurable message sending in BB with Ctrl+Enter, Enter, or Shift+Enter. Use to explain send shortcuts or configure the ctrl-enter-send plugin."
---

# Send shortcuts

The plugin changes BB's native composers: new threads, thread replies, queued messages, and sent-message editors.

Check the current setting before explaining which keys send a message:

```sh
bb plugin config ctrl-enter-send
```

`sendShortcut` selects the send shortcut:

- `ctrl-enter` — default; Ctrl+Enter or Command+Enter sends, Enter and Shift+Enter insert a new line.
- `enter` — Enter sends, Shift+Enter and Ctrl/Command+Enter insert a new line.
- `shift-enter` — Shift+Enter sends, Enter and Ctrl/Command+Enter insert a new line.

The selected shortcut runs the button's primary action: send, queue, or steer. It sends nothing when the button is unavailable. Holding the shortcut does not send repeatedly.

The setting is available in Settings → Installed plugins → Ctrl+Enter Send. From the CLI:

```sh
bb plugin config ctrl-enter-send set sendShortcut shift-enter
bb plugin config ctrl-enter-send unset sendShortcut
```

Resetting restores Ctrl+Enter. Changes apply in open windows without reloading the plugin. Hovering over an available send button shows the selected shortcut.

Autocomplete menus, voice input, and IME retain BB's behavior. Alt+Enter and Ctrl/Command+Shift+Enter are not intercepted. Disabling the plugin restores BB's keyboard handling and tooltips.
