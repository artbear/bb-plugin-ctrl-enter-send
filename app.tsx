import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { decideEnter } from "./decide-enter";

const EDITOR = "[data-promptbox-editor-content]";
const MENU = "[data-promptbox-typeahead-menu]";
const SUBMIT = 'button[type="submit"][data-promptbox-submit-action]';

function consume(event: KeyboardEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function menuOpenFor(form: HTMLElement): boolean {
  if (form.querySelector(MENU)) return true;
  const menu = document.querySelector(MENU);
  return (
    menu !== null &&
    document.activeElement instanceof Node &&
    form.contains(document.activeElement)
  );
}

function proseMirrorOf(editor: HTMLElement): HTMLElement {
  if (editor.classList.contains("ProseMirror")) return editor;
  return editor.querySelector<HTMLElement>(".ProseMirror") ?? editor;
}

function insertNewline(editor: HTMLElement) {
  const event = new KeyboardEvent("keydown", {
    key: "Enter",
    code: "Enter",
    shiftKey: true,
    bubbles: true,
    cancelable: true,
  });
  proseMirrorOf(editor).dispatchEvent(event);
}

function submitComposer(form: HTMLFormElement) {
  const button = form.querySelector(SUBMIT);
  if (!(button instanceof HTMLButtonElement) || button.disabled) return;
  form.requestSubmit(button);
}

export default definePluginApp((app) => {
  app.contentScripts.register({
    id: "ctrl-enter-send",
    mount({ signal }) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (!event.isTrusted) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const editor = target.closest<HTMLElement>(EDITOR);
        const form = editor?.closest<HTMLFormElement>("form[data-promptbox]");
        if (!editor || !form) return;

        const submitButton = form.querySelector(SUBMIT);
        const action = decideEnter(
          {
            key: event.key,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            isComposing: event.isComposing,
            keyCode: event.keyCode,
            repeat: event.repeat,
          },
          {
            inComposerEditor: true,
            menuOpen: menuOpenFor(form),
            voiceActive: form.hasAttribute("data-promptbox-voice-active"),
            submitAvailable:
              submitButton instanceof HTMLButtonElement && !submitButton.disabled,
          },
        );

        if (action === "ignore") return;
        consume(event);
        if (action === "newline") insertNewline(editor);
        if (action === "submit") submitComposer(form);
      };

      window.addEventListener("keydown", onKeyDown, { capture: true, signal });
    },
  });
});
