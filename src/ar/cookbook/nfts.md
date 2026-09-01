---
translation_locale: ar
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## نتيجة {#outcome}

افحص حالة Taira NFT، ثم قم بالتسجيل والتحديث والنقل والاستعلام عن NFT فريد على شبكة محلية مُنشأة. يستخدم سير العمل معرف `name$domain.dataspace` NFT مؤهل بالكامل ومعرفات مالك واحدة حسب معيار البروتوكول I105.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python 3.11 أو أحدث، و`iroha` الحالي CLI.
- وصول للقراءة فقط Taira.
- للكتابات، شبكة محلية مُولَّدة من [إطلاق Iroha](/ar/get-started/launch-iroha.md)، مع `./localnet/client.toml` و Torii على `http://127.0.0.1:8080`.

## خطوات {#steps}

### 1. فحص مجموعة Taira العامة {#_1-inspect-the-public-taira-collection}

الصفحة الفارغة هي قراءة ناجحة: فهذا يعني عدم وجود أي NFTs مرئية في الصفحة المطلوبة.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs هي سجلات فريدة، وليست أرصدة رقمية. لديها معرف واحد، ومالك واحد، وخريطة بيانات وصفية مضغوطة `content`.

### 2. إعداد هويات المالك المحلي {#_2-prepare-local-owner-ids}

يستخدم المثال الكتابي نطاق `wonderland.universal` المسجّل. استخرج الكيان المخول المكوَّن دون كشف مفتاحه الخاص، ثم اختر حسابًا مسجلاً آخر كوجهة للنقل.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

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

الفاصل `$` ينتمي إلى نموذج النص NFT. احتفظ بنطاق `wonderland.universal` الكامل ولاحقة مساحة البيانات.

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

في Taira، كل عملية كتابة تتطلب أيضًا `--metadata ./taira.tx-metadata.json` ودافع رسوم صريح. يتم التحقق من التسجيل والنقل والإزالة وتحديثات البيانات الوصفية بواسطة تنفيذ البرنامج النشط البيئة (`CanRegisterNft`، `CanTransferNft`، `CanUnregisterNft`، و`CanModifyNftMetadata` في سطح الإذن الافتراضي). استخدم نطاقًا مخصصًا لتطبيقك أو احتفظ بهذا الدليل على الشبكة المحلية.

:::

بالنسبة إلى سير العمل المملوك للعقد، يتيح Kotodama استدعاءات مضيف NFT محددة الأنواع. وفيما يلي حالة اختبار دورة الحياة الدقيقة التي يجمعها وينفذها اختبار توثيق IVM المثبّت:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
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

إذا كان CLI يلف السجل في حاوية بيانات الإخراج، فافحص JSON مرة واحدة وطبق التأكيد على الكائن NFT المحتوى. الثوابت الموثوقة هي `id` و`owned_by` و`content`.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `name$domain` يمكن أن يعتمد على مساحة البيانات العالمية في بعض المحللات، ولكن يجب على معرفات الكتب التطبيقية والتطبيقات استخدام الشكل الصريح `name$domain.dataspace`.
- يتم رفض تسجيل متكرر لنفس معرف NFT. استخدم شبكة محلية جديدة أو اختر معرفًا جديدًا مستقرًا لسجل مختلف.
- يجب أن تكون بيانات التعريف المدخلة صالحة JSON على الإدخال القياسي. سلسلة القشرة بدون اقتباس JSON ليست قيمة بيانات تعريف.
- يتطلب التحويل الذي يوقعه حساب غير المالك الحالي إذنًا دقيقًا؛ تغيير `--from` لا يغير الموقّع التشفيري.
- بعد النقل، قد لا يُسمح للعميل الأصلي بعد الآن بتغيير أو إلغاء تسجيل NFT. استخدم الموقّع التشفيري للمالك الجديد أو المتحكم المفوض.
- Taira يمكن أن تُرجع مجموعة NFT فارغة. لا تعامل `items: []` كدليل على أن تعليمات NFT غير متاحة.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [NFT اختبارات التكامل عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT اختبارات استدعاء فني للمضيف عند نسخة رمز المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [أداة اختبار دورة الحياة الدقيقة Kotodama NFT عند إصدار الكود المصدري المثبت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ar/blockchain/nfts.md)
- [البيانات الوصفية](/ar/blockchain/metadata.md)
- [تعليمات](/ar/blockchain/instructions.md)
- [رموز الإذن](/ar/reference/permissions.md)
