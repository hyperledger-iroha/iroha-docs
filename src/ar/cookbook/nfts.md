---
translation_locale: ar
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## نتيجة {#outcome}

افحص حالة Taira NFT، ثم قم بالتسجيل والتحديث والنقل والاستعلام عن NFT فريد على شبكة محلية مُنشأة. يستخدم سير العمل معرف `name$domain.dataspace` NFT مؤهل بالكامل ومعرفات مالك واحدة حسب معيار البروتوكول I105.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python 3.11 أو أحدث، و`iroha` الحالي CLI.
- وصول للقراءة فقط Taira.
- لعمليات الكتابة، شبكة محلية مُنشأة باستخدام `kagami localnet generate --peers 4 --out-dir ./localnet` كما في [إطلاق Iroha](/ar/get-started/launch-iroha.md)، مع `./localnet/client.toml` و Torii على `http://127.0.0.1:8080`، بالإضافة إلى نطاق NFT يملكه موقّعها (انظر الخطوة 2).

## خطوات {#steps}

### 1. فحص مجموعة Taira العامة {#_1-inspect-the-public-taira-collection}

الصفحة الفارغة هي قراءة ناجحة: فهذا يعني عدم وجود أي NFTs مرئية في الصفحة المطلوبة.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs هي سجلات فريدة، وليست أرصدة رقمية. لديها معرف واحد، ومالك واحد، وخريطة محتوى مضغوطة، تُعيدها صفوف مجموعة Torii بصفتها `metadata` ويُعيدها `ledger nft get` بصفتها `content`.

### 2. إعداد هويات المالك المحلي {#_2-prepare-local-owner-ids}

يحتاج مثال الكتابة إلى نطاق يملكه حساب التوقيع، أو منح `CanRegisterNft` عليه. لا تسجّل الشبكة المحلية المُولَّدة أي نطاق تطبيق لعميلها، والتسجيل المباشر للنطاقات محجوز لكتلة التكوين، لذا اضبط `NFT_DOMAIN` على نطاق `name.dataspace` يتحكم فيه موقّعك. استخرج الكيان المخول المكوَّن دون كشف مفتاحه الخاص، ثم اختر حسابًا مسجلاً آخر كوجهة للنقل.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

الفاصل `$` ينتمي إلى الصيغة النصية لمعرّف NFT. احتفظ بالنطاق `name.dataspace` كاملًا في المعرف.

### ٣. سجّل NFT بالمحتوى الابتدائي {#_3-register-the-nft-with-initial-content}

يقرأ CLI الكائن الأولي JSON من الإدخال القياسي. يصبح المبدأ الحالي للتفويض هو المالك.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### ٤. تحديث خريطة المحتوى {#_4-update-the-content-map}

قيم البيانات الوصفية هي JSON. إدراج مفتاح يقوم بإضافة أو استبدال هذا الإدخال فقط؛ لا يقوم باستبدال سجل NFT بالكامل.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### ٥. نقل الملكية {#_5-transfer-ownership}

زوّد كل من معرفي حساب بروتوكول-قياسي مفرد I105. يجب حل الاسم المستعار قبل استخدامه كـ `--from` أو `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning حدود الإذن

في Taira، تستخدم كل عملية كتابة `--fee-payer authority`؛ ويعرض CLI تقدير سعر الرسوم الدقيق بأصل رسوم Taira قبل التوقيع. يتم التحقق من التسجيل والنقل والإزالة وتحديثات البيانات الوصفية بواسطة بيئة تنفيذ البرنامج النشطة (`CanRegisterNft`، `CanTransferNft`، `CanUnregisterNft`، و`CanModifyNftMetadata` في سطح الإذن الافتراضي). استخدم نطاقًا يملكه حسابك، أو نطاقًا يحمل حسابك هذه المنح عليه.

:::

بالنسبة إلى سير العمل المملوك للعقد، يتيح Kotodama استدعاءات مضيف NFT محددة الأنواع. وفيما يلي حالة اختبار دورة الحياة الدقيقة التي يجمعها وينفذها اختبار توثيق IVM المثبّت:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
    }
}
```

القيم الثابتة الاثنين I105 هي آثار اختبار أولية؛ يقوم مشغل الاختبار بتسجيل الوجهة قبل التنفيذ. إنها ليست `CURRENT_OWNER` و `NEW_OWNER` من جولة العمل CLI. لعقد تطبيق، قم بتزويد حساباته الفعلية ذات البروتوكول القياسي الفردي، ثم قم بتجميعه، اختباره، نشره، واستدعاؤه عبر [العقود الذكية](./smart-contracts.md). لا تقدم الشيفرة الثنائية غير المراجعة إلى Taira، وتذكر أن تنفيذ العقد لا يزال يمر عبر تفويض بيئة تنفيذ البرمجيات.

## تحقق {#verify}

اقرأ NFT مباشرة وأكد أن مالكه قد تغير بينما ظل محتواه متصلاً:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

يطبع CLI سجل NFT نفسه. الثوابت الموثوقة هي `id` و`owned_by` و`content`.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `name$domain` يمكن أن يعتمد على مساحة البيانات العالمية في بعض المحللات، ولكن يجب على معرفات الكتب التطبيقية والتطبيقات استخدام الشكل الصريح `name$domain.dataspace`.
- يتم رفض تسجيل متكرر لنفس معرف NFT. استخدم شبكة محلية جديدة أو اختر معرفًا جديدًا مستقرًا لسجل مختلف.
- يجب أن تكون بيانات التعريف المدخلة صالحة JSON على الإدخال القياسي. سلسلة القشرة بدون اقتباس JSON ليست قيمة بيانات تعريف.
- يتطلب التحويل الذي يوقعه حساب غير المالك الحالي ملكية نطاق NFT أو منح `CanTransferNft` محددًا بدقة؛ تغيير `--from` لا يغير الموقّع التشفيري.
- لا يغيّر النقل سوى `owned_by`. تبقى تحديثات البيانات الوصفية وإلغاء التسجيل بيد مالك النطاق أو حساب يحمل `CanModifyNftMetadata` أو `CanUnregisterNft` لذلك الـ NFT؛ ويمكن للمالك الجديد نقله إلى طرف آخر.
- Taira يمكن أن تُرجع مجموعة NFT فارغة. لا تعامل `items: []` كدليل على أن تعليمات NFT غير متاحة.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [NFT اختبارات التكامل عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT اختبارات استدعاء فني للمضيف عند نسخة رمز المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [أداة اختبار دورة الحياة الدقيقة Kotodama NFT عند إصدار الكود المصدري المثبت](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [اختبارات أمثلة توثيق Kotodama عند نسخة رمز المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/ar/blockchain/nfts.md)
- [البيانات الوصفية](/ar/blockchain/metadata.md)
- [تعليمات](/ar/blockchain/instructions.md)
- [رموز الإذن](/ar/reference/permissions.md)
