---
translation_locale: ar
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# بناء ونشر عقد ذكي {#build-and-deploy-a-smart-contract}

## نتيجة {#outcome}

تحقق وقم بتجميع عقد Kotodama V1، وشغّل دالة العرض العامة الخاصة به محليًا، وانشر مُخرَج IVM الذي تم التحقق منه مع رسوم يدفعها حساب توقيع المعاملة ومختارة صراحةً، واقرأ دالة العرض المنشورة عبر Torii.

## المتطلبات الأساسية {#prerequisites}

- نسخة عاملة من شفرة المصدر Iroha عند إنهاء البروتوكول `c8c872461e92f04325c350cdd952f4276e96f9dc`، Rust، وCargo.
- أداة CLI الحالية `iroha` و`musubi` (تُشغَّل بالأمر `cargo run -p musubi --` داخل النسخة العاملة من المصدر) بالإضافة إلى عميل Taira ممول من [الاتصال بـ Taira](./connect-to-taira.md).
- مسار مطلق في `IROHA_CONFIG`. يخزّن ربط الشبكة في Musubi مرجعًا إلى ملف العميل هذا ويوقّع النشر بمفتاح الحساب الخاص به.
- صلاحية الاسم المستعار. يشترط المُنفِّذ وجود `CanManageAccountAlias` للاسم المستعار الدقيق للعقد أو للنطاق الأعلى الذي يحتويه: النطاق المالك لـ `name::domain.dataspace`، أو مساحة البيانات لـ `name::dataspace`. لا تحتاج الحسابات المسجلة إلى إذن منفصل لتسجيل الشيفرة، وتتطلب مساحات الأسماء المحمية أيضًا سير عمل الحوكمة الخاص بالشبكة. تستخدم الأمثلة `cookbook_tuple::universal`؛ على Taira، استبدله باسم مستعار في نطاق تملكه، أو انشر على شبكة محلية مُولَّدة تمنح كتلة التكوين الخاصة بها نطاق الاسم المستعار.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## خطوات {#steps}

### 1. انسخ عقد Kotodama V1 المعروف بصلاحيته {#_1-copy-a-known-good-kotodama-v1-contract}

اعمل داخل الخروج المثبّت Iroha وانسخ عينة إرجاع المجموعة الخاصة بالمترجم بحيث يبقى المصدر وسلسلة الأدوات على نفس إخراج البروتوكول النهائي.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

المصدر الكامل صغير: دالة مساعدة خاصة `fn` ودالة `view fn` عامة واحدة للقراءة فقط تسمح صراحةً لكل مستدعٍ:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama يستهدف آلة Iroha الافتراضية و ABI الحالية الخاصة بها. إنها ليست لغة مصدر WASM أو EVM.

### ٢. تحقق من الأداة، ابنها، وتأكد من صحتها {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

النشر الأول يقوم بنشر القطعة الجاهزة وملحقات المصادقة. الثاني يعمل في وضع القراءة فقط `--verify` ويفشل إذا لم تتطابق أي مخرجات موجودة تمامًا مع المصدر الحالي. اعتبر ملف `.to` وكشفه الفني بمثابة مخرج بناء واحد قد تم مراجعته.

### 3. تشغيل الشيفرة الثنائية محليًا {#_3-run-the-bytecode-locally}

`compute` هي دالة `view fn` عامة للقراءة فقط. شغّلها باستخدام `debug-view`، الذي ينفّذ الشيفرة الثنائية المُجمَّعة محليًا على بيانات الاختبار الاختيارية من دون إرسال معاملة أو دفع رسومها.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama تُحوَّل الأعداد الصحيحة إلى JSON سلاسل نصية، لذلك تكون المجموعة المفكّكة `["3", "5"]`.

### ٤. نشر المُخرَج المُتحقَّق منه باستخدام Musubi {#_4-deploy-the-verified-artifact-with-musubi}

يفحص `iroha contract` العقود ويستدعي دوال العرض فيها ويصحّح أخطاءها لكنه لا ينشرها، لذا تتم عمليات النشر على Taira عبر Musubi. تقوم خدمة النشر الخاصة به بتحميل مقاطع الشيفرة الثنائية، وتسجيل البيان المُتحقَّق منه، وتقديم عملية واحدة `CommitContractDeployment`. وهي تحصل على تقدير لسعر الرسوم لكل معاملة، وترفض أي تقدير يغيّر الدافع المحدد أو مراجعة الراعي أو حد gas، ولا تنشر المُخرَج المبني مسبقًا إلا بعد أن يعيد بناء الحزمة المقفل إنتاج تجزئات الشيفرة وABI الخاصة به. على شبكة محلية تديرها Kagami، يقوم `kagami contract deploy` بدلًا من ذلك بنشر `./build/tuple_return_demo.to` مع `--alias cookbook_tuple::universal --json`؛ ويكون إيصاله تحت `.receipt`، ويطبع `kagami context show` إعدادات العميل التي تُستخدم بصفتها `IROHA_CONFIG`.

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

يستخدم الربط `--fee-payer authority`؛ ويعرض Musubi تقدير سعر الرسوم الدقيق بأصل رسوم Taira قبل التوقيع. قارن أصل الرسوم المُعاد مع الأصل الذي تنشره سياسة خدمة تمويل الشبكة التجريبية الحالية. تقبل استدعاءات العقد اختيار الرسوم فقط من خلال تقدير سعر الرسوم المباشر محدد النوع؛ بيانات تعريف المعاملة `gas_asset_id` ليست جزءًا من عقد الإصدار الأول.

### 5. قراءة دالة العرض المنشورة {#_5-read-the-deployed-view}

ينفّذ `contract view` نقطة الدخول المخصصة للقراءة فقط على Torii من دون معاملة أو رسوم. ليس لدالة العرض صيغة معاملة: يرفض Torii محدِّد دالة العرض على مسارات الاستدعاء الخاصة به.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## تحقق {#verify}

حلّ الاسم المستعار، واجلب البيان الموجود على السلسلة باستخدام هاش الشيفرة الذي يبلغ عنه Torii لدالة العرض المنشورة، ثم شغّل دالة العرض نفسها باستخدام العنوان المعياري:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

يكتمل النشر فقط عندما يُبلغ إيصال النشر بأن المُخرَج المخزَّن تم التحقق منه، ويحل الاسم المستعار إلى العنوان المعاد، ويكون البيان قابلاً للقراءة تحت نفس تجزئة الشيفرة، وتُرجع دالة العرض محليًا وعبر Torii القيمة `["3", "5"]`.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- الخطأ `deployment authority lacks CanManageAccountAlias`، أو خطأ المُنفِّذ `authority is not permitted to manage contract alias`، يعني أن الحساب لا يجوز له ربط ذلك الاسم المستعار. استخدم اسمًا مستعارًا في نطاق تملكه، أو احصل من مالك ذلك النطاق على منح الاسم المستعار الدقيق أو منح النطاق أو مساحة البيانات الخاصة به؛ وعلى الشبكة المحلية، امنحه في كتلة التكوين.
- يعني رفض مساحة الأسماء المحمية أن مساحة أسماء الاسم المستعار خاضعة للحوكمة. إدراج معرفات حسابات الموافقين ليس دليلًا على الموافقة؛ استخدم سير عمل الحوكمة الخاص بالشبكة (`iroha app gov deploy propose`) لمساحة الأسماء تلك، أو اختر اسمًا مستعارًا خارجها.
- عدم تطابق البيان أو ABI يعني أن الشيفرة الثنائية والبيان وبيئة تنفيذ برنامج العقدة لا تصف المُخرَج نفسه. أعد البناء عند نسخة الشيفرة المصدرية المثبتة، ثم أعد تشغيل البناء باستخدام `--verify`.
- `fee quote changed ... gas bound` يعني أن النية المطلوبة المكتوبة والسعر المباشر غير متوافقين. قم بإعادة الفحص بدلاً من تعديل معاملة موقعة.
- يحتفظ النشر المتقطع بخطته الموقعة في سجل يومي. استعده باستخدام `musubi deploy --resume <JOURNAL>` بدلًا من توقيع خطة جديدة.
- الخطأ `is read-only and cannot be invoked as a transaction` أو `is not a kotoage or lifecycle entrypoint` يعني أن `compute` أُرسلت إلى أمر استدعاء. يعلن هذا المثال عن `view fn`، لذا استخدم `debug-view` محليًا و`view` على Torii.
- تتطلب استدعاءات العقود حد gas موجبًا ومحدد النوع. يرفض عقد الاستدعاء في الإصدار الأول بيانات gas أو أصل الرسوم الوصفية على المستوى الأعلى.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [تنفيذ أمر Kotodama V1 في النسخة المثبتة من رمز المصدر](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [عينة مصدر تُرجع Tuple عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [أمر النشر في Musubi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) و[خدمة نشر العقود الأصلية](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) عند إصدار الشيفرة المصدرية المثبت
- [اختبارات تكامل العقد عند إصدار الشيفرة المصدرية المثبت](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [العقود الذكية](/ar/blockchain/smart-contracts.md)
- [CLI مرجع](/ar/get-started/operate-iroha-via-cli.md)
