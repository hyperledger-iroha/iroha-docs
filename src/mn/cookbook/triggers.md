---
translation_locale: mn
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Түгээгчид {#triggers}

## Үр дүн {#outcome}

Taira-д техникээр тодорхойлсон дуудлагын триггерийг бүртгэлжүүлж, нэг удаа гүйцэтгээд, Хэрэгжсэн эцсийн байдлыг хүлээж, эцэслэгдсэн блокын түүхээс амжилттай дууссаныг баталгаажуулна уу.

## Өмнөх шаардлагууд {#prerequisites}

- Санхүүжүүлсэн криптографын гарын үсэг зурагч, `taira.client.toml`, `taira.tx-metadata.json`, ба `TAIRA_ACCOUNT_ID` [Taira-д холбогдох](./connect-to-taira.md)-аас.
- Taira нь `TAIRA_ACCOUNT_ID`-ийн триггерийг бүртгэх болон үүссэн триггерыг гүйцэтгэх зөвшөөрөл юм. Хамаарах токенууд нь `CanRegisterTrigger` нь `authority`-оор хязгаарлагдсан ба `CanExecuteTrigger` нь `trigger`-оор хязгаарлагдсан.
- Хэрэв эдгээр тэтгэлгүүд боломжгүй бол үүсгэсэн локал сүлжээ болон түүний удирдагч клиентийг ашигла. Триггерийн эрх олгох гол нь триггер гүйцэтгэх зааврын шаардсан бүх зөвшөөрлийг мөн хэрэгтэй.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Алхамууд {#steps}

### 1. Зааварт түшиглэсэн триггерийг бүртгэх {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` нь JSON зааврын массивыг хүлээн авдаг. `Log` заавар нь энэ жишээг хоёр дахь блокчейн бүртгэлийн объектын эрхийн оронд триггерын зөвшөөрөл дээр төвлөрөхийг хадгалдаг.

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

Гэтэл триггер хамгийн ихдээ гурван удаа ажиллах боломжтой. Үүний зарласан эрх олгох гол нь үүнийг гүйцэтгэж буй хүсэлт гаргагч клиент биш, үйлдлийн доторх зааврыг зөвшөөрдөг.

### 2. Гүйцэтгэлээс өмнө мэдүүлгийг шалгаарай {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Өөр нэг төлбөр төлөхөөс өмнө I105 зөвшөөрлийн үндсэн эрх, гүйцэтгэх шүүлтүүр, үлдсэн давталтууд, нэг `Log` зааврыг баталгаажуулна уу.

### 3. Аль аль давхаргыг гүйцэтгэж, хүлээнэ үү {#_3-execute-and-wait-for-both-layers}

Гүйцэтгэх гүйлгээ ба триггер үйлдэл нь тодорхой нотолгоо бүхий байдаг. `--wait` нь Хэрэгжсэн гүйлгээний эцсийн байдлыг хүлээдэг; `--trace` нь програмын гүйцэтгэлийн орчны гүйцэтгэлийн шинжилгээний тайланг бас мэдээлдэг.

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

Rust үйлчлүүлэгчид адил хоёр бичгийн зааврыг бүтээдэг. Энд `authority` нь `AccountId` бөгөөд `client` нь тухайн дансанд гарын үсэг зурдаг:

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

## Баталгаажуулах {#verify}

Дууссан блокын түүхийг гүйцэтгэлийг шалгахын тулд сканнердаж, буурсан давталтын тоог үзнэ үү:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Ядаж нэг гүйцэтгэл амжилттай байх ёстой. Хоёр гүйцэтгэл үлдсэн үед триггер идэвхтэй байх ёстой. Амжилттай триггер гүйцэтгэлгүй амжилттай илгээсэн нь хангалттай баталгаа биш юм.

## Алдааг олох болон засах {#troubleshooting}

- Бүртгэл зөвшөөрөгдөөгүй тул татгалзагдлаа гэдэг нь криптографийн гарын үүсгэгч нь тунхагласан эрх олгогч гол эрхтэй `CanRegisterTrigger` байхгүй гэсэн үг. Гүйцэтгэл нь тусдаа тодорхойлогдсон `CanExecuteTrigger` токен шаарддаг.
- Гүйлгээ нь триггер үйлдэл амжилтгүй болсныг мэдээлсэн үед Програмчлагдсан болох боломжтой. Дууссаны үр дүн ба алдааг уншаад, дараа нь бүх суулгасан зааврын хувьд триггер зөвшөөрлийн үндсэн эрхийн зөвшөөрлийг шалга.
- `trigger not found` нь бүртгэлийн гүйлгээ татгалзсан эсвэл гүйцэтгэлд өөр Torii/сүлжээний тохиргоо ашигласан байж болохыг илэрхийлж болно.
- Давталт нь тэгт хүрэхэд, нэмэлт давталт гаргах нь өөр нэг давуу эрхтэй бичлэг юм. Энэ жорыг дуугүйгээр хязгааргүй тригер болгон бүү өөрчил.
- Цэвэрлэгээний хувьд, `ledger trigger unregister --id "$TRIGGER_ID"` нь тухайн триггерийн хувьд `CanUnregisterTrigger` болон тодорхой төлбөрийн сонголтыг шаарддаг.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Техникийн дуудах хурдан ажиллуулах нь тогтоосон эх кодын хувилбар дээр нэгдсэн туршилтуудыг эхлүүлдэг](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Болсон үйл явдал болон триггер интеграцийн тестүүдийг тогтсон эх кодны хувилбарт хий](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Тогтоосон эх кодын хувилбар дээр заавар гүйцэтгэхийг эхлүүлэх](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Триггерүүд](/mn/blockchain/triggers.md)
- [Өдөөгчийн жишээнүүд](/mn/blockchain/trigger-examples.md)
- [Үйл явдал](./stream-events.md)
