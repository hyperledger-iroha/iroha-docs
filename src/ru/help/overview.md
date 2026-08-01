---
translation_locale: ru
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Устранение неполадок {#troubleshooting}

Данный раздел предназначен для того, чтобы помочь вам в случае возникновения проблем при работе с Iroha. Если что-то пойдет не так, пожалуйста. [Проверьте ключи](#check-the-keys) Если это не поможет, проверьте инструкции по устранению неполадок на каждом этапе:

- [Проблемы с установкой](./installation-issues.md)
- [Проблемы с конфигурацией](./configuration-issues.md)
- [Вопросы в области развертывания ](./deployment-issues.md)
- [Проблемы интеграции](./integration-issues.md)

Если проблема, с которой вы столкнулись, не описана здесь, свяжитесь с нами по телефону [Telegram](https://t.me/hyperledgeriroha).

## Проверь ключи . {#check-the-keys}

Большинство проблем возникают в результате несовместимых ключей. Поэтому мы рекомендуем следовать этому правилу: если что-то пойдет не так, сначала проверьте ключи.

Вот быстрое объяснение: невозможно отличить сообщения об ошибках, которые возникают, когда ключи сверстников не совпадают с ключами в массиве доверенных сверстниц, потому что это будет раскрывать общественный ключ сверстники. Таким образом, если у вас есть диаграммы Helm или развертывание Kubernetes с ключами, определяемыми через переменные окружающей среды, сравнить конфигурированные значения [`public_key`](/ru/reference/peer-config/params.md#param-public-key), [`private_key`](/ru/reference/peer-config/params.md#param-private-key), и [`trusted_peers`](/ru/reference/peer-config/params.md#param-trusted-peers) перед исследованием неисправностей на более высоком уровне.

В случае сомнения, [генерируют новую пару ключей ](/ru/guide/security/generating-cryptographic-keys.md).
