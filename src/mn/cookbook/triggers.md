---
translation_locale: mn
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Түгээгчид {#triggers}

## Үр дүн {#outcome}

Taira-д техникээр тодорхойлсон дуудлагын триггерийг бүртгэлжүүлж, нэг удаа гүйцэтгээд, Хэрэгжсэн эцсийн байдлыг хүлээж, эцэслэгдсэн блокын түүхээс амжилттай дууссаныг баталгаажуулна уу.

## Өмнөх шаардлагууд {#prerequisites}

- [Taira-д холбогдох](./connect-to-taira.md) хэсгээс авсан санхүүжүүлсэн гарын үсэг зурагч, `taira.client.toml` болон `TAIRA_ACCOUNT_ID`. Бичих үйлдлүүд `--fee-payer authority`-г ашигладаг; CLI нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргадаг.
- Taira нь `TAIRA_ACCOUNT_ID`-ийн триггерийг бүртгэх болон үүссэн триггерыг гүйцэтгэх зөвшөөрөл юм. Хамаарах токенууд нь `CanRegisterTrigger` нь `authority`-оор хязгаарлагдсан ба `CanExecuteTrigger` нь `trigger`-оор хязгаарлагдсан.
- Хэрэв эдгээр тэтгэлгүүд боломжгүй бол үүсгэсэн локал сүлжээ болон түүний удирдагч клиентийг ашигла. Триггерийн эрх олгох гол нь триггер гүйцэтгэх зааврын шаардсан бүх зөвшөөрлийг мөн хэрэгтэй.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Алхамууд {#steps}

### 1. Зааварт түшиглэсэн триггерийг бүртгэх {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` нь `--emit-instructions`-ийн хэвлэдэг JSON зааврын массивыг хүлээн авдаг. `tx ping` нь нэг `Log` заавар гаргадаг бөгөөд энэ нь жишээг блокчэйн дэвтрийн хоёр дахь объектын зөвшөөрлөөс илүү триггерийн зөвшөөрөлд төвлөрүүлдэг.

```bash
iroha --config "$CONFIG" --emit-instructions \
  tx ping --log-level INFO --msg 'cookbook trigger executed' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Гэтэл триггер хамгийн ихдээ гурван удаа ажиллах боломжтой. Үүний зарласан эрх олгох гол нь үүнийг гүйцэтгэж буй хүсэлт гаргагч клиент биш, үйлдлийн доторх зааврыг зөвшөөрдөг.

### 2. Гүйцэтгэлээс өмнө мэдүүлгийг шалгаарай {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Дахин төлбөр зарцуулахаасаа өмнө I105 эрх бүхий данс, гүйцэтгэх шүүлтүүр, үлдсэн давталтууд болон `executable` дахь ганц кодчилсон зааврыг баталгаажуул.

### 3. Аль аль давхаргыг гүйцэтгэж, хүлээнэ үү {#_3-execute-and-wait-for-both-layers}

Гүйцэтгэх гүйлгээ ба триггер үйлдэл нь тодорхой нотолгоо бүхий байдаг. `--wait` нь Хэрэгжсэн гүйлгээний эцсийн байдлыг хүлээдэг; `--trace` нь програмын гүйцэтгэлийн орчны гүйцэтгэлийн шинжилгээний тайланг бас мэдээлдэг.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust клиентүүд ижил хоёр төрөлжсөн зааврыг бүтээдэг. Энд `authority` нь `AccountId`, харин `client` нь тэр дансны нэрээр гарын үсэг зурдаг `iroha::blocking::Client` юм; `submit` нь Applied эцсийн байдлыг хүлээдэг:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned())],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
)?;
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit(ExecuteTrigger::new(trigger_id), fee)?;
```

## Баталгаажуулах {#verify}

Дууссан блокын түүхийг гүйцэтгэлийг шалгахын тулд сканнердаж, буурсан давталтын тоог үзнэ үү:

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Ядаж нэг гүйцэтгэл амжилттай байх ёстой. Хоёр гүйцэтгэл үлдсэн үед триггер идэвхтэй байх ёстой. Амжилттай триггер гүйцэтгэлгүй амжилттай илгээсэн нь хангалттай баталгаа биш юм.

## Алдааг олох болон засах {#troubleshooting}

- Бүртгэл зөвшөөрөгдөөгүй тул татгалзагдлаа гэдэг нь криптографийн гарын үүсгэгч нь тунхагласан эрх олгогч гол эрхтэй `CanRegisterTrigger` байхгүй гэсэн үг. Гүйцэтгэл нь тусдаа тодорхойлогдсон `CanExecuteTrigger` токен шаарддаг.
- Гүйлгээ нь триггер үйлдэл амжилтгүй болсныг мэдээлсэн үед Програмчлагдсан болох боломжтой. Дууссаны үр дүн ба алдааг уншаад, дараа нь бүх суулгасан зааврын хувьд триггер зөвшөөрлийн үндсэн эрхийн зөвшөөрлийг шалга.
- `Trigger with id … not found` нь бүртгэлийн гүйлгээ татгалзсан эсвэл гүйцэтгэлд өөр Torii/сүлжээний тохиргоо ашигласан байж болохыг илэрхийлж болно.
- Давталт нь тэгт хүрэхэд, нэмэлт давталт гаргах нь өөр нэг давуу эрхтэй бичлэг юм. Энэ жорыг дуугүйгээр хязгааргүй тригер болгон бүү өөрчил.
- Цэвэрлэгээний хувьд, `trigger unregister --id "$TRIGGER_ID"` нь тухайн триггерийн хувьд `CanUnregisterTrigger` болон тодорхой төлбөрийн сонголтыг шаарддаг.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Техникийн дуудах хурдан ажиллуулах нь тогтоосон эх кодын хувилбар дээр нэгдсэн туршилтуудыг эхлүүлдэг](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [Болсон үйл явдал болон триггер интеграцийн тестүүдийг тогтсон эх кодны хувилбарт хий](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [Тогтоосон эх кодын хувилбар дээр заавар гүйцэтгэхийг эхлүүлэх](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Триггерүүд](/mn/blockchain/triggers.md)
- [Өдөөгчийн жишээнүүд](/mn/blockchain/trigger-examples.md)
- [Үйл явдал](./stream-events.md)
