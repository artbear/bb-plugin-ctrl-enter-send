---
name: ctrl-enter-send
description: "Настраиваемая отправка сообщений в BB по Ctrl+Enter, Enter или Shift+Enter. Используй для объяснения клавиш отправки и настройки плагина ctrl-enter-send."
---

# Отправка сообщений

Плагин меняет нативные композеры BB: новый тред, продолжение треда, очередь и редактор отправленного сообщения.

Посмотри действующую настройку перед объяснением клавиш:

```sh
bb plugin config ctrl-enter-send
```

`sendShortcut` определяет комбинацию отправки:

- `ctrl-enter` — по умолчанию; Ctrl+Enter или Command+Enter отправляет, Enter и Shift+Enter вставляют строку.
- `enter` — Enter отправляет, Shift+Enter и Ctrl/Command+Enter вставляют строку.
- `shift-enter` — Shift+Enter отправляет, Enter и Ctrl/Command+Enter вставляют строку.

Выбранная комбинация выполняет основное действие кнопки: отправку, очередь или steer. Если кнопка недоступна, отправки нет. Удержание комбинации не отправляет повторно.

Настройка доступна в Settings → Installed plugins → Отправка по Ctrl+Enter. Через CLI:

```sh
bb plugin config ctrl-enter-send set sendShortcut shift-enter
bb plugin config ctrl-enter-send unset sendShortcut
```

Сброс возвращает Ctrl+Enter. Изменение применяется в открытых окнах без перезагрузки плагина. Подсказка при наведении на доступную кнопку показывает выбранную комбинацию.

Меню автодополнения, голосовой ввод и IME сохраняют поведение BB. Alt+Enter и Ctrl/Command+Shift+Enter не перехватываются. Отключение плагина восстанавливает стандартные клавиши и подсказки.
