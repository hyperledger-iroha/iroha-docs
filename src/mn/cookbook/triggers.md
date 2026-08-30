---
translation_locale: mn
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хөгжүүлэгчид {#triggers}

## Үр дүн {#outcome}

Taira дээр эцсийн дуудлагыг бүртгүүлж, нэг удаа гүйцэтгэж, хэрэглэгдэх эцэслэлийг хүлээгээд, баталгаажуулсан блок түүхийн үр дүнгээр амжилттай дууссан нь батлах.

## Урьдчилсан шаардлага {#prerequisites}

- Санхүүжилтээр гарын үсэг зурсан, `taira.client.toml`, `taira.tx-metadata.json`, болон `TAIRA_ACCOUNT_ID` цаашид [Нэвтрүүлэг Taira](./connect-to-taira.md).
- Taira зөвшөөрөл нь `TAIRA_ACCOUNT_ID` -ийн ачаалал бүртгэж, үр дүнд хүрсэн ачааллыг гүйцэтгэх. Үүнтэй холбогдох токенүүд нь `CanRegisterTrigger`-д `authority` болон `CanExecuteTrigger`-д `trigger` -д зориулсан байна.
- Хэрэв эдгээр тэтгэврийн санхүүжилт байхгүй бол үүсгэсэн орон нутгийн сүлжээ болон түүний захирагч үйлчлүүлэгчийг ашиглах хэрэгтэй. Тэггер эрх баригч нь мөн тушаалын дагуу шаарддаг бүх зөвшөөрлийг хэрэглэх шаардлагатай.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Хадгалт {#steps}

### 1. Сургалтын дэглэмийг дэмжсэн галт тэрэг бүртгүүлэх. {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` нь JSON заалын массив хүлээн зөвшөөрдөг. `Log` суурьшил нь энэ жишээг хоёр дахь томоохон бүртгэлийн объектын зөвшөөрлийн оронд эхлүүлэх зөвшөөрөл дээр төвлөрүүлнэ.

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

Триггер нь хамгийн ихдээ гурван удаа ажиллуулж болно. Түүний мэдэгдсэн эрх мэдэл, түүнийг гүйцэтгэх зовооч биш үйл ажиллагааны дотор заалыг зөвшөөрдөг байна.

### 2. Хөдөлмөрийг гүйцэтгэхээс өмнө мэдүүлгийг хянах {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

I105 эрх мэдэл, гүйцэтгэх фильтр, үлдсэн давтамдлал, нэг удаагийн `Log` заавар төлөхөөс өмнө баталгаажуулна.

### 3. Хоёр давхаргыг гүйцэтгэж хүлээх. {#_3-execute-and-wait-for-both-layers}

Хөдөлмөрийн гүйцэтгэх үйл ажиллагаа болон эхлүүлэх үйлдэл нь тодорхой баримттай. `--wait` хэрэглэгдэх бүтээн байгуулалтын эцсийн хугацааг хүлээдэг; `--trace` мөн гүйлгээний цаг хугацааны төгсгөлдүйн оношилгоо мэдээллийг өглөө.

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

Rust үйлчлүүлэгчид ижил хоёр бичигдсэн заалыг бий болгодог. Энд `authority` нь `AccountId` болон `client` тэмдэгүүд тухайн бүртгэлтэй:

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

## Бүртгэнэ {#verify}

Захиалгасан блоктын түүхийг сканж, дахин давтагдалсан тоог шалгаарай:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Хамгийн багадаа нэг гүйцэтгэл амжилттай бүртгэгдэх ёстой. Тэгжер нь хоёр гүйцэтгэл үлдсэн үедээ идэвхтэй байх ёстой. Үр дүнтэй өргөн мэдүүлэг хийгээгүй бол хангалттай сануулалт биш.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- Тус бүртгэл нь зөвшөөрөлгүй гэж үгүйсгэгдсэн бол гарын үсэг зурагч байхгүй гэсэн үг юм `CanRegisterTrigger` Хөдөлмөрийн хэрэгслийг гүйцэтгэхэд тусдаа `CanExecuteTrigger` Токен.
- Аливаа гүйлгээ хэрэглэгдэхэд хүрч болно, хэрэв триггер үйлдэл нь алдаатай гэж мэдэгдэж байна. Тохирсон үр дүн болон алдааг уншина уу; дараа нь туршилтын эрх мэдлийн зөвшөөрлийг бүрэлдэхүүнтэй заавар шалгаарай.
- `trigger not found` нь бүртгэлийн гүйлгээг татгалзсан, эсвэл гүйцэтгэхэд өөр Torii / зангилааны конфигурацийг ашигласан гэсэн үг болно.
- Дашрамдсан нь нургаар хүрч, дахин давтах нь бас нэг эрхэм бичлэг юм. Энэ рецептыг тодорхойгүй хугацаагаар өөрчлөх хэрэггүй.
- Улаангахын тулд `ledger trigger unregister --id "$TRIGGER_ID"` нь тухайн түлхүүр болон тодорхой төлбөрийн сонгон шалгаруулалтаар `CanUnregisterTrigger` шаардагдах болно.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Урьдчилсан үүрэг гүйцэтгэгч ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs) дээр дуудлага дамжуулагч интеграцийн туршилтууд
- [Үргэлжсэн commit-д үйл явц, үүсгэгч интеграцийн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Триггер суурь заалтын гүйцэтгэх нь pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Тэггерүүд](/mn/blockchain/triggers.md)
- [Триггерүүдийн жишээ](/mn/blockchain/trigger-examples.md)
- [үйл явц](./stream-events.md)
