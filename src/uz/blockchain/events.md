---
translation_locale: uz
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tadbirlar {#events}

Vaqt o'tib, blokchayn ichida ba'zi narsalar sodir bo'lganda hodisalar chiqariladi.
yangi hisob yaratilgan yoki blok qo'yilgan.
hodisalar:

- pipeline hodisalari
- ma'lumotlar hodisalari
- vaqt hodisalari
- ijro jarayonlarini qoʻzgʻatish

## Pipeline hodisalari {#pipeline-events}

Pipeline hodisalari tranzaksiyalar taqdim etilganda, bajarilganda yoki
Blokka qo'shilgan. Pipeline hodisasi quyidagi ma'lumotlarni o'z ichiga oladi:
hodisani (transaksiyani yoki blokni) keltirib chiqargan entitetning turi, uning hash
va maqomi. `Validating` (valiyatsiya jarayonida),
`Rejected`, yoki `Committed`. Agar tashkilot rad etilgan bo'lsa,
rad etilishi ko'zda tutilgan.

### Uni sinab koʻring . Taira {#try-it-on-taira}

Jamoatchilik quvuridagi hodisalar oqimi oʻrnatilganligini tekshirish:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

O'tishni ochmasdan tekshirib ko'rishingiz mumkin bo'lgan darrov tasvir uchun, yaqinda o'qigan
Eksploratorlar bilan amalga oshiriladigan operatsiyalar:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Ochiq SSE jonli tadbirlar kerak bo'lganda terminaldagi yo'nalish:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Agar oqim ochiq bo'lganda hech qanday bitimlar taqdim etilmasa, buyruq qolishi mumkin
yo'l sog'lom bo'lsa ham, tinchlik.

## Ma'lumotlar hodisalari {#data-events}

Ma'lumotlar hodisalari katta ma'lumotlar bilan bog'liq o'zgarishlar bo'lganda chiqarilgan
tengdoshlar, domenlar, hisob raqamlari, aktivlar, aktivlarning ta'riflanishi sifatida; NFTs, qo'zg'atuvchilar,
roli, zanjirdagi konfiguratsiya, ijrochi holati, dalillar, maxfiy aktivlar;
ko'priklar yoki SORA/Nexus-o'ziga xos obyektlar.
[ma'lumotlar hodisasi filtrlari](./filters.md#data-event-filters).

## Vaqtidagi voqealar {#time-events}

Vaqtdagi hodisalar dunyoga qarash oʻzgarishga tayyor boʻlganda yuboriladi
[vaqtni ishga tushirish](./triggers.md#time-triggers).

## Trigger o'tkazish hodisalari {#trigger-execution-events}

Trigger o'tkazuvchi hodisalar
[`ExecuteTrigger`](./instructions.md#executetrigger) ta'lim berish
Trigger tugallanish hodisalari trigger harakatidan keyin chiqariladi
tugadi.
