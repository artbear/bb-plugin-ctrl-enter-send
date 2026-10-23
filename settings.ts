export const sendShortcuts = ["ctrl-enter", "enter", "shift-enter"] as const;
export type SendShortcut = (typeof sendShortcuts)[number];

export function parseSendShortcut(value: unknown): SendShortcut {
  const shortcut = sendShortcuts.find((shortcut) => shortcut === value);
  if (!shortcut) throw new Error("Неизвестная комбинация отправки сообщения");
  return shortcut;
}

export const shortcutLabels: Record<SendShortcut, string> = {
  "ctrl-enter": "Ctrl+Enter / ⌘+Enter",
  enter: "Enter",
  "shift-enter": "Shift+Enter",
};
