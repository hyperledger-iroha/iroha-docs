---
translation_locale: ru
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Конфигурация и управление {#configuration-and-management}

Iroha конфигурация имеет два авторитетных слоя:

- **локальная конфигурация сверстников и клиентов**, хранится в TOML файлы и читать на
  запуск процесса
- **конфигурация в цепочке**, изменены транзакциями через
  [`SetParameter`](/ru/blockchain/instructions.md#setparameter)

Используйте локальную конфигурацию для идентификации узлов, адресов, регистрации, хранения и
Используйте конфигурацию на цепочке для значений, которые должны быть согласованы
сети и воспроизводится детерминистически.

Производственное поведение должно исходить из этих слоев конфигурации.
переменные могут быть удобны для подачи тестовых входов на местное оборудование, но
они не являются производственными функциями и не заменяют обязательства
конфигурация.

Основными точками входа в конфигурацию являются:

- [Бытие](/ru/guide/configure/genesis.md)
- [Конфигурация клиента](/ru/guide/configure/client-configuration.md)
- [Ключи для развертывания сети](/ru/guide/configure/keys-for-network-deployment.md)
- [Бегут на голом металле](/ru/guide/advanced/running-iroha-on-bare-metal.md)
- [Ссылка на конфигурацию сверстников](/ru/reference/peer-config/index.md)
