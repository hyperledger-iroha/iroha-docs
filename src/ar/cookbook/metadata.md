---
translation_locale: ar
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# البيانات الأساسية {#metadata}

## النتيجة {#outcome}

قراءة البيانات الأساسية على Taira ، وتحديد والتحقق من قيمة بيانات الأساسي لحساب واحد مع معاملة مدفوعة رسوم صراحة، وإزالة القيمة مرة أخرى. سوف تبقي البيانات العضوية الكبرى منفصلة عن بيانات metadata الرسوم المعاملة.

## الشروط المسبقة {#prerequisites}

- `curl` ، `jq`، Python 3.11 أو أحدث، والتيار `iroha` CLI.
- تمويل `taira.client.toml` و`taira.tx-metadata.json` من [تواصل إلى Taira ](./connect-to-taira.md).
- السلطة على البيانات الأساسية للحساب المستهدف. يستهدف المثال السلطة المصممة نفسها ؛ يحتاج حساب آخر إلى إذن دقيق.

## الخطوات {#steps}

### 1 . قراءة البيانات الوصفية بدون توقيع {#_1-read-metadata-without-a-signer}

البيانات الأساسية هي خريطة معتمدة `Name` إلى JSON. الخرائط الفارغة والمخرج المصفاة الفارغة هي نتائج صالحة.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

استخدم البيانات الوصفية الصغيرة أو حقول الترتيب. ضع الحمولات المفيدة الكبيرة خارج السجل وتخزين مرجع URI، أو SoraFS بدلاً من ذلك.

### 2- استنتاج الحساب المستهدف {#_2-derive-the-target-account}

قراءة المفتاح العام فقط من إعداد Taira وتحويله إلى نموذج I105 القائم على النطاق غير الحكم.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. حدد قيمة واحدة JSON {#_3-set-one-json-value}

يصبح JSON القراءة من المدخل القياسي قيمة الحساب `cookbook_profile`. على النقيض ، يرفق `--metadata ./taira.tx-metadata.json` حقل الرسوم إلى غلاف المعاملات. تمتلك الخريطتان أهدافا وأغراض مختلفة.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI يقتبس الرسوم، ويعلم، ويقدم، وينتظر بشكل افتراضي. لا تضيف `--no-wait` عندما تعتمد العملية القادمة على هذه القيمة.

::: warning حدود الإذن

المحقق النشط يقرر من يمكنه طفر كل كائن. تحديث حساب آخر `CanModifyAccountMetadata`; النطاقات، تعريف الأصول، NFTs, ولدى المحفزات تصريحات خاصة بتعريف البيانات الخاصة بهما. Taira لم تمنح السلطة المطلوبة، تشغيل نفس الأوامر الحسابية مع `./localnet/client.toml`, استبدال السلطة المحلية التي تم إنشاؤها. I105 ID, وتفشّل Taira ملف البيانات المعدنية الرسوم الحفاظ على اختيار المدفوع الرسوم المحلي الصريح.

:::

### 4 - إزالة المفتاح {#_4-remove-the-key}

اقرأ أولاً القيمة الملتزمة، ثم تقدم بعمل إزالة منفصل.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

بالنسبة لتطبيقات Python، فإن البنّاء المتطابقين المخطوطين هم `Instruction.set_account_key_value` و `Instruction.remove_account_key_value`؛ قم بإرسالهم مع بيانات المعاملة ومساعد انتظار من دليل [Python ](/ar/guide/tutorials/python.md#shared-setup).

## التحقق {#verify}

بعد المعاملة المحددة، يجب أن يعيد `meta get` الكائن مع `version: 1`. بعد إزالة، لا يجوز للبحث المباشر أعادة قيمة:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

تتميز قراءة الحساب المنفصل بين مفتاح البيانات المتعددة المفقودة من فشل الشبكة أو الحساب. يجب أيضًا تحديد رمز الإنتاج لكل قيمة JSON بعد إعدادها.

## حل المشاكل {#troubleshooting}

- يجب أن يحتوي المدخل القياسي على قيمة واحدة صالحة JSON . تحتاج السلاسل إلى اقتباسات JSON ؛ يجب أن تكون الأشياء والمصفوفات متشكلة بشكل جيد.
- مفاتيح البيانات المعدنية هي قيم `Name` وهي حساسة للحالة بعد التحليل. الحفاظ على قاموس مفتاح ثابت بدلاً من إنشاء مفاتيح نسخية لكل تغيير مخطط.
- `--metadata` هي بيانات أساسية للمعاملة؛ لا تحدد البيانات الأساسية للكتاب الرئيسي. استخدم أمر الكيان الفرعي `meta set` للآخر.
- إرسال ناجح يتبعه قراءة قديمة يمكن أن يكون تأخير الانتشار. انتظر النهاية التطبيقية ثم حاول مرة أخرى استفسار قبل إعادة الإرسال.
- إن رفض الإذن يحدد الكائن المستهدف وحدود السلطة. إعادة التدريب محلياً أو طلب الرمز الدقيق؛ لا تنقل بيانات التطبيق الخاصة إلى حقل البيانات الأساسية العامة لتجنب التحكم في الوصول.
- لا تخزين أبداً المفاتيح الخاصة أو العلامات الشخصية الخامة أو رموز الوصول، أو الوثائق الكبيرة في البيانات الأساسية.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [اختبارات دمج استفسارات البيانات المعدنية في الالتزام المتعلق](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK صانعي المعاملات في التزامات ثابتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [البيانات الأساسية](/ar/blockchain/metadata.md)
- [خيارات تخزين البيانات المعدنية وخيارات تخزن السجل ](/ar/guide/configure/metadata-and-store-assets.md)
- [مرجع التعليمات ](/ar/reference/instructions.md)
- [رموز الإذن ](/ar/reference/permissions.md)
