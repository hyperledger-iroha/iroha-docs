---
translation_locale: ar
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# المحفزات {#triggers}

## نتيجة {#outcome}

سجّل محفّز استدعاء تقني محدود على Taira، نفّذه مرة واحدة، انتظر حتى يتم الإنجاز النهائي، وتأكد من إتمامه بنجاح من سجل الكتل النهائي.

## المتطلبات الأساسية {#prerequisites}

- موقّع تشفير ممول، `taira.client.toml`، `taira.tx-metadata.json`، و`TAIRA_ACCOUNT_ID` من [الاتصال بـ Taira](./connect-to-taira.md).
- Taira الإذن بتسجيل مشغل لـ `TAIRA_ACCOUNT_ID` وتنفيذ المشغل الناتج. الرموز ذات الصلة هي `CanRegisterTrigger` ضمن نطاق `authority` و `CanExecuteTrigger` ضمن نطاق `trigger`.
- إذا لم تكن تلك المنح متاحة، استخدم شبكة محلية منشأة وعميل المشرف الخاص بها. كما يحتاج المبدأ المخول للتشغيل إلى كل الإذنات المطلوبة من قبل التعليمات التي سينفذها المحفز.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## خطوات {#steps}

### 1. تسجيل مشغل مدعوم بالتعليمات {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` يقبل مصفوفة JSON من التعليمات. تعليمات `Log` تحافظ على تركيز هذا المثال على تفويض المشغّل بدلاً من أذونات كائن دفتر الأستاذ الثاني في البلوكشين.

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

يمكن للمُحفِّز أن يعمل ثلاث مرات على الأكثر. الشخص المخوَّل المعلن عن طريقه، وليس العميل الذي يطلب تنفيذها، هو من يُفوِّض التعليمات داخل الإجراء.

### 2. افحص الإعلان قبل التنفيذ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

تأكد من صلاحية التفويض I105، وفلتر التنفيذ، والتكرارات المتبقية، والتعليمات الفردية `Log` قبل دفع أي رسوم أخرى.

### 3. نفّذ وانتظر كلا الطبقتين {#_3-execute-and-wait-for-both-layers}

معاملة التنفيذ وإجراء الزناد لهما أدلة مميزة. `--wait` ينتظر حتمية المعاملة المطبقة؛ `--trace` يبلغ أيضًا عن تشخيصات اكتمال بيئة تنفيذ البرنامج.

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

Rust يقوم العملاء ببناء نفس التعليمات المكتوبة مرتين. هنا `authority` هو `AccountId` و `client` يوقع باسم ذلك الحساب:

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

## تحقق {#verify}

افحص تاريخ الكتل النهائية للتحقق من الاكتمال وتفقد عدد التكرارات المُنخفض:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

يجب أن يبلغ إنهاء واحد على الأقل عن النجاح. يجب أن تظل الزناد نشطًا مع بقاء تنفيذين. لا تكفي عملية تقديم ناجحة بدون إتمام ناجح للزناد كتحقق.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- تم رفض التسجيل لعدم الإذن يعني أن الموقّع التشفيري يفتقر إلى `CanRegisterTrigger` للجهة المخولة المعلنة. يتطلب التنفيذ وجود رمز `CanExecuteTrigger` المحدد بشكل منفصل.
- يمكن أن تصل المعاملة إلى حالة 'تم التطبيق' بينما يُبلغ إجراء الزناد عن فشل. اقرأ نتيجة الإكمال والخطأ؛ ثم تحقق من أذونات صاحب تفويض الزناد لكل تعليمات مضمنة.
- `trigger not found` يمكن أن يعني أن عملية التسجيل قد تم رفضها أو تم استخدام Torii/تكوين سلسلة مختلف للتنفيذ.
- عندما تصل التكرارات إلى الصفر، فإن إصدار المزيد من التكرارات هو كتابة مميزة أخرى. لا تغير هذه الوصفة بصمت إلى مشغل غير محدد.
- للتنظيف، يتطلب `ledger trigger unregister --id "$TRIGGER_ID"` `CanUnregisterTrigger` لذلك الزناد بالإضافة إلى اختيار الرسوم الصريح.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات التكامل التي يتم تشغيلها عبر الاستدعاء الفني عند النسخة المثبتة من كود المصدر](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [اختبارات تكامل الأحداث والمحركات عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [تشغيل تنفيذ التعليمات عند إصدار الشفرة المصدرية المثبت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [المحفزات](/ar/blockchain/triggers.md)
- [أمثلة على المشغلات](/ar/blockchain/trigger-examples.md)
- [الأحداث](./stream-events.md)
