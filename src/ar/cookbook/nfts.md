---
translation_locale: ar
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## النتيجة {#outcome}

تحقق من حالة Taira NFT ، ثم سجل وتحديث ونقل ومطالبة NFT فريدة على شبكة محلية تم إنشاؤها. يستخدم تدفق العمل صاحب `name$domain.dataspace` مؤهل بالكامل NFT ID و I105 القنوني IDs.

## الشروط المسبقة {#prerequisites}

- `curl` ، `jq`، Python 3.11 أو أحدث، والتيار `iroha` CLI.
- إمكانية الوصول إلى Taira فقط.
- بالنسبة للكتب، يتم إنشاء شبكة محلية من [إطلاق Iroha](/ar/get-started/launch-iroha.md)، مع `./localnet/client.toml` و Torii على `http://127.0.0.1:8080`.

## الخطوات {#steps}

### 1 - التفتيش على المجموعة العامة Taira {#_1-inspect-the-public-taira-collection}

صفحة فارغة هي قراءة ناجحة: يعني أنه لا يوجد NFTs مرئي في الصفحة المطلوبة.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs هي سجلات فريدة من نوعها، وليس رصيدات رقمية. لديهم ID، صاحب واحد، وخريطة مكونة من البيانات المعدنية `content` .

### إعداد المالك المحلي IDs {#_2-prepare-local-owner-ids}

يستخدم مثال الكتابة نطاق `wonderland.universal` المسجل. استخرج السلطة الموضحة دون الكشف عن مفتاحها الخاص ، ثم اختر حسابًا مسجلًا آخر كمنطقة النقل.

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

(الـ) `$` المفصل ينتمي إلى NFT النموذج النصي. احتفظ بالملء `wonderland.universal` إضافية المجال ومساحة البيانات

### 3- تسجيل NFT مع المحتوى الأولي {#_3-register-the-nft-with-initial-content}

يقرأ CLI الكائن الأولي JSON من المدخل القياسي. يصبح السلطة الحالية صاحبها.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. تحديث خريطة المحتوى {#_4-update-the-content-map}

قيم البيانات الأساسية هي JSON. إدخال مفتاح أو استبدال هذا الإدراج الواحد؛ فإنه لا يحل محل سجل NFT بأكمله.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5 - نقل الملكية {#_5-transfer-ownership}

توفير كل من الحساب القنوني I105 IDs. يجب حل الاسم قبل استخدامه باسم `--from` أو `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning حدود الإذن

على Taira, كل كتابة تحتاج أيضا `--metadata ./taira.tx-metadata.json` ومدفوع رسوم صريحة. يتم التحقق من تسجيل، ونقل، وإزالة، وتحديث البيانات المعدنية عن طريق الوقت النشط للعمل (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, و `CanModifyNftMetadata` في سطح الإذن الافتراضي). استخدم نطاقًا مخصصًا للتطبيق الخاص بك أو حافظ على هذا المشي عبر localnet.

:::

بالنسبة لتدفقات العمل المملوكة للعقود، يعرض Kotodama المكالمات المستضيفة NFT التي يتم تطبيقها. ما يلي هو إطار دورة الحياة الدقيقة التي تم تجميعها وتنفيذها بواسطة اختبار الوثائق IVM:

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

الإثنان ثابتة I105 القيم هي أجهزة الاختبار مقدمة التدفق؛ ويتسجل الحبال الوجهة قبل تنفيذها. `CURRENT_OWNER` و `NEW_OWNER` من CLI للحصول على عقد التطبيق، توفير الحسابات الكانونية الفعلية لها، ثم تجميع واختبار، نشر، ودعوة من خلال [العقود الذكية](./smart-contracts.md). لا تقوم بإرسال رمز البايت غير المراجعة إلى Taira, وتذكر أن تنفيذ العقد لا يزال يتجاوز تفويض وقت التشغيل.

## التحقق {#verify}

قراءة NFT مباشرة وتأكيد أن صاحبها قد تغير بينما ظل محتوياتها مرفقة:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

إذا كان CLI يلف السجل في غطاء خروجي، فحص JSON مرة واحدة وتطبيق الادعاء على NFT المادة السليمة هي `id`, `owned_by`, و `content`.

## حل المشاكل {#troubleshooting}

- `name$domain` يمكن أن تكون مساحة البيانات العالمية بشكل افتراضي في بعض المستخدمين، ولكن يجب على كتاب الطهي والتطبيق IDs استخدام نموذج صريح `name$domain.dataspace`.
- تسجيل متكرر من نفس NFT ID يتم رفضها. استخدم شبكة محلية جديدة أو اختر شبكة جديدة مستقرة ID " للكتاب المبين " .
- يجب أن تكون مدخلات البيانات المعدنية صالحة JSON على المدخلات القياسية. لا تعتبر سلسلة الغلاف دون إشارة إلى JSON قيمة بيانات المعدلة.
- يحتاج التحويل الذي تم توقيعه من قبل حساب آخر غير صاحب الحساب الحالي إلى إذن دقيق؛ تغيير `--from` لا يغير الموقّع.
- بعد النقل، قد لا يسمح للعميل الأصلي بتغيير NFT أو إلغاء تسجيلها. استخدم توقيع المالك الجديد أو مراقب مصرح به.
- Taira يمكن إرجاع مجموعة فارغة NFT لا تعتبر `items: []` كدليل على عدم توافر تعليمات NFT.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [اختبارات الاندماج NFT في المشاركة المحمولة ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT اختبارات المكالمة المضيفة في الالتزام المتعلق ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [بالضبط Kotodama NFT نظام دورة حياة في الالتزام المثبت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ar/blockchain/nfts.md)
- [البيانات الأساسية](/ar/blockchain/metadata.md)
- [التعليمات](/ar/blockchain/instructions.md)
- [رموز الإذن ](/ar/reference/permissions.md)
