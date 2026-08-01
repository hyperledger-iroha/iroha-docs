---
translation_locale: uz
translation_source: /cookbook/triggers.md
translation_source_hash: 93080591f5171c7ce25173eb1ef826d6f5ca661a17797be53e90aedab33ed0c3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ishtirokchilar {#triggers}

## Natija {#outcome}

Taira raqamiga cheklangan qo'ng'iroqni o'chirib qo'ying, uni bir marta bajaring, Applied finality-ni kuting va blok tarixidan uning muvaffaqiyatli yakunlanishini tasdiqlang.

## Oldindan talablar {#prerequisites}

- Moliyaviy qo'llab-quvvatlanadigan imzochi, `taira.client.toml`, `taira.tx-metadata.json`, va `TAIRA_ACCOUNT_ID` O ' zbekiston Respublikasining [Bogʻlanish Taira](./connect-to-taira.md).
- Taira uchun qo'zg'atuvchini ro'yxatdan o'tkazishga ruxsat `TAIRA_ACCOUNT_ID` va natijada qo'zg'atishni amalga oshiradi. `CanRegisterTrigger` koʻrsatkichlari `authority` va `CanExecuteTrigger` koʻrsatkichlari `trigger`.
- Agar ushbu grantlar mavjud bo'lmasa, hosil qilingan mahalliy tarmoq va uning boshqaruvchisi mijozidan foydalaning. Qo'zg'atish organi shuningdek, qo'zg'atuvchining bajaradigan yo'l-yo'riqlari uchun zarur bo'lgan barcha ruxsatlarga ega.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## qadamlar {#steps}

### 1. Ko'rsatma bilan qo'llab-quvvatlanadigan o'chirgich ro'yxatga oling {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` JSON ko'rsatmalar jadvalini qabul qiladi. `Log` ko'rsatmasi ushbu misolni ikkinchi kitob ob'ekti ruxsatnomalariga emas, balki qo'zg'atuvchiga qaratadi.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Qo'zg'atuvchi eng ko'p uch marta ishga tushirilishi mumkin. Uning deklaratsiyalangan vakolatlari, uni amalga oshiruvchi qo'ng'iroqchi emas, harakat ichida bo'lgan yo'l-yo'riqlarga ruxsat beradi.

### 2. Ijro qilishdan oldin deklaratsiyani tekshirish {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Boshqa to'lovni to'lashdan oldin I105 vakolatini, ijro filtrini, qolgan takrorlashni va bitta `Log` ko'rsatmani tasdiqlang.

### 3. Ikkala qatlamni bajaring va kuting. {#_3-execute-and-wait-for-both-layers}

Amalga oshirish muomalasi va qo'zg'atuvchi harakatning aniq dalillari bor. `--wait` amaldagi muomala yakuniyligini kutadi; `--trace` shuningdek, ishga tushirish vaqti yakunlanishining tashxisini bildiradi.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust mijozlari bir xil ikkita yo'l-yo'riqni yaratadilar. Bu erda `authority` `AccountId` va `client` belgilari ushbu hisob sifatida:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## Tekshirish {#verify}

Bajarilgan bloklar tarixini tekshirish va kamaytirilgan takrorlash sonini tekshirish:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Hech bo'lmaganda bir tugallanish muvaffaqiyatli xabar berishi kerak. Ishtirokchi ikki ishga tushirilishi qolganida faol qolishi kerak. muvaffaqiyatli taqdim etish muvaffaqiyatli tugallanmagan holda etarlicha tekshirish emas.

## Muammolarni hal qilish {#troubleshooting}

- Ro'yxatdan o'tish ruxsat etilmaganligi uchun rad etilgan bo'lsa, imzochi deklaratsiyalangan hokimiyat uchun `CanRegisterTrigger` yo'qligini anglatadi. Ijro qilish uchun alohida ko'rsatilgan `CanExecuteTrigger` token talab etiladi.
- Transaksiya ishga tushiruvchi harakat muvaffaqiyatsizlik haqida xabar berganda, Applied-ga etib borishi mumkin. To'liq natija va xatolarni o'qing; so'ngra har bir o'rnatilgan ko'rsatma uchun qo'zg'atuvchi hokimiyatining ruxsatlarini tekshiring.
- `trigger not found` - ro'yxatdan o'tish tranzaksiyasi rad etilgan yoki boshqa Torii / zanjir konfiguratsiyasi bajarilishi uchun ishlatilganligini bildirishi mumkin.
- Takrorlashlar nolga yetganida, ko'proq takrorlashlarni yozish - yana bir imtiyozli yozuv. Ushbu retseptni doimiy ravishda o'zgartirib qo'ymang.
- tozalash uchun `ledger trigger unregister --id "$TRIGGER_ID"` ushbu qo'zg'atuvchi va aniq to'lovni tanlash uchun `CanUnregisterTrigger` talab qiladi.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Qo'shimcha qo'ng'iroqlar o'rnatilgan commit-da integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/triggers/by_call_trigger.rs)
- [O'rnatilgan commit-da hodisa va qo'zg'atuvchi integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events_and_triggers.rs)
- [Trigger yo'l-yo'riqlarini to'xtatilgan commitda bajarish](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Ishtirokchilar](/uz/blockchain/triggers.md)
- [Ishtirokchilarning misollari](/uz/blockchain/trigger-examples.md)
- [O'zgarishlar](./stream-events.md)
