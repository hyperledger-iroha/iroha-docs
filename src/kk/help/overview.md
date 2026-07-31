---
translation_locale: kk
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Қиындықтарды шешу {#troubleshooting}

Бұл бөлім сізбен жұмыс істеу кезінде проблемаларға тап болсаңыз көмектесу үшін Iroha. Егер бірдеңе дұрыс болмаса, өтінемін. [кілттерді тексеріңіз](#check-the-keys) Егер бұл көмектеспесе, әрбір кезең үшін қателерді шешу нұсқаулықтарын тексеріңіз:

- [Құрылғы мәселесі](./installation-issues.md)
- [Конфигурация мәселесі](./configuration-issues.md)
- [Қолданылу мәселелері](./deployment-issues.md)
- [Интеграциялық мәселелер](./integration-issues.md)

Егер сіздің проблемаңыз осы жерде сипатталмаған болса, бізге [Telegram](https://t.me/hyperledgeriroha) арқылы хабарласыңыз.

## Кілттерді тексеріңіз {#check-the-keys}

Көптеген проблемалар тең емес кілттерден туындайды. Сондықтан біз мына ережеге сай әрекет етуге кеңес береміз: егер бірдеңе дұрыс болмаса, алдымен кілттерді тексеріңіз.

Бұл жерде қысқаша түсіндірме: әріптестердің кілттері сенімді әріптестер массивідегі кілттермен сәйкес келмегенде пайда болатын қате хабарламаларын ажырату мүмкін емес, өйткені бұл әріптестердің қоғамдық кілтін ашады. [`public_key`](/kk/reference/peer-config/params.md#param-public-key), [`private_key`](/kk/reference/peer-config/params.md#param-private-key), және [`trusted_peers`](/kk/reference/peer-config/params.md#param-trusted-peers) жоғары деңгейдегі сәтсіздіктерді тексеруден бұрын.

Егер күмән туындаса, [ жаңа кілттер жұпын ](/kk/guide/security/generating-cryptographic-keys.md) пайдаланыңыз.
