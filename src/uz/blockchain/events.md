---
translation_locale: uz
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Hodisalar {#events}

Blokcheynda muayyan voqea, masalan yangi hisob yaratilishi yoki blok yakuniy yozilishi sodir bo‘lganda hodisa chiqariladi. Hodisalarning quyidagi turlari mavjud:

- pipeline hodisalari
- ma'lumotlar hodisalari
- vaqt hodisalari
- qo‘zg‘atuvchini bajarish hodisalari

## Konveyer hodisalari {#pipeline-events}

Tranzaksiyalar va bloklar konveyer bo‘ylab harakatlanar ekan, konveyer hodisalari chiqariladi. Tranzaksiya hodisasi tranzaksiya xeshi, blok balandligi, yo‘lak va ma’lumotlar makoni identifikatorlari hamda holatni olib yuradi: `Queued`, `Expired`, `Approved` yoki rad etish sababi bilan `Rejected`. Blok hodisasi blok sarlavhasi va holatni olib yuradi: `Created`, `Approved`, sababi bilan `Rejected`, `Committed` yoki `Applied`.

### Taira-da sinab ko‘rish {#try-it-on-taira}

Ochiq konveyer hodisalari oqimi ulanganini tekshiring:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Oqimni ochiq saqlamasdan tekshiriladigan oniy tasvir uchun kuzatuvchidagi so‘nggi tranzaksiyalarni o‘qing:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

Jonli hodisalar kerak bo‘lganda SSE yo‘nalishini terminalda oching:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Oqim ochiq turganida tranzaksiya yuborilmasa, yo‘nalish sog‘lom bo‘lsa ham buyruq hech narsa chiqarmasligi mumkin.

## Ma'lumotlar hodisalari {#data-events}

Tugunlar, domenlar, hisoblar, aktivlar, aktiv ta’riflari, NFTs, qo‘zg‘atuvchilar, rollar, zanjirdagi sozlama, ijrochi holati, isbotlar, maxfiy aktivlar, ko‘priklar yoki SORA Nexus-ga xos obyektlar kabi reyestr ma’lumotlari o‘zgarganda ma’lumot hodisasi chiqariladi. Bu hodisalar [ma’lumot hodisasi filtrlarida](./filters.md#data-event-filters) ishlatiladi.

## Vaqt hodisalari {#time-events}

Global holat ko‘rinishi [vaqt qo‘zg‘atuvchilarini](./triggers.md#time-triggers) bajarishga tayyor bo‘lganda vaqt hodisasi chiqariladi.

## Qo‘zg‘atuvchini bajarish hodisalari {#trigger-execution-events}

[`ExecuteTrigger`](./instructions.md#executetrigger) ko‘rsatmasi bajarilganda qo‘zg‘atuvchini ijro etish hodisasi chiqariladi. Qo‘zg‘atuvchi amali tugagach, uning yakunlanish hodisasi chiqariladi.
