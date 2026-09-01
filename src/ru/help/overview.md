---
translation_locale: ru
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Устранение неполадок {#troubleshooting}

Этот раздел предназначен, чтобы помочь, если вы столкнулись с проблемами при работе с Iroha. Если что-то пошло не так, пожалуйста, сначала [проверьте ключи](#check-the-keys). Если это не поможет, проверьте инструкции по устранению неполадок для каждого этапа:

- [Проблемы с установкой](./installation-issues.md)
- [Проблемы с конфигурацией](./configuration-issues.md)
- [Проблемы с развертыванием](./deployment-issues.md)
- [Проблемы интеграции](./integration-issues.md)

Если описанная здесь проблема не соответствует вашей, свяжитесь с нами через [Телеграм](https://t.me/hyperledgeriroha).

## Проверьте ключи {#check-the-keys}

Большинство проблем возникает из-за несоответствия ключей. Поэтому мы рекомендуем следовать этому правилу: если что-то идет не так, сначала проверьте ключи.

Вот краткое объяснение: невозможно различить сообщения об ошибках, которые возникают, когда ключи сетевых узлов не сопоставлять ключи в массиве доверенных сетевых узлов, потому что это могло бы раскрыть открытый ключ сетевых узлов. Таким образом, если у вас есть Helm-чарты или развертывания Kubernetes с ключами, определёнными через переменные среды, сравните настроенное [`public_key`](/ru/reference/peer-config/params.md#param-public-key), [`private_key`](/ru/reference/peer-config/params.md#param-private-key), и [`trusted_peers`](/ru/reference/peer-config/params.md#param-trusted-peers) значения перед исследованием сбоев более высокого уровня.

В случае сомнений, [создать новую пару ключей](/ru/guide/security/generating-cryptographic-keys.md).
