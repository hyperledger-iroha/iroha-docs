---
translation_locale: ar
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha التعليمات الخاصة {#iroha-special-instructions}

عندما تحدثنا عن [كيف Iroha تعمل](/ar/blockchain/iroha-explained), نحن
قال ذلك Iroha التعليمات الخاصة هي الطريقة الوحيدة لتغيير العالم
إذاً، ما نوع التعليمات الخاصة التي لدينا؟
الدليلات الخاصة باللغة في هذه المعلمة، لقد رأيتم بالفعل بعض
التعليمات: `Register<Account>` و `Mint<Numeric>`.

هنا قائمة كاملة Iroha التعليمات الخاصة:

| التعليمات                                               | وصف                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [التسجيل/إزالة التسجيل](#un-register)                       | أعطني ID إلى كيان جديد على بلوكتشين.    |
| [النعناع / الحرق](#mint-burn)                                   | الأصول العددية لـ"منت/برن" أو تكرارات التسبب. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | قم بتحديث البيانات الوصفية               |
| [SetParameter](#setparameter)                             | حدد معايير على امتداد السلسلة                      |
| [الإعانة/إلغاء](#grant-revoke)                             | إعطاء أو إزالة الإذن و الأدوار.            |
| [النقل](#transfer)                                     | تحويل ملكية أو قيمة الأصول               |
| [الاحتفاظ بالأموال والقفلات الأساسية](#native-escrow-and-asset-locks) | قفل الأصول الرقمية في الاحتفاظ بروتوكول.     |
| [ExecuteTrigger](#executetrigger)                         | أفعلي المحفزات                                |
| [السجل/الخصم/التحديث](#other-instructions)                 | تسجيل، تمديد، أو تحديث سلوك الوقت التشغيل.        |

دعونا نبدأ بموجب خلاصة Iroha الإرشادات الخاصة؛ ما هي الأشياء لكل منها
يمكن طلب التعليمات وما هي التعليمات المتاحة لكل
الموضوع.

## المختصرة {#summary}

لكل تعليمات، هناك قائمة من الأشياء التي على هذه التعليمات
يمكن تشغيلها على. على سبيل المثال، تغطي خيارات النقل كائنات رئيسية قابلة للسيطرة
و الأصول الرقمية، بينما تغطي التنقيب الأصول الرقميّة والإثارة
التكرار

بعض التعليمات تتطلب تحديد وجهة. على سبيل المثال، إذا
إذا قمت بنقل الأصول، يجب عليك دائماً تحديد الحساب الذي أنت عليه
من ناحية أخرى، عندما تقوم بتسجيل شيء
كل ما تحتاجه هو الكائن الذي تريد تسجيله

| التعليمات                                               | الأجسام                                                                                                 | الوجهة          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | النطاق العادي، مستعار مساحة البيانات، وتعداد مستعار الحساب                                                 |                      |
| [التسجيل/إزالة التسجيل](#un-register)                       | الحسابات، وصف الأصول NFTs, الأدوار، المحفزات، الأقران؛ إزالة النطاق                                |                      |
| [النعناع / الحرق](#mint-burn)                                   | الأصول الرقمية، تكرارات التسبب                                                                     | الحسابات أو المحفزات |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | الأشياء التي لديها [البيانات](./metadata.md): النطاقات والحسابات وصف الأصول NFTs, RWAs, المحفزات |                      |
| [SetParameter](#setparameter)                             | ملامح سلسلة                                                                                        |                      |
| [الإعانة/إلغاء](#grant-revoke)                             | [الأدوار، رموز الإذن](/ar/blockchain/permissions.md)                                                  | الحسابات أو الأدوار    |
| [النقل](#transfer)                                     | النطاقات، وصف الأصول، والأصول الرقمية NFTs                                                        | الحسابات             |
| [الاحتفاظ بالأموال والقفلات الأساسية](#native-escrow-and-asset-locks) | الاحتفاظ بالأصول الرقمية، قفل الأصول، التزامات الاحتفاض المجهولة                                    | المشترين أو الوجهات، أو الانقسام في النزاع |
| [ExecuteTrigger](#executetrigger)                         | المحفزات                                                                                                |                      |
| [السجل/الخصم/التحديث](#other-instructions)                 | السجلات، والحملات المفيدة الخاصة بالجهاز التنفيذي، وتحديثات الجوهر                                                     |                      |

هناك أيضا طريقة أخرى للنظر ISI, من حيث كائن الكتب الرئيسية
يلمسون:

| الهدف           | التعليمات                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| الحساب          | تسجيل الحسابات/إلغاء السجل، وصندوق الأصول، تحديث البيانات المعدنية للحساب، منح أو إلغاء الإذن ودورها    |
| النطاق           | ضمان إعداد النطاقات، إلغاء تسجيل النطاقين، نقل ملكية النطاق، تحديث البيانات المعدنية للنطاق                    |
| تعريف الأصول | تعريفات السجل/إغلاق السجل، ونقل الملكية، تحديث البيانات المعدنية                                         |
| الأصول            | الكمية الرقمية من النقود/الحرق، الكمية العددية للتحويل                                                        |
| الاحتفاظ           | فتح، قبول، علامة الدفع المرسل، الإفراج، إلغاء، النزاع، الحل، سحب، أو انتهاء السجلات الاحتفاظ الأصلية |
| NFT              | التسجيل/إزالة التسجيل NFTs, نقل الملكية، تحديث البيانات المعدنية                                                |
| RWA              | تسجيل الحصص، ونقل الكمية، الاحتفاظ/إفراج، التجميد/إفراز التجميد، استبدال، دمج، تحديث البيانات المعدنية والتحكم |
| محفز          | التسجيل/إزالة السجل، تكرارات محفز النقود/الحرق، تنفيذ المحفز، تحديث البيانات الأساسية للمحفز                 |
| العالم            | تسجيل/إزالة سجل الأقران والأدوار، تعيين المعايير، تحديث المنفذ                                    |

## CLI أمثلة {#cli-examples}

الأمثلة في هذه الصفحة تفترض أنك تقوم بتشغيل الأوامر من التيار أعلى
Iroha مساحة العمل مقابل تشكيل العميل المحلي الافتراضي:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

إذا قمت بتثبيت `iroha` ثنائي، استخدام
`iroha --config ./defaults/client.toml` بدلاً من ذلك، قم بإستبدال المحتفظين بالمكان
أدناه مع القيم من شبكتك:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

عند استهداف الجمهور Taira شبكة اختبار، استخدام Taira تكوين العميل.
قبل تشغيل أمثلة مدفوعة الرسوم، حفظ مساعدة المياه من
[احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
كما `taira_faucet_claim.py`, ثم تستحق الشبكة XOR من النوافذ:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

بعد أن يكون الأصول الممولة بالفخار مرئيًا، ضبط الأصول الغازية المطلوبة
البيانات الأساسية لتسجيل المعاملات:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` هو المسار العادي للإصدار الأول لإنشاء النطاقات
أفعالهم SNS الإيجارات. يربط إعلانياً المجال البياني الدقيق،
ويقوم بعد ذلك بإنشاء أو إصلاح كل الحالة المطلوبة عن طريق الذرية
استخدم المصادقة `POST /v1/aliases/setup/plan` نقطة النهاية أو التطابق
CLI سير العمل:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

النية والخطة خالية من السرية، ولكن تطبيق علامات الخطوة وتقديم
المعاملة العادية مع الحساب الذي تم تشكيله.
السلسلة والسلطة وركبة الدولة الحية، والموعد النهائي؛ لا تستخدم مرة أخرى على الآخر
الشبكة

## (دون) التسجيل {#un-register}

التسجيل والإفراج هو التعليمات المستخدمة لإعطاء ID إلى a
كيان جديد على بلوكتشين.

كل ما يمكن تسجيله هو كليهما `Registrable` و `Identifiable`,
لكن ليس كل ما هو `Identifiable` هو `Registrable`. معظم الأشياء هي
المسجلة مباشرة، ولكن في بعض الحالات تمثيل في blockchain
ولأسباب أمنية وأداء، نستخدم
البنّاء لهذه هيكل البيانات (مثل: `NewAccount`) و (مثل)
التسجيل لديه تعليمات خاصة لإثبات الامتلاك.
كل ما يمكن تسجيله يمكن أن يكون غير مسجل أيضاً، ولكن هذا ليس
قاعدة صعبة وسرعة

يمكنك تسجيل الحسابات، تعريف الأصول، NFTs, أقرانهم ودورهم
محفزات. استخدامات إعداد النطاق `EnsureAlias`; الخام `Register::Domain` الحمولة المفيدة
مخصصة لـ جنيس/bootstrap. استخدامات تسجيل الأقران
`RegisterPeerWithPop`, الذي يحمل دليل على حيازة مفتاح الأقران
[الإسمات للجمعات](/ar/reference/naming.md) للتعرف على القيود
وضع أسماء الكيانات.

RWA يتم إنشاء الكثير من خلال المخصصين `RegisterRwa` التعليم.
النموذج الحالي لا يعرض `UnregisterRwa` التعليم؛ الاستخدام
`RedeemRwa` للتقاعد الكمية الممثلة.

::: info

لاحظ أنه اعتمادا على الطريقة التي تقرر فيها إعداد
[حظر التكوين](/ar/guide/configure/genesis.md) في `genesis.json`
(على وجه التحديد ، سواء كنت تضم تسجيل الإذن أم لا)
يمكن أن تكون عملية تسجيل الحساب مختلفة جداً.
جنرال، يمكننا أن نختصر الأمر هكذا:

- في _العامة_ على بلوكتشين، أي شخص يجب أن يكون قادراً على تسجيل حساب.
- في _خاصة_ على بلوكتشين، يمكن أن يكون هناك عملية فريدة للتسجيل
  في حسابات _النموذجية_ بلوكتشين خاص، أي بلوكتشينه بدون
  أي عمليات فريدة لتسجيل الحسابات، تحتاج إلى حساب
  سجل حساب آخر

نناقش هذه الاختلافات بالتفصيل عندما
[مقارنة السلسلات الحكومية والخاصة](/ar/guide/configure/modes.md).

:::

::: info

تسجيل نسبة زميل هي حاليًا الطريقة الوحيدة لإضافة نسبة زميلة لم تكن
جزء من الأقران الموثوقين الأصليين على الشبكة

:::

Refer إلى إحدى الدليلات الخاصة باللغة لتسيرك خلال
عملية تسجيل الأشياء في سلسلة بلوكتشين:

| اللغة              | الدليل                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | استخدم [Iroha CLI](/ar/get-started/operate-iroha-via-cli.md) لإنشاء النطاقات وتسجيل الحسابات والأصول. |
| Rust                  | استخدم [Rust التعليمات](/ar/guide/tutorials/rust.md).                                                      |
| Kotlin/جاوا           | استخدم [Kotlin/ تعليمات جاوا](/ar/guide/tutorials/kotlin-java.md).                                        |
| Python                | استخدم [Python التعليمات](/ar/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | استخدم [JavaScript/TypeScript التعليمات](/ar/guide/tutorials/javascript.md).                               |

تخطيط وتطبيق إعداد النطاق العادي، ثم إلغاء تسجيل النطاق عندما لا
أطول حاجة:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

الحسابات المسجلة والمنسخة:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

تعريفات الأصول المسجلة والغير مسجلة:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

التسجيل وإزالة التسجيل NFTs. NFT التسجيل يقرأ محتواه JSON من
المدخل القياسي:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

أدوار التسجيل والإفراج عن التسجيل:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

تسجيل أو إزالة تسجيل المحفزات.
تم تجميعها IVM رمز البايت أو قائمة تعليمات تسلسلية. هذا المثال يبني
(أ) `Log` التعليم مع CLI ويقودها إلى تسجيل الزناد:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

تسجيل و إلغاء تسجيل الأقران BLS المفتاح و PoP مع `kagami`
إذا لم يكن لديك بالفعل:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## النعناع / الحرق {#mint-burn}

يمكن أن يشير القطع والحرق إلى الأصول الرقمية والتحفيزات مع محدودة
عدد التكرار. يمكن إعلان بعض الأصول بأنها غير قابلة للتنفيذ، أي
أنه لا يمكن صبها إلا مرة واحدة بعد التسجيل.

يتم صياغة الأصول إلى حساب معين، عادة ما يكون ذلك الذي سجل
الأصول في المقام الأول. كميات الأصول غير سلبية، لذلك يمكنك
لم يسبق لي `$-1.0` من الأصول أو حرق مبلغ سلبي والحصول على النقود.

إرجاع إلى أحد الدليلات الخاصة باللغة لتسيرك خلال
عملية تخزين الأصول في بلوكتشين:

- [CLI](/ar/get-started/operate-iroha-via-cli.md)
- [Rust](/ar/guide/tutorials/rust.md)
- [Kotlin/جاوا](/ar/guide/tutorials/kotlin-java.md)
- [Python](/ar/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ar/guide/tutorials/javascript.md)

وهنا أمثلة على حرق الأصول:

- [CLI](/ar/get-started/operate-iroha-via-cli.md)
- [Rust](/ar/guide/tutorials/rust.md)

الأصول العددية لـ"منت" و "برن":

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

تكرارات النقود والحرق:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## النقل {#transfer}

التحويلات تحويل الملكية أو القيمة بين الحسابات
تغطي المتغيرات المجالات وتعريفات الأصول والأصول الرقمية، NFTs. RWA
الحركة الكمية تستخدم المخصصة `TransferRwa` و `ForceTransferRwa`
التعليمات الموصوفة في [الأصول في العالم الحقيقي](/ar/blockchain/rwas.md).

لفعل ذلك، يجب منح الحساب
[الإذن بنقل الأصول](/ar/reference/permissions.md). إشارة إلى
مثال على كيفية نقل الأصول مع
[CLI](/ar/get-started/operate-iroha-via-cli.md) أو
[Rust](/ar/guide/tutorials/rust.md).

تحويل الأصول الرقمية:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

نطاق النقل، وصف الأصول، NFT الملكية:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## قفلات الاحتفاظ بالأموال المحلية {#native-escrow-and-asset-locks}

تعليمات الاحتفاظ بالأمانة الأصلية قفل الأصول الرقمية في بروتوكول إدارة الكتيب
الاحتفاظ. يستخدمون للتسوية على شكل السوق، الأصول العامة
القفلات، وتدفقات الاحتفاظ المتحمية المجهولة.

استخدامات الاحتفاظ بالبيانات في السوق `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, و `ResolveEscrowDispute`. استخدام قفل الأصول العامة
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, و
`ExpireAssetLock`. الاحتفاظ المجهول يعكس دورة حياة السوق مع
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, و
`ResolveAnonymousEscrowDispute`.

هذه ISIs ليس لديهم حالياً درجة أولى CLI الأوامر. استخدام المخطط SDK
البناء أو الحمولات المفيدة للتعليمات المتسلسلة، ورأى
[الاحتفاظ بالأصول الأصلية](/ar/blockchain/escrow.md) تفاصيل دورة الحياة،
الإذن والسؤال والأحداث، Rust أمثلة.

## الإعانة/إلغاء {#grant-revoke}

يتم استخدام تعليمات الإعفاء والإلغاء للحساب
[الإذن و الأدوار](permissions.md).

`Grant` تستخدم لمنح المستخدم إما إذن واحد بشكل دائم، أو
مجموعة من الإذنات (الدور). يمكن منح الأدوار والإذن فقط
يتم إزالتها عن طريق `Revoke` التعليمات، وبما أن هذه التعليمات يجب
يجب استخدامها بحذر

منح و إلغاء دور على حساب:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

إعطاء وإلغاء رموز الإذن
كائن من المدخل القياسي:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

منح وإلغاء الإذن على دور:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

هذه التعليمات تحديث الموضوع [البيانات](/ar/blockchain/metadata.md). الاستخدام
`SetKeyValue` لإدخال أو استبدال مدخل البيانات المعدنية، `RemoveKeyValue` إلى
إزالة واحدة

البيانات المتعددة `set` القوائم تقرأ JSON القيمة من المدخلات القياسية:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

نفس النمط متاح بالنسبة للحسابات، وصف الأصول، NFTs, RWAs,
و المسببات:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` تغييرات في المعايير على امتداد سلسلة الكشف عن البيانات النشطة
النموذج والفاعل

تعيين المعيار عن طريق تمرير معايير واحدة JSON الموضوع على المعيار
المدخل:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

هذه التعليمات تستخدم لتنفيذ [المحفزات](./triggers.md).

(الـ) CLI يمكن تسجيل محفزات وتسجيل أحداث تنفيذ المحفزة
مباشرة. لا توفر `execute trigger` القيادة ، لذلك إلى
تقديم دليل `ExecuteTrigger` التعليمات، إنشاء سلسلة
`InstructionBox` مع SDK أو أداة تنفيذية وتقديم النتيجة JSON
المجموعة من خلال `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## التعليمات الأخرى {#other-instructions}

Iroha كما يعرض تعليمات المستوى الأدنى للوقت التشغيل والتنفيذ
التكامل:

- `Log`: إصدار مدخل سجل أثناء التنفيذ
- `CustomInstruction`: تحميل مميز للمؤسسات التنفيذية JSON الحمولات المفيدة
- `Upgrade`: تنشيط تحديث التنفيذ

إرسال `Log` التعليمات مع مساعدة النقاش:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

إرسال تعليمات التنفيذية المخصصة كسلسلة `InstructionBox`. (الـ)
شكل الحمولة المفيدة هو محدد لجهاز التنفيذ، لذلك توليد التعليمات مع
التطابق SDK أو أدوات تنفيذية:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

قم بترقية المنفذ من مجموعة مرتبة IVM ملف رمز البايت:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
