---
translation_locale: ar
translation_source: /cookbook/triggers.md
translation_source_hash: 93080591f5171c7ce25173eb1ef826d6f5ca661a17797be53e90aedab33ed0c3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المحفزات {#triggers}

## النتيجة {#outcome}

سجل محفز المكالمة الإضافية المحدودة على Taira ، قم بتنفيذها مرة واحدة، وانتظر النهاية التطبيقية، وتؤكد إنجازها بنجاح من تاريخ الكتل المتعهده.

## الشروط المسبقة {#prerequisites}

- الموقعة الممولة، `taira.client.toml`، `taira.tx-metadata.json`، و `TAIRA_ACCOUNT_ID` من [ربط إلى Taira](./connect-to-taira.md).
- Taira الإذن لتسجيل محفز ل `TAIRA_ACCOUNT_ID` وتنفيذ المحفز الناتج. الوهميات ذات الصلة هي `CanRegisterTrigger` مدرجة من قبل `authority` و `CanExecuteTrigger` مدرجة عن طريق `trigger`.
- إذا كانت هذه المنح غير متوفرة، استخدم شبكة محلية تم إنشاؤها ومركز مديرها. يحتاج سلطة الزناد أيضًا إلى كل الإذن المطلوب من قبل التعليمات التي سيتم تنفيذها.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## الخطوات {#steps}

### 1 - تسجيل محفز مدعوم بإرشادات {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` يقبل مجموعة JSON من التعليمات. تتركز تعليمة `Log` هذه المثال على تفويض الزناد بدلاً من تصاريح كائن الكتيب الثاني.

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

يمكن أن يعمل الزناد ثلاث مرات كحد أقصى. سلطته المعلنة، وليس المدعو الذي يحدث لتنفيذها، يسمح بالتعليمات داخل الإجراء.

### 2 - تحقق من الإعلان قبل التنفيذ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

تأكد من سلطة I105 ومصفح التنفيذ والتكرارات المتبقية والتعليمات الواحدة `Log` قبل أن تنفق رسوم أخرى.

### 3. تنفيذ وانتظر كلتا الطبقتين {#_3-execute-and-wait-for-both-layers}

تمتلك المعاملة التنفيذية والإجراء المنفذ أدلة متميزة. `--wait` تنتظر نهائية المعاملة المطبقة؛ `--trace` أيضاً تقرير تشخيص إكمال وقت التشغيل.

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

يقوم عملاء Rust بإنشاء نفس التعليمات المكتوبة. هنا `authority` هو علامة `AccountId` و `client` كحساب:

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

## التحقق {#verify}

فحص تاريخ الكتل الملتزمة لإكمال وتفقد عدد التكرار المتخفض:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

يجب أن يبلغ عن نجاح واحدة على الأقل. يجب أن يبقى الزناد نشطًا مع بقي اثنين من التنفيذات. الإرسال الناجح دون إنجاز الزناد الناجح ليس تحقيقا كافيا.

## حل المشاكل {#troubleshooting}

- رفض التسجيل لأنه غير مسموح به يعني أن الموقع يفتقر إلى `CanRegisterTrigger` للسلطة المعلنة. يتطلب تنفيذ رمز `CanExecuteTrigger` المحدد بشكل منفصل.
- يمكن للمعاملة الوصول إلى التطبيق في حين أن الإجراء الزناد يبلغ عن فشل. اقرأ نتيجة الانتهاء والخطأ؛ ثم تحقق من إذن سلطة الزناد لكل تعليمات متضمنة .
- `trigger not found` يمكن أن يعني رفض صفقة التسجيل أو استخدام تشكيل مختلف Torii/سلسلة لتنفيذها.
- عندما تصل التكرارات إلى الصفر، فإن صياغة المزيد من التكرارات هي كتابة خاصة أخرى. لا تغير هذه الوصفة بصمت إلى محفز لفترة غير محددة.
- لتنظيفها، `ledger trigger unregister --id "$TRIGGER_ID"` يتطلب `CanUnregisterTrigger` لهذا المحفز بالإضافة إلى اختيار رسوم صريحة.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل محفز الدعوة الإضافية في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/triggers/by_call_trigger.rs)
- [اختبارات إدماج الأحداث والتحفيز في الالتزام المتعلق ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events_and_triggers.rs)
- [تنفيذ تعليمات التشغيل في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [المحفزات](/ar/blockchain/triggers.md)
- [أمثلة محفزات ](/ar/blockchain/trigger-examples.md)
- [الأحداث](./stream-events.md)
