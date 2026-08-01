---
translation_locale: kk
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Қиындықтарды шешу {#troubleshooting}

Бұл бөлім Iroha пен жұмыс істеу кезінде проблемаларға тап болғанда көмектесуге арналған. Егер бірдеңе дұрыс болмаса, [ бірінші кезекте ](#check-the-keys) кілттерін тексеріңіз. Егер бұл көмектеспесе, әрбір кезең үшін қателерді шешу нұсқауларын тексеріңіз:

- [Құрылғы мәселесі](./installation-issues.md)
- [Конфигурация мәселесі](./configuration-issues.md)
- [Қолданылу мәселелері](./deployment-issues.md)
- [Интеграциялық мәселелер](./integration-issues.md)

Егер сіздің проблемаңыз осы жерде сипатталмаған болса, бізге [Telegram](https://t.me/hyperledgeriroha) арқылы хабарласыңыз.

## Кілттерді тексеріңіз {#check-the-keys}

Көптеген проблемалар тең емес кілттерден туындайды. Сондықтан біз мына ережеге сай әрекет етуге кеңес береміз: егер бірдеңе дұрыс болмаса, алдымен кілттерді тексеріңіз.

Мұнда қысқаша түсіндірме бар: жасөспірімдердің кілттері сенімді жасөспірістер қатарына сәйкес келмеген кезде пайда болатын қате хабарламаларын ажырату мүмкін емес, өйткені бұл жасөспірушілердің қоғамдық кілтісін ашады. Осылайша, егер сізде қоршаған ортаның айнымалылары арқылы айқындалған кілттермен Helm диаграммалары немесе Kubernetes орналасуы болса, жоғары деңгейдегі сәтсіздіктерді тексеруден бұрын конфигурацияланған [`public_key`](/kk/reference/peer-config/params.md#param-public-key), [`private_key`](/kk/reference/peer-config/params.md#param-private-key), және [`trusted_peers`](/kk/reference/peer-config/params.md#param-trusted-peers) мәндерін салыстырып көріңіз.

Егер күмән туындаса, [ жаңа кілттер жұпын ](/kk/guide/security/generating-cryptographic-keys.md) пайдаланыңыз.
