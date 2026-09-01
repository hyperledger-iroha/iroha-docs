---
translation_locale: ru
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SDK Учебные пособия {#sdk-tutorials}

Эти страницы суммируют точки входа клиента Iroha 3, поставляемые из основной рабочей области, включая канонические имена пакетов, пути установки и минимальные стартовые точки.

## Рекомендуемый порядок {#recommended-order}

1. [Установите Iroha 3](/ru/get-started/install-iroha.md)
2. [Запуск Iroha 3](/ru/get-started/launch-iroha.md)
3. Выберите SDK:
   - [Rust](/ru/guide/tutorials/rust.md)
   - [Python](/ru/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ru/guide/tutorials/javascript.md)
   - [Kotlin, Android и Java](/ru/guide/tutorials/kotlin-java.md)
   - [Swift и iOS](/ru/guide/tutorials/swift.md)
4. Просмотрите [примерные приложения](/ru/guide/tutorials/sample-apps.md), когда вам нужна полная справка по клиентскому приложению.
5. Используйте [Вставить Kaigi](/ru/guide/tutorials/kaigi.md), когда вы хотите добавить аудио/видео встречи с поддержкой кошелька в своё приложение.
6. Используйте [Musubi пакеты](/ru/guide/tutorials/musubi.md), когда вам нужны повторно используемые исходные библиотеки Kotodama с закрепленными зависимостями реестра в цепочке.

## Образцы {#samples}

В исходном рабочем пространстве содержатся рецепты JavaScript и примеры проектов iOS Swift. Для Android начните с модулей Kotlin SDK и их тестов.

- [Обзор примерных приложений](/ru/guide/tutorials/sample-apps.md)
- [Встроить Kaigi в приложение JavaScript](/ru/guide/tutorials/kaigi.md)

## Источник истины {#source-of-truth}

Все страницы SDK здесь взяты из текущего исходного рабочего пространства:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java-зеркало Kotlin-первой Android поверхности)
- `IrohaSwift`
- `crates/musubi`

В случае сомнений отдавайте предпочтение README и метаданным пакета в этих каталогах; они описывают версию исходного кода, которую вы собираете.
