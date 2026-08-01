---
translation_locale: ba
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Проблемаларҙы хәл итеү {#troubleshooting}

Был бүлектә һеҙ Iroha менән эшләгәндә проблемаларға осраһағыҙ ярҙам итергә тейеш. Әгәр ҙә берәй нәмә килеп сыҡһа, зинһар, [ тәүҙә ](#check-the-keys) асҡыстарын тикшерегеҙ. Әгәр был ярҙам итмәй икән, һәр этап өсөн проблемаларҙы хәл итеү буйынса күрһәтмәләрҙе тикшерегеҙ:

- [Установка мәсьәләләре](./installation-issues.md)
- [Конфигурация мәсьәләләре](./configuration-issues.md)
- [Эшләү мәсьәләләре](./deployment-issues.md)
- [Интеграция мәсьәләләре](./integration-issues.md)

Әгәр һеҙ кисергән проблема бында һүрәтләнмәгән икән, [Telegram](https://t.me/hyperledgeriroha) аша беҙҙең менән бәйләнешкә инегеҙ.

## Ключтарҙы тикшерегеҙ {#check-the-keys}

Күпселек мәсьәләләр тиңдәшһеҙ асҡыстар һөҙөмтәһендә барлыҡҡа килә. Шуға күрә был ҡағиҙәгә буйһонорға кәңәш итәбеҙ: берәй нәмә килеп сыҡһа, иң тәүҙә асҡыстарҙы тикшерегеҙ.

Бына тиҙ аңлатма: тиҫтерҙәрҙең асҡыстары  ышаныслы тиҫтерҙәр араһындағы асҡыстар, сөнки ул тиҫтерҙең асыҡ асҡысын асасаҡ. Шулай итеп, әгәр һеҙҙә бар Helm диаграммалары йәки Kubernetes урынлаштырыуҙар менән асҡыстар билдәләнгән тирә-яҡ мөхит үҙгәреүсәндәре аша, [`public_key`](/ba/reference/peer-config/params.md#param-public-key), [`private_key`](/ba/reference/peer-config/params.md#param-private-key), һәм [`trusted_peers`](/ba/reference/peer-config/params.md#param-trusted-peers) юғары кимәлдәге уңышһыҙлыҡтарҙы тикшергәнгә тиклемге баһалар.

Шик булғанда, [ яңы асҡыс парын](/ba/guide/security/generating-cryptographic-keys.md) барлыҡҡа килтерегеҙ.
