---
translation_locale: kk
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ақауларды жою {#troubleshooting}

Бұл бөлім Iroha-пен жұмыс істегенде мәселелер туындаса көмектесу үшін арналған. Егер бірдеңе дұрыс болмай қалса, алдымен [түймелерді тексеріңіз](#check-the-keys) жасаңыз. Егер бұл көмектеспесе, әр кезеңге арналған ақаулықтарды жою нұсқауларын тексеріңіз:

- [Орнату мәселелері](./installation-issues.md)
- [Конфигурация мәселелері](./configuration-issues.md)
- [Орнату мәселелері](./deployment-issues.md)
- [Интеграция мәселелері](./integration-issues.md)

Егер сіз кездесіп отырған мәселе мұнда сипатталмаған болса, бізбен [Телеграм](https://t.me/hyperledgeriroha) арқылы байланысыңыз.

## Пернелерді тексеріңіз {#check-the-keys}

Көп мәселелер сәйкес келмейтін кілттердің нәтижесінде туады. Сондықтан біз осы ережені орындауды ұсынамыз: Егер бірдеңе дұрыс болмаса, алдымен кілттерді тексеріңіз.

Міне, қысқаша түсініктеме: Желі серіктестерінің кілттері сәйкес келмегенде пайда болатын қате хабарламаларды ажырату мүмкін емес. сенімді желідегі әріптестер массивіндегі кілттерді сәйкестендірмеу керек, себебі бұл желі әріптестерінің ашық кілтін ашады. Сондықтан, егер сізде Helm диаграммалары немесе орта айнымалылар арқылы анықталған кілттері бар Kubernetes орналастырулары болса, конфигурацияланғанын салыстырыңыз [`public_key`](/kk/reference/peer-config/params.md#param-public-key), [`private_key`](/kk/reference/peer-config/params.md#param-private-key), және [`trusted_peers`](/kk/reference/peer-config/params.md#param-trusted-peers) жоғары деңгейдегі ақауларды зерттеу алдында мәндерді.

Егер күмәндансаңыз, [жаңа кілт жұбын жасау](/kk/guide/security/generating-cryptographic-keys.md).
