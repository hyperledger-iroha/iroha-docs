---
translation_locale: ar
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT هو كائن رئيسي فريد مع صاحب واحد. استخدم NFTs عندما يحتاج سجل إلى هوية خاصة به، البيانات المعدنية، أحداث دورة الحياة، ونقل الملكية النطاقية، ولكن لا تحتاج إلى توازن عددي .

على عكس الأصول العددية [ ](/ar/blockchain/assets.md) ، لا تمتلك NFT دقة أو قابلية للتنقل أو كميات لكل حساب. يوجد NFT ككائن مسجل واحد ، ويتم تتبع الملكية مباشرة على هذا الكائن.

## الهيكل {#structure}

`Nft` المسجلة تحتوي على:

- `id`: و `NftId`
- `content`: البيانات الأساسية التي تصف NFT
- `owned_by`: الحساب الذي يملك NFT

الحقل `content` هو خريطة `Metadata`. احتفظ بها بصيغة صغيرة: تخزين الحقول الوصفية، والمراجع المستقرة، والهاشات، أو مسارات URIs، أو SoraFS هناك. تخزين الوثائق الكبيرة، وسائل الإعلام، أو حالة التطبيقات عالية المعدل خارج السلسلة وتحتفظ فقط بمراجعة قابلة للتحقق من ذلك على NFT .

## جربوا ذلك على Taira {#try-it-on-taira}

تحقق ما إذا كانت شبكة اختبار Taira العامة تمتلك حاليا سجلات NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

تحقق من وثيقة OpenAPI الحية لطرق NFT المعروضة عن طريق العقدة:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

صف فارغ `items` هو رد صالح على شبكة اختبار عامة. يعني أنه لا توجد NFTs في الصفحة الحالية، وليس أن تعليمات NFT غير متوفرة.

## NFT IDs {#nft-ids}

`NftId` يستخدم هذا النوع من النصوص:

```text
name$domain
name$domain.dataspace
```

على سبيل المثال `badge$docs.universal` يحدد `badge` NFT في `docs.universal` المجال. إذا تم حذف مساحة البيانات، فإن المحلل الحالي يستخدم `universal` مساحة البيانات، لذلك `badge$docs` يقرر أن `badge$docs.universal`.

استخدم أسماء ثابتة NFT IDs. (الـ) ID هو هوية الكائن المستخدمة من خلال التعليمات والسئلة والإذن ومصفحات الأحداث ومرجع التطبيق.

## دورة الحياة {#lifecycle}

NFT استخدام عمليات دورة الحياة Iroha تعليمات خاصة:

- [يخلق `Register`](/ar/blockchain/instructions.md#un-register) NFT مع البداية `content`.
- [يزيل `Unregister`](/ar/blockchain/instructions.md#un-register) NFT.
- [تغييرات `Transfer`](/ar/blockchain/instructions.md#transfer) `owned_by`.
- [`SetKeyValue` و`RemoveKeyValue` ](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue) تحديث البيانات المعدنية NFT.

## جربها محلياً {#try-it-locally}

تفترض هذه الأمثلة أنك قد أطلقت شبكة محلية ولديك إعداد العميل الذي تم إنشاؤه من دليل [CLI ](/ar/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

الشبكة المحلية التي تم إنشاؤها بالفعل `wonderland.universal` و هي SNS لإستخدام نطاق مختلف، قم بإنشائه أولاً مع الإعلانية `app alias setup plan` و `app alias setup apply` تدفق العمل الموصوف في: [المجالات](/ar/blockchain/domains.md#registration).

تسجيل NFT تسجيل يقرأ المحتوى الأولي JSON من المدخل القياسي:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

فحص NFT مباشرة ثم قم بإدراج كل NFTs مع الإدخالات الكاملة:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

إضافة مفتاح البيانات المتعددة وقراءة NFT مرة أخرى:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

إزالة مفتاح البيانات المتعددة:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

تحويل اخياريا NFT. الاستخدام `ledger nft get` ليقرأ المالك الحالي من `owned_by`, واستخدامها `ledger account list all` للعثور على حساب الوجهة ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

تنظيف عندما تنتهي. إذا قمت بنقل NFT ، قم بتشغيل هذه الأوامر مع إعداد حساب المالك الحالي أو نقل NFT مرة أخرى أولاً.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## الأسئلة والأحداث {#queries-and-events}

الاستخدام [`FindNfts`](/ar/reference/queries.md#assets-nfts-and-rwas) لإدراجها NFTs و [`FindNftsByAccountId`](/ar/reference/queries.md#assets-nfts-and-rwas) لإدراجها NFTs تملك حساباً

تنشر تحديثات تسجيل NFT وإزالة ونقل وبيانات البيانات المعدنية أحداث بيانات NFT. استخدم مرشح حدوث البيانات `Nft` عند الاشتراك في تغييرات دفتر التسجيل أو تشكيل محفزات تتفاعل مع أحداث دورة حياة NFT.

## الإذن {#permissions}

يحتوي سطح الإذن الافتراضي على رموز محددة ل NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

يتم تطبيق عمليات التحقق من السماح بواسطة مؤكد وقت التشغيل النشط ، بحيث يمكن للشبكة تخصيص الإذن عن طريق تحديث المنفذ. انظر [رموز السماح](/ar/reference/permissions.md) لقائمة الرموز الافتراضية الحالية .

## اختيار NFTs {#choosing-nfts}

استخدم NFT للمسجلات التي تتعلق بالفريدة من نوعها والملكية:

- الشهادات والشعارات والترخيصات وشهادات
- سجلات العضوية أو الوصول
- سجلات الطلبات المرتبطة بالهوية أو المملوكة للحساب
- إشارات إلى وسائل الإعلام أو الوثائق أو المخططات خارج السلسلة

استخدم الأصول الرقمية لموازين قابلة للتلاعب، واستخدم البيانات المعدنية [ ](/ar/blockchain/metadata.md) عندما تكون البيانات مجرد صفة صغيرة من كائن الكتيب القائم.

انظر أيضاً:

- [الأصول](/ar/blockchain/assets.md)
- [البيانات الأساسية](/ar/blockchain/metadata.md)
- [التعليمات](/ar/blockchain/instructions.md)
- [الأسئلة ](/ar/blockchain/queries.md)
