# Ctrl+Enter Send

Choose how to send messages in BB's composer: **Ctrl+Enter**, **Enter**, or **Shift+Enter**. The default is **Ctrl+Enter**; this mode also accepts **Command+Enter** on macOS.

## Installation

Requires BB 0.46+ with Plugin SDK 0.6.49+.

```sh
bb plugin install https://github.com/artbear/bb-plugin-ctrl-enter-send --yes
```

## Settings

Open Settings → Installed plugins → Ctrl+Enter Send and select a shortcut under **Send messages with**. BB saves the setting on the server and applies it in open windows without reloading the plugin.

| Setting | Send | New line |
| --- | --- | --- |
| Ctrl+Enter — default | Ctrl+Enter or Command+Enter | Enter or Shift+Enter |
| Enter | Enter | Shift+Enter or Ctrl/Command+Enter |
| Shift+Enter | Shift+Enter | Enter or Ctrl/Command+Enter |

Hover over an available send button to see the selected shortcut. The tooltip preserves the current action's name: send, queue, or steer.

Configure the shortcut from the CLI:

```sh
bb plugin config ctrl-enter-send
bb plugin config ctrl-enter-send set sendShortcut ctrl-enter
bb plugin config ctrl-enter-send set sendShortcut enter
bb plugin config ctrl-enter-send set sendShortcut shift-enter
bb plugin config ctrl-enter-send unset sendShortcut
```

The last command restores the default.

## Behavior

The plugin works in BB's native composers: new threads, thread replies, queued messages, and sent-message editors. The selected shortcut runs the available button's primary action. Holding the shortcut does not send the message repeatedly.

Autocomplete menus, voice input, and IME retain their behavior. Alt+Enter, Ctrl+Shift+Enter, and Command+Shift+Enter remain under BB's control. When the button is unavailable, the selected shortcut sends nothing; BB's explanation remains visible.

Disabling the plugin restores BB's keyboard handling and tooltips.

## Development

```sh
npm ci
npm test
npm run typecheck
bb plugin build .
```

`assets/enter-key.svg` is the monochrome Enter key icon for the marketplace listing.
