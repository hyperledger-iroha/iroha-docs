---
translation_locale: uz
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tutrqichlar {#triggers}

## Natija {#outcome}

Taira da texnik chaqiruv triggerini ro‘yxatga oling, uni bir marta bajaring, Tatbiq etilgan yakuniylik uchun kuting va yakunlangan blok tarixidan uning muvaffaqiyatli bajarilganligini tasdiqlang.

## Oldingi talablar {#prerequisites}

- Moliyalashtirilgan imzolovchi, `taira.client.toml`, `taira.tx-metadata.json` va `TAIRA_ACCOUNT_ID` dan [Taira ga ulaning](./connect-to-taira.md).
- Taira uchun `TAIRA_ACCOUNT_ID` ga trigger ro'yxatdan o'tkazish va natijada yuzaga kelgan triggerni bajarish huquqi. Tegishli tokenlar `CanRegisterTrigger` `authority` doirasida va `CanExecuteTrigger` `trigger` doirasida.
- Agar ushbu grantlar mavjud bo‘lmasa, yaratilgan mahalliy tarmoq va uning administrator klientidan foydalaning. Trigger autoriyatsiya prinsipi ham trigger bajaradigan ko‘rsatmalarda talab qilinadigan barcha ruxsatlarga ega bo‘lishi kerak.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Qadamlar {#steps}

### 1. Ko‘rsatmalar bilan qo‘llab-quvvatlangan trigerni ro‘yxatdan o‘tkazing {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` JSON ko‘rsatmalar massivini qabul qiladi. `Log` ko‘rsatma ushbu misolni ikkinchi reyestr obyektining ruxsatlaridan ko‘ra tetik autorizatsiyasiga qaratilgan holda saqlaydi.

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

Triger eng ko‘pi bilan uch marta ishlashi mumkin. Unda e’lon qilingan vakolatga ega asosiy shaxs, uni bajaradigan so‘rovchi mijoz emas, harakat ichidagi ko‘rsatmalarni vakolatlaydi.

### 2. Ijro etishdan oldin deklaratsiyani tekshiring {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Yana bir to‘lov sarflashdan oldin I105 avtorizatsiya prinsipalini, bajarish filtrini, qolgan takrorlashlar sonini va yagona `Log` ko‘rsatmani tasdiqlang.

### 3. Ikkala qatlamni ishga tushiring va kuting {#_3-execute-and-wait-for-both-layers}

Ijro operatsiyasi va trigger harakati alohida dalillarga ega. `--wait` Qo‘llanilgan operatsiya yakuniyligini kutadi; `--trace` shuningdek, dasturiy ijro muhitining yakunlanishi diagnostikasini ham bildiradi.

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

Rust mijozlar bir xil ikki turdagi ko'rsatmalarni quradi. Bu yerda `authority` - bu `AccountId` va `client` hisob sifatida imzolaydi:

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

Tugatish uchun yakunlangan blok tarixini skanerlash va kamaygan takrorlash sonini tekshirish:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Kamida bitta yakun muvaffaqiyatni bildirishi kerak. Trigger ikki bajarilish qolganda faol bo‘lib qolishi kerak. Muvaffaqiyatli topshirish muvaffaqiyatli trigger yakunisiz yetarli tekshiruv hisoblanmaydi.

## Muammolarni bartaraf etish {#troubleshooting}

- Ro‘yxatdan o‘tkazish ruxsat yo‘qligi sababli rad etilsa, imzolovchida e’lon qilingan vakolat uchun `CanRegisterTrigger` yo‘q. Bajarish uchun alohida doiradagi `CanExecuteTrigger` tokeni talab qilinadi.
- Tranzaksiya trigger harakati muvaffaqiyatsizlikni bildirsa ham Applied holatiga yetishi mumkin. Yakuniy natija va xatoni o'qing; so'ngra har bir ichki ko'rsatma uchun trigger vakolat hisobining ruxsatlarini tekshiring.
- `trigger not found` ro‘yxatdan o‘tish tranzaksiyasi rad etilganligini yoki bajarish uchun boshqa Torii/zanjir konfiguratsiyasi ishlatilganligini anglatishi mumkin.
- Takrorlashlar nolga yetganida, qo'shimcha takrorlashlarni berish yana bir imtiyozli yozuvdir. Bu retseptni sukut bo'yicha cheksiz triggega o'zgartirmang.
- Tozalash uchun, `ledger trigger unregister --id "$TRIGGER_ID"` ushbu tetiklash uchun `CanUnregisterTrigger` talab qiladi, shuningdek aniq to‘lov tanlovi kerak.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Texnik chaqiriq orqali pinlangan manba kodining revisiyasida integratsiya testlarini ishga tushirish](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Tadbir va trigger integratsiya testlari pinlangan manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Tayanch kod manbasining belgilangan versiyasida ko‘rsatmani bajarishni ishga tushirish](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Tutrqichlar](/uz/blockchain/triggers.md)
- [Trigger misollar](/uz/blockchain/trigger-examples.md)
- [Tadbirlar](./stream-events.md)
