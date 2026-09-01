---
translation_locale: ar
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

يعد Iroha NFT كائن دفتر أستاذ فريد في سلسلة الكتل له مالك واحد. استخدم NFTs عندما يحتاج السجل إلى هويته الخاصة وبيانات التعريف الخاصة به وأحداث دورة الحياة وخصائص نقل الملكية، ولكنه لا يحتاج إلى رصيد رقمي.

على عكس [أصل](/ar/blockchain/assets.md) الرقمي، فإن NFT ليس له دقة، أو سياسة إصدار الأصول، أو كميات لكل حساب. يوجد NFT ككائن مسجل واحد، ويتم تتبع الملكية مباشرة على هذا الكائن.

## هيكل {#structure}

يحتوي `Nft` المسجل على:

- `id`: an `NftId`
- `content`: بيانات وصفية تصف NFT
- `owned_by`: الحساب الذي يملك NFT

حقل `content` هو خريطة `Metadata`. اجعله مضغوطًا: خزّن الحقول الوصفية، المراجع المستقرة، التجزئات التشفيرية، URIs، أو مسارات SoraFS هناك. خزّن المستندات الكبيرة، الوسائط، أو حالة التطبيق عالية التغير خارج السلسلة واحتفظ فقط بالإشارة القابلة للتحقق على NFT.

## جرّبه على Taira {#try-it-on-taira}

تحقق مما إذا كان لدى شبكة الاختبار العامة Taira حاليًا سجلات NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

تحقق من المستند المباشر OpenAPI للمسارات NFT المكشوفة بواسطة العقدة:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

مصفوفة `items` فارغة هي استجابة صالحة على شبكة اختبار عامة. هذا يعني أنه لا توجد NFTs في الصفحة الحالية، وليس أن تعليمات NFT غير متوفرة.

## NFT هويات {#nft-ids}

`NftId` يستخدم هذا النموذج النصي:

```text
name$domain
name$domain.dataspace
```

على سبيل المثال، `badge$docs.universal` يحدد `badge` NFT في مجال `docs.universal`. إذا تم حذف مساحة البيانات، يستخدم المحلل الحالي مساحة البيانات `universal`، لذلك `badge$docs` يتحول إلى `badge$docs.universal`.

استخدم أسماء ثابتة لمعرفات NFT. المعرف هو هوية الكائن المستخدمة من قبل التعليمات والاستعلامات والأذونات ومرشحات الأحداث ومراجع التطبيقات.

## دورة الحياة {#lifecycle}

NFT عمليات دورة الحياة تستخدم Iroha عمليات التعليمات:

- [`Register`](/ar/blockchain/instructions.md#un-register) يخلق NFT مع الحرف الأول `content`.
- [`Unregister`](/ar/blockchain/instructions.md#un-register) يزيل الـ NFT.
- [`Transfer`](/ar/blockchain/instructions.md#transfer) تغييرات `owned_by`.
- [`SetKeyValue` و `RemoveKeyValue`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue) تحديث NFT البيانات الوصفية.

## جربه محليًا {#try-it-locally}

تفترض هذه الأمثلة أنك قد أطلقت شبكة محلية ولديك تكوين العميل الذي تم إنشاؤه من [CLI دليل](/ar/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

يقوم الشبكة المحلية المولدة بالفعل بإعداد `wonderland.universal` وعقدها SNS. لاستخدام نطاق مختلف، قم بإنشائه أولاً باستخدام `app alias setup plan` و`app alias setup apply` التوضيحيين كما هو موضح في [النطاقات](/ar/blockchain/domains.md#registration).

سجّل NFT. تقوم عملية التسجيل بقراءة المحتوى الأولي JSON من الإدخال القياسي:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

افحص الـ NFT مباشرة ثم قم بإدراج جميع الـ NFTs مع الإدخالات الكاملة:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

أضف مفتاح بيانات وصفية واقرأ NFT مرة أخرى:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

أزل مفتاح البيانات الوصفية:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

يمكنك نقل NFT اختياريًا. استخدم `ledger nft get` لقراءة المالك الحالي من `owned_by`، واستخدم `ledger account list all` للعثور على معرف حساب الوجهة.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

قم بإزالة المثال NFT بعد الإرشادات. إذا قمت بنقله، إما أن تعيده مرة أخرى أو تقدم أمر إلغاء التسجيل باستخدام إعدادات حساب المالك الحالي.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## الاستفسارات والفعاليات {#queries-and-events}

استخدم [`FindNfts`](/ar/reference/queries.md#assets-nfts-and-rwas) قائمة NFTs و [`FindNftsByAccountId`](/ar/reference/queries.md#assets-nfts-and-rwas) قائمة NFTs مملوك من قبل حساب.

NFT إصدار التسجيل والحذف والنقل وتحديثات البيانات الوصفية NFT أحداث البيانات. استخدم `Nft` تصفية أحداث البيانات عند الاشتراك في تغييرات دفتر الأستاذ في البلوكشين أو عند إنشاء محفزات تستجيب لـ NFT أحداث دورة الحياة.

## الأذونات {#permissions}

تتضمن واجهة الإذن الافتراضية الرموز المحددة بـ NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

تتم فرض فحوصات الأذونات بواسطة مدقق وقت التشغيل البرمجي النشط، لذلك يمكن للشبكة تخصيص التفويض عن طريق ترقية المنفذ. انظر [رموز الإذن](/ar/reference/permissions.md) لقائمة الرموز الافتراضية الحالية.

## اختيار NFTs {#choosing-nfts}

استخدم NFT للسجلات حيث تكون الخصوصية والملكية مهمة:

- الشهادات، الأوسمة، التراخيص، والإقرارات
- سجلات العضوية أو الوصول
- سجلات التطبيقات المرتبطة بالهوية أو المملوكة للحساب
- الإشارات إلى الوسائط أو الوثائق أو المراسيم التقنية خارج السلسلة

استخدم أصلًا رقميًا للأرصدة القابلة للاستبدال، واستخدم [البيانات الوصفية](/ar/blockchain/metadata.md) العادي عندما تكون البيانات مجرد سمة مضغوطة لكائن دفتر الأستاذ البلوكتشين الموجود.

انظر أيضًا:

- [الأصول](/ar/blockchain/assets.md)
- [البيانات الوصفية](/ar/blockchain/metadata.md)
- [تعليمات](/ar/blockchain/instructions.md)
- [استفسارات](/ar/blockchain/queries.md)
