# Отправка по Ctrl+Enter

Выбирайте комбинацию отправки сообщений в композере BB: **Ctrl+Enter**, **Enter** или **Shift+Enter**. По умолчанию используется **Ctrl+Enter**; в этом режиме работает и **Command+Enter** на macOS.

## Установка

Требуется BB 0.46+ с Plugin SDK 0.6.49+.

```sh
bb plugin install https://github.com/artbear/bb-plugin-ctrl-enter-send --yes
```

## Настройки

Откройте Settings → Installed plugins → Отправка по Ctrl+Enter и выберите «Отправлять сообщение по нажатию». Настройка сохраняется на сервере BB и применяется в открытых окнах без перезагрузки плагина.

| Настройка                 | Отправка                     | Новая строка                       |
| ------------------------- | ---------------------------- | ---------------------------------- |
| Ctrl+Enter — по умолчанию | Ctrl+Enter или Command+Enter | Enter или Shift+Enter              |
| Enter                     | Enter                        | Shift+Enter или Ctrl/Command+Enter |
| Shift+Enter               | Shift+Enter                  | Enter или Ctrl/Command+Enter       |

Комбинация отображается при наведении на доступную кнопку отправки. Подсказка сохраняет название текущего действия: отправка, постановка в очередь или steer.

Настройка через CLI:

```sh
bb plugin config ctrl-enter-send
bb plugin config ctrl-enter-send set sendShortcut ctrl-enter
bb plugin config ctrl-enter-send set sendShortcut enter
bb plugin config ctrl-enter-send set sendShortcut shift-enter
bb plugin config ctrl-enter-send unset sendShortcut
```

Последняя команда возвращает значение по умолчанию.

## Поведение

Работает в нативных композерах BB: новый тред, продолжение треда, очередь и редактор отправленного сообщения. Выбранная комбинация выполняет основное действие доступной кнопки; удержание клавиши не отправляет сообщение повторно.

Меню автодополнения, голосовой ввод и IME сохраняют своё поведение. Alt+Enter, Ctrl+Shift+Enter и Command+Shift+Enter остаются под управлением BB. Если кнопка недоступна, выбранная комбинация ничего не отправляет; причина недоступности остаётся видимой.

При отключении плагина восстанавливаются обработка клавиш и подсказки BB.

## Разработка

```sh
npm ci
npm test
npm run typecheck
bb plugin build .
```

`assets/enter-key.svg` — монохромная иконка клавиши Enter для карточки маркетплейса.
