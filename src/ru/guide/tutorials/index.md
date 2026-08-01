---
translation_locale: ru
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Учебные пособия {#sdk-tutorials}

Эти страницы обобщают точки ввода клиента Iroha 3, отправленные из основного рабочего пространства, включая канонические названия пакетов, пути установки и минимальные исходные точки.

## Рекомендуемый порядок {#recommended-order}

1. [установка Iroha 3](/ru/get-started/install-iroha.md)
2. [Запуск Iroha 3](/ru/get-started/launch-iroha.md)
3. Выберите SDK:
   - [Rust](/ru/guide/tutorials/rust.md)
   - [Python](/ru/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ru/guide/tutorials/javascript.md)
   - [Kotlin, Android и Java](/ru/guide/tutorials/kotlin-java.md)
   - [Swift и iOS](/ru/guide/tutorials/swift.md)
4. Проверьте примерные приложения [](/ru/guide/tutorials/sample-apps.md), когда вы хотите получить полную ссылку на клиентские приложения.
5. Используйте [Embed Kaigi](/ru/guide/tutorials/kaigi.md), когда вы хотите добавить аудио/видео встречи с поддержкой кошелька в свое собственное приложение.
6. Используйте пакеты [Musubi](/ru/guide/tutorials/musubi.md), когда вам нужны повторно используемые источниковые библиотеки Kotodama с закрепленными на цепочке зависимостями от реестра.

## Образцы {#samples}

В рабочем пространстве вдоль потока содержится рецепты JavaScript и проекты образца Swift/iOS. Для Android начните с модулей Kotlin SDK и их испытаний

- [Образец приложений обзор](/ru/guide/tutorials/sample-apps.md)
- [Встроено Kaigi в приложение JavaScript](/ru/guide/tutorials/kaigi.md)

## Источник истины {#source-of-truth}

Все страницы SDK здесь получены из текущего рабочего пространства вверх потока:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java зеркало поверхности Kotlin-первая Android)
- `IrohaSwift`
- `crates/musubi`

В случае сомнения, предпочтитель README и метаданные пакета в этих каталогах; они описывают пересмотр источника, который вы создаете.
