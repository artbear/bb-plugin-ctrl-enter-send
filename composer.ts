import { decideEnter } from "./decide-enter.ts";
import { shortcutLabels, type SendShortcut } from "./settings.ts";

const EDITOR = "[data-promptbox-editor-content]";
const MENU = "[data-promptbox-typeahead-menu]";
const SUBMIT =
  'form[data-promptbox] button[type="submit"][data-promptbox-submit-action]';

function menuOpenFor(form: HTMLFormElement): boolean {
  if (form.querySelector(MENU)) return true;
  return (
    document.querySelector(MENU) !== null &&
    form.contains(document.activeElement)
  );
}

function insertNewline(editor: HTMLElement) {
  const proseMirror = editor.classList.contains("ProseMirror")
    ? editor
    : (editor.querySelector<HTMLElement>(".ProseMirror") ?? editor);
  proseMirror.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    }),
  );
}

export function createComposerController() {
  let shortcut: SendShortcut | null = null;
  let refreshHints = () => {};

  return {
    setShortcut(next: SendShortcut) {
      shortcut = next;
      refreshHints();
    },
    mount(signal: AbortSignal) {
      type Hint = {
        title: string | null;
        shortcut: string | null;
        applied: string;
      };
      const hints = new Map<HTMLButtonElement, Hint>();

      function restore(button: HTMLButtonElement, original: Hint) {
        if (button.getAttribute("title") === original.applied) {
          if (original.title === null) button.removeAttribute("title");
          else button.setAttribute("title", original.title);
        }
        if (original.shortcut === null)
          button.removeAttribute("aria-keyshortcuts");
        else button.setAttribute("aria-keyshortcuts", original.shortcut);
      }

      refreshHints = () => {
        for (const [button, original] of hints) {
          if (
            !button.isConnected ||
            button.disabled ||
            !button.matches(SUBMIT)
          ) {
            restore(button, original);
            hints.delete(button);
          }
        }
        if (shortcut === null) return;
        for (const button of document.querySelectorAll<HTMLButtonElement>(
          SUBMIT,
        )) {
          if (button.disabled) continue;
          let original = hints.get(button);
          if (!original) {
            original = {
              title: button.getAttribute("title"),
              shortcut: button.getAttribute("aria-keyshortcuts"),
              applied: "",
            };
            hints.set(button, original);
          }
          const label =
            button
              .getAttribute("aria-label")
              ?.replace(/\s*\([^)]*Enter[^)]*\)/g, "") || "Отправить сообщение";
          original.applied = `${label} (${shortcutLabels[shortcut]})`;
          if (button.getAttribute("title") !== original.applied)
            button.setAttribute("title", original.applied);
          const keys =
            shortcut === "ctrl-enter"
              ? "Control+Enter Meta+Enter"
              : shortcut === "shift-enter"
                ? "Shift+Enter"
                : "Enter";
          if (button.getAttribute("aria-keyshortcuts") !== keys)
            button.setAttribute("aria-keyshortcuts", keys);
        }
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (
          !event.isTrusted ||
          shortcut === null ||
          !(event.target instanceof Element)
        )
          return;
        const editor = event.target.closest<HTMLElement>(EDITOR);
        const form = editor?.closest<HTMLFormElement>("form[data-promptbox]");
        if (!editor || !form) return;
        const button = form.querySelector(
          'button[type="submit"][data-promptbox-submit-action]',
        );
        const action = decideEnter(
          event,
          {
            inComposerEditor: true,
            menuOpen: menuOpenFor(form),
            voiceActive: form.hasAttribute("data-promptbox-voice-active"),
            submitAvailable:
              button instanceof HTMLButtonElement && !button.disabled,
          },
          shortcut,
        );
        if (action === "ignore") return;
        event.preventDefault();
        event.stopPropagation();
        if (action === "newline") insertNewline(editor);
        if (action === "submit" && button instanceof HTMLButtonElement)
          form.requestSubmit(button);
      };

      const observer = new MutationObserver(() => refreshHints());
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "aria-label",
          "disabled",
          "type",
          "data-promptbox-submit-action",
          "title",
        ],
      });
      window.addEventListener("keydown", onKeyDown, { capture: true, signal });
      refreshHints();
      return () => {
        observer.disconnect();
        window.removeEventListener("keydown", onKeyDown, true);
        for (const [button, original] of hints) restore(button, original);
        hints.clear();
        refreshHints = () => {};
      };
    },
  };
}
