---
translation_locale: uz
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hodisalar {#events}

Blokcheynda muayyan voqea, masalan yangi hisob yaratilishi yoki blok yakuniy yozilishi sodir bo‘lganda hodisa chiqariladi. Hodisalarning quyidagi turlari mavjud:

- pipeline hodisalari
- ma'lumotlar hodisalari
- vaqt hodisalari
- qo‘zg‘atuvchini bajarish hodisalari

## Konveyer hodisalari {#pipeline-events}

Tranzaksiya yuborilganda, bajarilganda yoki blokka yakuniy yozilganda konveyer hodisasi chiqariladi. Unda hodisani keltirib chiqargan obyekt turi (tranzaksiya yoki blok), uning xeshi va holati bo‘ladi. Holat `Validating` (tekshirish davom etmoqda), `Rejected` yoki `Committed` bo‘lishi mumkin. Obyekt rad etilgan bo‘lsa, rad etish sababi ham beriladi.

### Taira-da sinab ko‘rish {#try-it-on-taira}

Ochiq konveyer hodisalari oqimi ulanganini tekshiring:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Oqimni ochiq saqlamasdan tekshiriladigan oniy tasvir uchun kuzatuvchidagi so‘nggi tranzaksiyalarni o‘qing:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Jonli hodisalar kerak bo‘lganda SSE yo‘nalishini terminalda oching:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Oqim ochiq turganida tranzaksiya yuborilmasa, yo‘nalish sog‘lom bo‘lsa ham buyruq hech narsa chiqarmasligi mumkin.

## Ma'lumotlar hodisalari {#data-events}

Tugunlar, domenlar, hisoblar, aktivlar, aktiv ta’riflari, NFTs, qo‘zg‘atuvchilar, rollar, zanjirdagi sozlama, ijrochi holati, isbotlar, maxfiy aktivlar, ko‘priklar yoki SORA/Nexus-ga xos obyektlar kabi reyestr ma’lumotlari o‘zgarganda ma’lumot hodisasi chiqariladi. Bu hodisalar [ma’lumot hodisasi filtrlarida](./filters.md#data-event-filters) ishlatiladi.

## Vaqt hodisalari {#time-events}

Global holat ko‘rinishi [vaqt qo‘zg‘atuvchilarini](./triggers.md#time-triggers) bajarishga tayyor bo‘lganda vaqt hodisasi chiqariladi.

## Qo‘zg‘atuvchini bajarish hodisalari {#trigger-execution-events}

[`ExecuteTrigger`](./instructions.md#executetrigger) ko‘rsatmasi bajarilganda qo‘zg‘atuvchini ijro etish hodisasi chiqariladi. Qo‘zg‘atuvchi amali tugagach, uning yakunlanish hodisasi chiqariladi.
