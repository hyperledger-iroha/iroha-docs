---
translation_locale: ru
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Устранение проблем {#troubleshooting}

Этот раздел предназначен для помощи, если вы столкнетесь с проблемами при работе с
Iroha. Если что-то не так, пожалуйста. [Проверьте ключи .](#check-the-keys)
Если это не поможет, проверьте инструкции по устранению неполадок
на каждом этапе:

- [Проблемы с установкой](./installation-issues.md)
- [Проблемы с конфигурацией](./configuration-issues.md)
- [Вопросы по развертыванию](./deployment-issues.md)
- [Вопросы интеграции](./integration-issues.md)

Если проблема, с которой вы столкнулись, не описана здесь, свяжитесь с нами через
[Телеграмм](https://t.me/hyperledgeriroha).

## Проверь ключи . {#check-the-keys}

Большинство проблем возникают в результате несовместимых ключей.
следовать этому правилу: **Если что-то пойдет не так, проверь ключи.
Первый**.

Вот быстрое объяснение: невозможно отличить ошибку
сообщения, которые возникают, когда ключи сверстников не соответствуют ключам в массиве
доверенных сверстников, потому что это разоблачит общественный ключ сверстника.
имеют диаграммы Helm или развертывание Kubernetes с ключами, определенными в среде
переменные, сравнить конфигурированные
[`public_key`](/ru/reference/peer-config/params.md#param-public-key),
[`private_key`](/ru/reference/peer-config/params.md#param-private-key), и
[`trusted_peers`](/ru/reference/peer-config/params.md#param-trusted-peers)
ценности до расследования неисправностей на более высоком уровне.

В случае сомнений, [генерировать новую пару ключей](/ru/guide/security/generating-cryptographic-keys.md).
