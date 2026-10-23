import type { SendShortcut } from "./settings.ts";

export interface EnterKey {
  key: string;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  isComposing: boolean;
  keyCode: number;
  repeat: boolean;
}

export interface EnterContext {
  inComposerEditor: boolean;
  menuOpen: boolean;
  voiceActive: boolean;
  submitAvailable: boolean;
}

export type EnterAction = "ignore" | "newline" | "submit" | "swallow";

export function decideEnter(
  event: EnterKey,
  context: EnterContext,
  shortcut: SendShortcut,
): EnterAction {
  if (!context.inComposerEditor || context.menuOpen || context.voiceActive)
    return "ignore";
  if (event.isComposing || event.keyCode === 229 || event.key !== "Enter")
    return "ignore";
  if (
    event.altKey ||
    (event.ctrlKey && event.metaKey) ||
    (event.shiftKey && (event.ctrlKey || event.metaKey))
  )
    return "ignore";

  const pressed =
    event.ctrlKey || event.metaKey
      ? "ctrl-enter"
      : event.shiftKey
        ? "shift-enter"
        : "enter";
  if (pressed !== shortcut) return "newline";
  return !context.submitAvailable || event.repeat ? "swallow" : "submit";
}
