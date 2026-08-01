---
translation_locale: uz
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# O'yinlar {#events}

Ba'zi narsalar blokcheyn ichida sodir bo'lganda, masalan, yangi hisob yaratilganda yoki blok qo'yilganda hodisalar chiqariladi. Turli turdagi voqealar mavjud:

- pipeline hodisalari
- ma'lumotlar hodisalari
- vaqt hodisalari
- ijro etish hodisalarini ishga tushirish

## Pipeline hodisalari {#pipeline-events}

Pipeline hodisalari blokga tranzaksiyalar taqdim etilganda, bajarilganda yoki topshirilganda chiqariladi. Pipeline hodisasi quyidagi ma'lumotlarni o'z ichiga oladi: voqea (tranzaksiya yoki blok) ni keltirib chiqargan entitetning turi, uning hash va holati. Ma'lumotlar `Validating` (ishlab borayotgan tasdiqlash), `Rejected` yoki `Committed` bo'lishi mumkin.

### Taira bilan sinab ko'ring. {#try-it-on-taira}

Ommaviy gaz quvuridagi hodisalar oqimi oʻrnatilganligini tekshirish:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Ochiq oqishni saqlab qolmasdan tekshirib ko'rishingiz mumkin bo'lgan fotosurat uchun, so'nggi Explorer bitimlarini o'qing:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

To'g'ridan-to'g'ri tadbirlar kerak bo'lganda terminaldagi SSE yo'nalishini oching:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Agar oqim ochiq bo'lganida hech qanday bitimlar taqdim etilmasa, yo'nalish sog'lom bo'lsa-da, buyruq xalos bo'lishi mumkin.

## Ma'lumotlar hodisalari {#data-events}

Ma'lumotlar hodisalari katta ma'lumotlarga, masalan, tengdoshlar, domenlar, hisoblar, aktivlar, aktivlarning ta'riflari, NFTs, qo'zg'atuvchilar, rollar, zanjirdagi konfiguratsiya, ijrochi davlat, dalillar, maxfiy aktivlar, ko'priklar yoki SORA/Nexus-mahsus ob'ektlar bilan bog'liq o'zgarishlar sodir bo'lganda chiqarilgan. Ushbu turdagi hodisalar [ ma'lumotlar hodisalari filtrlarida ](./filters.md#data-event-filters) ishlatiladi.

## Vaqtdagi voqealar {#time-events}

Vaqti hodisalari dunyo holati ko'rinishi [ vaqtni qo'zg'atish uchun tayyor bo'lganda chiqarilgan ](./triggers.md#time-triggers).

## Qoʻzgʻatish jarayonlari {#trigger-execution-events}

[`ExecuteTrigger`](./instructions.md#executetrigger) ko'rsatmasi bajarilganda trigger ijro etish hodisalari chiqarilgan. Triggerni tugatish hodisalari trigger harakatini tugatgandan so'ng chiqariladi.
