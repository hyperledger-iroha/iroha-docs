---
translation_locale: ru
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Конфигурация и управление {#configuration-and-management}

Конфигурация Iroha имеет два полномочных слоя:

- локальная конфигурация сверстников и клиентов, хранящаяся в файлах TOML и читаемая при запуске процесса
- конфигурация в цепочке, измененная транзакцией через [`SetParameter`](/ru/blockchain/instructions.md#setparameter)

Используйте локальную конфигурацию для идентификации узлов, адресов, записей, хранения и ключей к подписанию клиента. Использовать на цепочке конфигурации для значений, которые должны быть согласованы сетью и воспроизведены детерминистически.

Производственное поведение должно исходить из этих слоев конфигурации. Переменные окружающей среды могут быть удобны для предоставления тестовых входов местному инструментарию, но они не являются портами производственных функций и не заменяют обязательную конфигурацию.

Основными входными точками конфигурации являются:

- [Бытие](/ru/guide/configure/genesis.md)
- [Конфигурация клиента](/ru/guide/configure/client-configuration.md)
- [Ключи для развертывания сети ](/ru/guide/configure/keys-for-network-deployment.md)
- [Работает на голом металле](/ru/guide/advanced/running-iroha-on-bare-metal.md)
- [Ссылка на конфигурацию сверстников](/ru/reference/peer-config/index.md)
