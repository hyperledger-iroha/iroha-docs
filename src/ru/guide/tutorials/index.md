---
translation_locale: ru
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Учебные пособия {#sdk-tutorials}

Эти страницы обобщают Iroha 3 пункты въезда клиентов, отправленные из основного
рабочее пространство, включающее в себя канонические названия пакетов, пути установки и минимальные
исходные точки.

## Рекомендуемый порядок {#recommended-order}

1. [Установка Iroha 3](/ru/get-started/install-iroha.md)
2. [Запуск Iroha 3](/ru/get-started/launch-iroha.md)
3. Выберите SDK:
   - [Rust](/ru/guide/tutorials/rust.md)
   - [Python](/ru/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ru/guide/tutorials/javascript.md)
   - [Kotlin, Android, и Java](/ru/guide/tutorials/kotlin-java.md)
   - [Swift и iOS](/ru/guide/tutorials/swift.md)
4. Обзор [примерные приложения](/ru/guide/tutorials/sample-apps.md) когда ты хочешь
   полная справка о заявке клиента.
5. Использование [Встроенные Kaigi](/ru/guide/tutorials/kaigi.md) когда вы хотите добавить
   аудио/видео встречи с поддержкой кошелька в собственном приложении.
6. Использование [Musubi упаковки](/ru/guide/tutorials/musubi.md) при необходимости повторного использования
   Kotodama исходные библиотеки с закрепленными на цепочке зависимостями от реестра.

## Образцы {#samples}

Рабочее пространство вверх потока содержит JavaScript рецепты и Swift/iOS образец
для проектов. Android, Начнём с Kotlin SDK модулей и их испытаний.

- [Обзор примеров приложений](/ru/guide/tutorials/sample-apps.md)
- [Встроенные Kaigi в а JavaScript приложение](/ru/guide/tutorials/kaigi.md)

## Источник истины {#source-of-truth}

Все SDK страницы здесь получены из текущего рабочего пространства вверх потока:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Ява зеркало Kotlin-первое. Android поверхность)
- `IrohaSwift`
- `crates/musubi`

Если в сомнении, предпочтите README и метаданные пакетов в этих каталогах;
Они описывают пересмотр источника, который вы создаете.
