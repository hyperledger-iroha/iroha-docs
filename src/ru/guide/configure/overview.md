---
translation_locale: ru
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Конфигурация и управление {#configuration-and-management}

Конфигурация Iroha имеет два авторитетных уровня:

- конфигурация локальной сетевой пары и клиента, хранится в файлах TOML и считывается при запуске процесса
- конфигурация в блокчейне, изменяемая с помощью транзакций через [`SetParameter`](/ru/blockchain/instructions.md#setparameter)

Используйте локальную конфигурацию для идентичности узла, адресов, журналирования, хранения и ключей подписи клиента. Используйте конфигурацию в цепочке для значений, которые должны быть согласованы сетью и воспроизводиться детерминированно.

Поведение в производстве должно исходить из этих слоев конфигурации. Переменные окружения могут быть удобны для предоставления тестовых входных данных для локальных инструментов, но они не являются производственными переключателями функций и не заменяют окончательную конфигурацию.

Основные точки входа конфигурации:

- [генезис блокчейна](/ru/guide/configure/genesis.md)
- [Конфигурация клиента](/ru/guide/configure/client-configuration.md)
- [Ключи для развертывания сети](/ru/guide/configure/keys-for-network-deployment.md)
- [Запуск на «живом» железе](/ru/guide/advanced/running-iroha-on-bare-metal.md)
- [справочник по настройке сетевых узлов](/ru/reference/peer-config/index.md)
