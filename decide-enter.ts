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

/** `swallow` consumes the key and performs no composer action. */
export type EnterAction = "ignore" | "newline" | "submit" | "swallow";

/**
 * Bare Enter inserts a newline. Ctrl+Enter or Command+Enter runs the
 * composer's primary submit when that button is available.
 * Shift+Enter, Alt+Enter, and Ctrl/Command+Shift+Enter stay with bb.
 */
export function decideEnter(event: EnterKey, context: EnterContext): EnterAction {
  if (!context.inComposerEditor || context.menuOpen || context.voiceActive) {
    return "ignore";
  }
  if (event.isComposing || event.keyCode === 229 || event.key !== "Enter") {
    return "ignore";
  }
  if (event.altKey || event.shiftKey) return "ignore";

  const hasCtrl = event.ctrlKey;
  const hasMeta = event.metaKey;
  if (hasCtrl === hasMeta) {
    return hasCtrl ? "ignore" : "newline";
  }
  if (!context.submitAvailable) return "ignore";
  return event.repeat ? "swallow" : "submit";
}
