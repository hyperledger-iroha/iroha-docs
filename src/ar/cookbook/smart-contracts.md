---
translation_locale: ar
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 67778f9fc4f2b6fa0288f5921402cf5509515aae678e98b8192e103dfe284db3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# بناء وعمل عقد ذكي {#build-and-deploy-a-smart-contract}

## النتيجة {#outcome}

التحقق ووضع عقد Kotodama V1، وتنفيذ نقطة دخوله العامة محلياً، ونشر الأثاث المتحقق من التحقق منه IVM، ومحاكاة نقطة دخول المنشأة، وتقديمها مع رسوم مدفوعة صراحة من قبل السلطات.

## الشروط المسبقة {#prerequisites}

- التحقق من مصدر Iroha عند `0010c5a70039eac101a4846499ba9ceaf43eb65c` ، Rust، و Cargo.
- العميل الحالي `iroha` CLI بالإضافة إلى عميل تمويله Taira من [ربط مع Taira ](./connect-to-taira.md).
- المسارات المطلقة في `IROHA_CONFIG` و `IROHA_PRIVATE_KEY_FILE`. يجب أن يكون ملف المفتاح ملفًا منتظمًا واحدًا يحتفظ به المالك مع وضع `0600`. ليس لدى مساعد التنفيذ عمداً حجة مفتاح خاص داخل الخط.
- الموافقة على المشغل Taira. يتطلب تسجيل رمز العقد `CanRegisterSmartContractCode` ، والتنفيذات المحمية قد تتطلب إعطاء الحكم وتنفيذها. إذا لم يمنح Taira هذا الوصول، قم بتنفيذ النشر على شبكة محلية تم إنشاؤها التي تمنح السلطة من أصلها.

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

## الخطوات {#steps}

### 1. نسخة عقد معروف جيد Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

العمل داخل Iroha التحقق وتسجيل نموذج تعويض الجهاز المحمول بحيث يبقى المصدر وسلسلسلة الأدوات على نفس المشاركة.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

المصدر الكامل صغير ويستخدم النصية الحالية `seiyaku`/`kotoage`:

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

Kotodama تستهدف الآلة الافتراضية Iroha و ABI الحالية. إنها ليست لغة مصدر WASM أو EVM.

### 2- التحقق من القطع الأثرية وبناءها والتحقق منها. {#_2-check-build-and-verify-the-artifact}

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

النسخة الأولى تنشر القطع الأثرية والسيارات الجانبية الموثقة. تعمل الثانية في وضع القراءة فقط `--verify` وتفشل إذا كانت أي مخرجات موجودة لا تتطابق تمامًا مع المصدر الحالي. تعامل ملف `.to` وخطابها كإنتاج بناء واحد مراجعت.

### إشغال رمز البايت محليًا {#_3-run-the-bytecode-locally}

`compute` هي نقطة دخول عامة `kotoage`. قم بتشغيلها باستخدام `debug-call`، والتي تنفيذها ضد الأجهزة المحلية دون تقديم أو دفع ثمن المعاملة.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

يتم تقديم الأرقام الكاملة Kotodama كسلسلات JSON، وبالتالي فإن التوبل المفكّر هو `["3", "5"]`.

### 4 - إرسالها من خلال المساعد الأصلي {#_4-deploy-through-the-native-helper}

يقوم المساعد بتحميل قطع من رمز البايت، ويسجل المخطط الموقّع، ويرسل عملية واحدة `CommitContractDeployment`. يقتبس الرسوم في كل معاملة ويرفض اقتباسًا يغير المدفوع الذي تم اختياره أو خط الوقود.

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

الطلب الفارغ `charge_limits` ليس تحديد الأصول المنسخ: المساعد يقبل الاقتراح الحي الدقيق قبل التوقيع. مقارنة أصل الرسوم المستردة مع الـ استجابة النوافذ الحالية. دعوات العقد تقبل اختيار الرسوم فقط من خلال الاقتراح المكتوب مباشر؛ `gas_asset_id` بيانات المعاملة ليست جزءاً من عقد الإصدار الأول.

### 5 - محاكاة وتصوير نقطة الدخول المنشورة {#_5-simulate-and-call-the-deployed-entrypoint}

تقوم المحاكاة بتشغيل نقطة الدخول العامة على Torii دون تقديم. العملية التالية هي معاملة وبالتالي تختار مدفوع رسوم السلطة صراحة. ترتبط كلتا الأوامر مع الحد الـ 1,500,000 من الغاز.

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

## التحقق {#verify}

قم بحل الاسم الخاطئ، احصل على المخطط في السلسلة بواسطة رمز الاختراق المرجع، وتحاكي نفس نقطة الدخول العامة عن طريق العنوان القديس:

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

يتم استكمال التنفيذ فقط عندما يصل الاسم الخاطئ إلى العنوان المرجع ، ويتم قراءة المخطط تحت نفس رمز الهاش ، وإعادة المحاكاة المحلية و Torii `["3", "5"]` ، وتصل الدعوة المرسلة إلى `Applied`.

## حل المشاكل {#troubleshooting}

- يتطلب فشل `CanRegisterSmartContractCode` منح مشغل Taira أو تغيير الجينيس / التشغيل على localnet. لا يمكن للحساب العادي أن يمنح هذا الإذن بنفسه بعد الحقيقة.
- الحكم أو رفض المسارات المحمية يعني أن الانتشار يحتاج إلى تصنيف الموافقة الدقيقة التي تتطلبها تلك الشبكة. تنسيق قائمة الموافقة؛ لا تختلق حساب IDs.
- يُعَني عدم مطابقة المظاهر أو ABI أن شفرة البايت، والمظاهر، وأوقات تشغيل العقدة لا تصف نفس القطع الأثرية. أعيد بناءها في التزامن المتعلق مع `--verify`.
- `fee quote changed ... gas bound` تعني عدم توافق النية المطبوعة المطلوبة والاقتباس الحي. إعادة التقدم بدلاً من تعديل المعاملة الموقعة.
- يرفض مساعد النشر المفاتيح الداخلية، وأوضاع ملفات المفاتيح السماحية، والروابط المتزايدة، ومضاعفة الملفات المرتبطة قبل تقديم الشبكة.
- خطأ نقطة دخول عرض فقط يعني أن `compute` تم توجيهها من خلال عائلة الأوامر الخاطئة. هذه العينة تعلن `kotoage` ، لذلك استخدم محاكاة المكالمة أو تقديمها.
- تتطلب المكالمات العقدية حدًا إيجابيًا للغاز. يرفض عقد المكالمة الأولى الإفراج عن بيانات الغاز أو أصول الرسوم على مستوى الأعلى.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [تنفيذ الأوامر Kotodama V1 في اللجنة المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [عينة مصدر العودة المضطربة في الالتزام المتعلق ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [مساعد النشر الأصلي في الالتزام المعلق](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [اختبارات تكامل العقود في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [العقود الذكية ](/ar/blockchain/smart-contracts.md)
- [إشارة CLI](/ar/get-started/operate-iroha-via-cli.md)
