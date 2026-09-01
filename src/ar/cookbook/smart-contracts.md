---
translation_locale: ar
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# بناء ونشر عقد ذكي {#build-and-deploy-a-smart-contract}

## نتيجة {#outcome}

تحقق وقم بتجميع عقد Kotodama V1، وقم بتنفيذ نقطة الدخول العامة محليًا، وانشر القطعة الفنية IVM التي تم التحقق منها، وحاكي نقطة الدخول المنشورة، وقدمها مع تقدير صريح لسعر الرسوم التي يدفعها حساب توقيع المعاملة.

## المتطلبات الأساسية {#prerequisites}

- نسخة عاملة من شفرة المصدر Iroha عند إنهاء البروتوكول `0010c5a70039eac101a4846499ba9ceaf43eb65c`، Rust، وCargo.
- العميل الحالي `iroha` CLI بالإضافة إلى عميل ممول Taira من [الاتصال بـ Taira](./connect-to-taira.md).
- المسارات المطلقة في `IROHA_CONFIG` و `IROHA_PRIVATE_KEY_FILE`. يجب أن يكون ملف المفتاح ملفًا عاديًا برابط واحد ومملوكًا من قبل المالك مع الوضع `0600`؛ مساعد النشر لا يحتوي عمدًا على وسيطة مفتاح خاص مضمنة.
- Taira موافقة المشغل. تسجيل رمز العقد يتطلب `CanRegisterSmartContractCode`، ويمكن أن تتطلب النشرات المحمية نسب الحوكمة وتنفيذها. إذا لم يمنح Taira ذلك الوصول، فقم بتنفيذ النشر على شبكة محلية تم إنشاؤها والتي تمنح أصل سلسلة الكتل الخاص بها الإذن.

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## خطوات {#steps}

### 1. انسخ عقد Kotodama V1 المعروف بصلاحيته {#_1-copy-a-known-good-kotodama-v1-contract}

اعمل داخل الخروج المثبّت Iroha وانسخ عينة إرجاع المجموعة الخاصة بالمترجم بحيث يبقى المصدر وسلسلة الأدوات على نفس إخراج البروتوكول النهائي.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

المصدر الكامل صغير ويستخدم الصياغة الحالية `seiyaku`/`kotoage`:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama يستهدف آلة Iroha الافتراضية و ABI الحالية الخاصة بها. إنها ليست لغة مصدر WASM أو EVM.

### ٢. تحقق من الأداة، ابنها، وتأكد من صحتها {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

النشر الأول يقوم بنشر القطعة الجاهزة وملحقات المصادقة. الثاني يعمل في وضع القراءة فقط `--verify` ويفشل إذا لم تتطابق أي مخرجات موجودة تمامًا مع المصدر الحالي. اعتبر ملف `.to` وكشفه الفني بمثابة مخرج بناء واحد قد تم مراجعته.

### 3. تشغيل الشيفرة الثنائية محليًا {#_3-run-the-bytecode-locally}

`compute` نقطة دخول عامة في `kotoage`. شغّله باستخدام `debug-call`، الذي ينفّذ على بيانات اختبار محلية من دون إرسال معاملة أو دفع رسومها.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama تُحوَّل الأعداد الصحيحة إلى JSON سلاسل نصية، لذلك تكون المجموعة المفكّكة `["3", "5"]`.

### ٤. النشر من خلال المساعد الأصلي {#_4-deploy-through-the-native-helper}

يقوم المساعد بتحميل مقاطع الكود الثنائي، وتسجيل السجل الفني الموقع، وتقديم عملية واحدة `CommitContractDeployment`. كما يقوم بتحديد رسوم لكل معاملة ويرفض أي عرض يغير الدافع المحدد أو حد تكلفة تنفيذ المعاملة.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

طلب `charge_limits` الفارغ ليس معرف أصل منسوخ: يساعد المساعد في قبول العرض الحي الدقيق قبل التوقيع. قارن الأصل المحمل بالرسوم مع استجابة خدمة تمويل الشبكة التجريبية الحالية. تقبل استدعاءات العقد اختيار الرسوم فقط من خلال العرض المباشر المطبوع؛ `gas_asset_id` بيانات تعريف المعاملة ليست جزءًا من العقد بالإصدار الأول.

### 5. محاكاة واستدعاء نقطة الدخول المنتشرة {#_5-simulate-and-call-the-deployed-entrypoint}

تشغيل المحاكاة لنقطة الدخول العامة على Torii بدون تقديم. يُعد الاستدعاء الفني التالي معاملة وبالتالي يحدد صريحًا دافع رسوم السلطة المصرح لها. كلا الأمرين يربطان حد تكلفة تنفيذ المعاملة البالغ 1,500,000.

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## تحقق {#verify}

حلّ الاسم المستعار، واجلب البيان الموجود على السلسلة باستخدام هاش الشيفرة المُعاد، ثم حاكِ نقطة الدخول العامة نفسها باستخدام العنوان المعياري:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

يكتمل النشر فقط عندما يحل الاسم المستعار إلى العنوان المعاد، ويكون البيان الفني قابلاً للقراءة تحت نفس تجزئة الشيفرة التشفيرية، وتُرجع المحاكاة المحلية و Torii قيمة `["3", "5"]`، وتصل الدعوة الفنية المقدمة إلى `Applied`.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `CanRegisterSmartContractCode` الفشل يتطلب منح مشغل Taira أو تغيير التكوين الأولي/التمهيدي على الشبكة المحلية. لا يمكن لحساب عادي منح هذا الإذن لنفسه بعد ذلك.
- رفض الحوكمة أو الممر المحمي يعني أن النشر يحتاج إلى تحديد الموافق الدقيق المطلوب من قبل تلك الشبكة. قم بتنسيق قائمة الموافقين؛ لا تخترع معرفات الحسابات.
- المخطط الفني أو عدم التطابق ABI يعني أن الشيفرة الثنائية، والمخطط الفني، وبيئة تنفيذ برنامج العقدة لا تصف نفس القطعة. أعد البناء عند نسخة الشيفرة المصدرية المثبتة باستخدام `--verify`.
- `fee quote changed ... gas bound` يعني أن النية المطلوبة المكتوبة والسعر المباشر غير متوافقين. قم بإعادة الفحص بدلاً من تعديل معاملة موقعة.
- يرفض مساعد النشر المفاتيح المضمنة، وأوضاع ملفات المفتاح المتساهلة، والروابط الرمزية، والملفات المرتبطة بشكل متعدد قبل الإرسال عبر الشبكة.
- خطأ نقطة الدخول للعرض فقط يعني أن `compute` تم توجيهه عبر عائلة الأوامر الخاطئة. هذا المثال يعلن عن `kotoage`، لذا استخدم محاكاة الاستدعاء الفني أو الإرسال.
- تتطلب استدعاءات العقود حد gas موجبًا ومحدد النوع. يرفض عقد الاستدعاء في الإصدار الأول بيانات gas أو أصل الرسوم الوصفية على المستوى الأعلى.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [Kotodama V1 تنفيذ الأمر في النسخة المثبتة من رمز المصدر](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [عينة مصدر تُرجع Tuple عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [مساعد النشر المحلي عند إصدار الشيفرة المصدرية المثبت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [اختبارات تكامل العقد عند إصدار الشيفرة المصدرية المثبت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [العقود الذكية](/ar/blockchain/smart-contracts.md)
- [CLI مرجع](/ar/get-started/operate-iroha-via-cli.md)
