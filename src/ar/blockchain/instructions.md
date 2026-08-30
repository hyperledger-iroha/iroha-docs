---
translation_locale: ar
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Iroha تعليمات خاصة {#iroha-special-instructions}

عندما تحدثنا عن [كيف Iroha تعمل](/ar/blockchain/iroha-explained), لقد قلنا ذلك Iroha التعليمات الخاصة هي الطريقة الوحيدة لتغيير الدولة العالمية. أي نوع من التعليمات الخاصة لدينا؟ إذا قرأت الدليل المحدد للغة في هذه الدروسية، لقد رأيتِ بالفعل بعض التعليمات `Register<Account>` و `Mint<Numeric>`.

هذه هي القائمة الكاملة لإرشادات خاصة Iroha:

|التعليمات |وصف |
| --------------------------------------------------------- | ------------------------------------------------ |
| [التسجيل/إزالة التسجيل ](#un-register) |إعطاء ID إلى كيان جديد على بلوكتشين.|
| [النعناع / الحرق ](#mint-burn) |الأصول الرقمية من النقود / الحرق أو تسبب التكرار. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |قم بتحديث البيانات الوصفية. |
| [SetParameter](#setparameter) |حدد معايير على امتداد السلسلة |
| [الإعانة/الإلغاء](#grant-revoke) |إعطاء أو إزالة الإذن والأدوار. |
| [النقل ](#transfer) |نقل ملكية أو قيمة الأصول. |
| [حفلات الاحتفاظ بالأموال الأصلية ](#native-escrow-and-asset-locks) |قفل الأصول الرقمية في حجز البروتوكول.|
| [التسوية الخاصة الذرية](#atomic-private-settlement) | تحكم المجمّعات السرية والحزم الذرية. |
| [ExecuteTrigger](#executetrigger) |إنفاذ محفزات.|
| [التسجيل/التخصيص / التحديث ](#other-instructions) |سجل، تمديد، أو تحديث سلوك الوقت التشغيل. |

دعونا نبدأ بموجب ملخص Iroha التعليمات الخاصة؛ ما هي الأشياء التي يمكن استدعاء كل تعليمة وما هي التعليمات المتاحة لكل جسم.

## خلاصة {#summary}

لكل تعليمة ، هناك قائمة بالأشياء التي يمكن تشغيل هذه التعليمات عليها. على سبيل المثال ، تغطي خيارات النقل أشياء دفتر التسجيل الممتلك والأصول الرقمية ، في حين تغطي القطع الأرقامية وأثارة التكرارات.

بعض الإرشادات تتطلب تحديد الوجهة. على سبيل المثال، إذا قمت بنقل الأصول، تحتاج دائمًا إلى تحديد الحساب الذي تقوم بنقلها إليه. من ناحية أخرى، عندما تسجل شيئاً ما، كل ما تحتاجه هو الكائن الذي تريد تسجيله.

|التعليمات |الأجسام|الوجهة |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |النطاق العادي، مستعار مساحة البيانات، وتعيين حساب |                      |
| [التسجيل/إزالة التسجيل ](#un-register) |الحسابات، تعريف الأصول، NFTs، الأدوار، المحفزات، الأقران، إزالة النطاق |                      |
| [النعناع / الحرق ](#mint-burn) |الأصول الرقمية، تثبيت التكرار |حسابات أو محفزات |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |الأشياء التي تحتوي على [بيانات أساسية ](./metadata.md): النطاقات، الحسابات، تعريف الأصول، NFTs، RWAs، محفزات |                      |
| [SetParameter](#setparameter) |ملامح سلسلة |                      |
| [الإعانة/الإلغاء](#grant-revoke) | [الأدوار، رموز الإذن](/ar/blockchain/permissions.md) |الحسابات أو الأدوار |
| [النقل ](#transfer) |النطاقات، تعريف الأصول، الأصول الرقمية NFTs |الحسابات |
| [حفلات الاحتفاظ بالأموال الأصلية ](#native-escrow-and-asset-locks) |الاحتفاظ بالأصول الرقمية، قفل الأصول، التزامات الاحتفاض المجهولة |المشترين أو الوجهات، أو الانقسام في النزاع|
| [التسوية الخاصة الذرية](#atomic-private-settlement) | مجمّعات سرية محددة بالمسار، وتدوير السياسات، وحزم منتهية، وعلامات إلغاء | |
| [ExecuteTrigger](#executetrigger) |المحفزات |                      |
| [التسجيل/التخصيص / التحديث ](#other-instructions) |السجلات، الحملات المفيدة الخاصة بالجهاز التنفيذي، تحديثات الجهاز التنفسي |                      |

هناك أيضا طريقة أخرى للنظر في ISI ، من حيث كائن الكتيب الذي يلمسونه:

|الهدف|التعليمات |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|الحساب |تسجيل / إلغاء تسجيل الحسابات ، وتلقي الأصول ، تحديث البيانات المعدنية للحسابات ، منح أو إلغاء الإذن ودورها |
|النطاق |تأمين إعداد النطاقات، إلغاء تسجيل النطاقين، نقل ملكية النطاق، تحديث البيانات الوصفية للنطاق |
|تعريف الأصول |تعريفات السجل/إفراج السجل، ونقل الملكية، تحديث البيانات النسبية |
|الأصول|الكمية الرقمية من النعناع/الحرق، والكمية العددية من التحويل |
|الاحتفاظ |فتح، قبول، علامة الدفع المرسل، الإفراج، إلغاء، النزاع، الحل، سحب، أو انتهاء السجلات الاحتفاظ الأصلية |
|NFT |التسجيل/إزالة التسجيل NFTs ، ونقل الملكية، تحديث البيانات الوصفية |
|RWA |تسجيل المكونات، وتحويل الكمية، والاحتفاظ/الإفراج، والتجميد/إفراز التجميد، والاستبدال، والاندماج، وتحديث البيانات الأساسية والسيطرة |
|المحفز|تسجيل/إلغاء التسجيل، تكرار محفز النقود/الحرق، تنفيذ المحفز، تحديث البيانات الأساسية المحفزة |
|العالم |تسجيل/إزالة سجل الأقران والأدوار، تعيين المعايير، تحديث المنفذ |

## CLI مثال {#cli-examples}

تفترض الأمثلة الموجودة في هذه الصفحة أنك تقوم بتشغيل أوامر من مساحة العمل Iroha المتقدمة مقابل تشكيل العميل المحلي الافتراضي:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

إذا قمت بتثبيت `iroha` الثنائي، استخدم `iroha --config ./defaults/client.toml` بدلاً من ذلك. استبدل أصحاب المواقع أدناه بقيم من شبكتك:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

عند استهداف الجمهور Taira شبكة اختبار، استخدام Taira تكوين العميل. قبل تشغيل أمثلة مدفوعة الرسوم ، حفظ مساعدة المياه من [احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) كما `taira_faucet_claim.py`, ثم تستحق الشبكة XOR من الصنبور:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

بعد أن يكون الأصول الممولة بالفخار مرئيًا، ضعي البيانات الوصفية المطلوبة للأصول الغازية للكتابة للمعاملات:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` هو مسار الإصدار الأول العادي لإنشاء النطاقات و SNS إنه يربط بإعلان المجال البيئي الدقيق، والمالك، وشروط الإيجار، ووقاية الاقتباسات، ثم تقوم بإنشاء أو إصلاح كل الحالة المطلوبة عن طريق الذرية. `POST /v1/aliases/setup/plan` النقطة النهائية أو التطابق CLI سير العمل:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

النية والخطة خالية من الأسرار، ولكن تطبيق علامات الخطوة وتقديم معاملة عادية مع الحساب الذي تم تشكيله. الخطة مرتبطة بالسلاسل والسلطة ورابط الدولة الحية والموعد النهائي؛ لا تستخدم مرة أخرى على شبكة أخرى.

## (Un) التسجيل {#un-register}

التسجيل وعدم التسجيل هو التعليمات المستخدمة لتقديم ID لجهة جديدة على بلوكتشين.

كل ما يمكن تسجيله هو كليهما `Registrable` و `Identifiable`, لكن ليس كل ما هو `Identifiable` هو `Registrable`. يتم تسجيل معظم الأشياء مباشرة، ولكن في بعض الحالات تمثيل في بلوكتشين يحتوي على بيانات أكثر بكثير. لأسباب أمنية وأداء، نحن نستخدم البنّاء لهذه الهياكل البيانية (مثل: `NewAccount` ، وتحتوي تسجيل الأقران على تعليمات خاصة لإثبات الملكية. كقاعدة عامة، كل ما يمكن تسجيله يمكن أن يكون غير مسجل أيضاً، ولكن هذه ليست قاعدة صعبة وسريعة.

يمكنك تسجيل الحسابات، وصف الأصول، NFTs, أقرانهم، الأدوار، والتحفيزات. `EnsureAlias`; الخام `Register::Domain` الحمولة المفيدة مخصصة لجنيس/bootstrap. استخدام تسجيل الأقران `RegisterPeerWithPop`, الذي يحمل دليل على حيازة مفتاح الأقران [تسمية المؤتمرات](/ar/reference/naming.md) للتعرف على القيود المفروضة على أسماء الكيانات.

يتم إنشاء قطاعات RWA من خلال تعليمات `RegisterRwa` المخصصة. لا يعرض الرمز الحالي تعليمات `UnregisterRwa`؛ استخدم `RedeemRwa` للتخفيض من الكمية الممثلة.

::: info

لاحظ أنه اعتمادا على الطريقة التي تقرر فيها إعداد [حظر التكوين](/ar/guide/configure/genesis.md) في `genesis.json` (على وجه التحديد، سواء كنت تشمل تسجيل رموز الإذن أم لا) ، يمكن أن تكون عملية تسجيل الحساب مختلفة جداً. بشكل عام، يمكننا تلخيصها على هذا النحو:

- في بلوكتشين عام، أي شخص يجب أن يكون قادراً على تسجيل حساب.
- في بلوكتشين خاصة، يمكن أن يكون هناك عملية فريدة لتسجيل الحسابات. في بلوكتشيين خاصة نموذجية، أي بلوكشين بدون أي عمليات فريدة للتسجيل للحسابات، تحتاج إلى حساب لتسجيل حساب آخر.

نناقش هذه الاختلافات بالتفصيل الكبير عندما [مقارنة السلسلات الحكومية والخاصة](/ar/guide/configure/modes.md).

:::

::: info

تسجيل الزملاء هو حاليًا الطريقة الوحيدة لإضافة الزملاء الذين لم يكونوا جزءًا من الزملاء الموثوقين الأصليين في الشبكة.

:::

استخدم دليل محدد لغة لتسجيل كائنات بلوكتشين:

|اللغة |دليل |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |استخدم [Iroha CLI](/ar/get-started/operate-iroha-via-cli.md) لإنشاء النطاقات والتسجيل الحسابات والأصول. |
|Rust |استخدم [Rust التعليمية ](/ar/guide/tutorials/rust.md). |
|Kotlin/جاوا |استخدم [Kotlin/Java tutorial](/ar/guide/tutorials/kotlin-java.md). |
|Python |استخدم [Python التعليمية ](/ar/guide/tutorials/python.md). |
|JavaScript/TypeScript |استخدم [JavaScript/TypeScript التعليمية ](/ar/guide/tutorials/javascript.md). |

تخطيط وتطبيق إعدادات النطاق العادي ، ثم إلغاء تسجيل النطاق عندما لا يكون مطلوبًا بعد الآن:

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

تسجيل وإزالة التسجيل NFTs. تقرأ تسجيل NFT محتوياتها JSON من المدخل القياسي:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

أدوار التسجيل والفصل عن التسجيل:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

تسجيل و إلغاء تسجيل المحفزات. يحتاج تسجيل محفز إما إلى تم تجميع IVM رمز البايت أو قائمة تعليمات متسلسلة. هذا المثال يبني تعليمة `Log` مع CLI ويجريها في تسجيل المحفيض:

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

قم بتسجيل و إلغاء تسجيل الأقران. توليد مفتاح BLS و PoP مع `kagami` إذا لم يكن لديكما بالفعل:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## النعناع / الحرق {#mint-burn}

يمكن أن يشير النقش والحرق إلى الأصول الرقمية وتسبب عدد محدود من التكرارات. يمكن إعلان بعض الأصول بأنها غير قابلة للنقش، مما يعني أنها لا يمكن نقشها مرة واحدة فقط بعد التسجيل.

يتم صياغة الأصول إلى حساب معين ، عادة ما تكون تلك التي سجلت الأصل في المقام الأول. تعد كميات الأصول غير سلبية ، لذلك لا يمكنك أبدًا امتلاك `$-1.0` من الأصل أو حرق مبلغ سلبي والحصول على صياغة.

استخدم دليل محدد للغة لأصول بلوكتشين النقود:

- [CLI](/ar/get-started/operate-iroha-via-cli.md)
- [Rust](/ar/guide/tutorials/rust.md)
- [Kotlin/جاوا](/ar/guide/tutorials/kotlin-java.md)
- [Python](/ar/guide/tutorials/python.md)
- [JavaScript/TypeScript ](/ar/guide/tutorials/javascript.md)

وهنا أمثلة على حرق الأصول:

- [CLI](/ar/get-started/operate-iroha-via-cli.md)
- [Rust](/ar/guide/tutorials/rust.md)

الأصول الرقمية لـ "منت" و "برن":

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

تكرارات النعناع والحرق:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## النقل {#transfer}

التحويلات تنتقل الملكية أو القيمة بين الحسابات. تغطي المتغيرات العامة للتحويل مجالات، وصف الأصول، والأصول الرقمية، و NFTs. RWA الحركة الكمية تستخدم المخصصة `TransferRwa` و `ForceTransferRwa` التعليمات الموصوفة في: [الأصول في العالم الحقيقي](/ar/blockchain/rwas.md).

للقيام بذلك، يجب منح حساب [إذن لنقل الأصول ](/ar/reference/permissions.md). راجع إلى مثال حول كيفية نقل الأصول مع [CLI](/ar/get-started/operate-iroha-via-cli.md) أو [Rust](/ar/guide/tutorials/rust.md).

تحويل الأصول الرقمية:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

نطاق النقل، وصف الأصول، وملكية NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## مقفلات الاحتفاظ بالأصول {#native-escrow-and-asset-locks}

إرشادات الاحتفاظ الأصلية تقفل الأصول الرقمية في حجز البروتوكول الذي يتم إدارته في دفتر التسجيل. تستخدم للتسوية على النمط السوقي، وقفل الأصول العامة، وتدفقات الاحتفال المحمي المجهول.

استخدامات الاحتفاظ بالأمانة في السوق `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, و `ResolveEscrowDispute`. استخدام قفلات الأصول العامة `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, و `ExpireAssetLock`. الأمانة المجهولة تعكس دورة حياة السوق مع `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, و `ResolveAnonymousEscrowDispute`.

هذه ISIs لا تحتوي حاليًا على أوامر CLI من الدرجة الأولى. استخدم بناءات SDK المطبوعة أو تحميلات التعليمات المتسلسلة ، وشاهد [ الأصول الطبيعية التأمين](/ar/blockchain/escrow.md) للحصول على تفاصيل دورة الحياة والإجازات والاستفسارات والأحداث ومثلة Rust.

## التسوية الخاصة الذرية {#atomic-private-settlement}

تعليمات التسوية الخاصة الذرية الخاضعة للحوكمة منفصلة عن Native AMX الشفافة. ينشئ `ActivatePrivateSettlementPoolV1` مجمّعًا سريًا واحدًا `pool` لمسار محدد بدقة من إسقاط حوكمة منقح والتزامات منشأ معيارية. يطبّق `FinalizeAtomicPrivateSettlementV1` ذريًا حزمة كاملة مصدقًا عليها من جميع لجان المشاركين. ولا ينشر `AbortAtomicPrivateSettlementV1` سوى علامة النهاية العامة التي أجازها الراعي.

لا يجوز إلا لحوكمة الخصوصية تنفيذ `RotatePrivateSettlementPoolPolicyV1`. تتطلب التعليمة ملخص الحوكمة الحالي المطابق؛ وتحفظ المسار و`pool` والتزام ربط الأصل وحد الحالة ومجموعات منع إعادة التنفيذ والإيصالات المنتهية، ثم تزيد المراجعة العامة بمقدار واحد وتستخدم حقبة أحدث لمفتاح المدقق. يُفعّل التدوير عند ارتفاع الإدراج، ولا يجوز إنهاء إيصال للمسار و`pool` نفسيهما عند ذلك الارتفاع. يحافظ تسلسل المراجعات العامة على صلاحية الإيصالات المنتهية قبل التدوير بعد إعادة التشغيل، ويجعل إعادة الإيصال المطابق خاملة. تفشل الحزم الجارية وفق السياسة القديمة بصورة مغلقة قبل أي تغيير للحالة. ويجب على المشغلين الاحتفاظ بمفاتيح فك التشفير القديمة، أو إخضاع إعادة تغليف الكبسولات للحوكمة واختبارها قبل إتلاف المفاتيح.

هذا المسار معطل افتراضيًا وغير مؤهل للاستخدام الإنتاجي. راجع [تشغيل تسوية خاصة ذرية بين مساحات البيانات](/get-started/atomic-private-settlement) لمعرفة متطلبات الإعداد والصلاحيات والتدقيق والاسترداد والإصدار.

## المنحة/إلغاء {#grant-revoke}

يتم استخدام إرشادات منح وإلغاء الائتمان لترخيصات الحساب [ ودورات ](permissions.md).

يستخدم `Grant` لمنح مستخدم دائم إما إذن واحد، أو مجموعة من الإذنات (الدور). يمكن إزالة الأدوار والإجازات الممنوحة فقط عن طريق تعليمات `Revoke`. وبالتالي ، يجب استخدام هذه التعليمات بعناية.

منح أو إلغاء دور على حساب:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

إعطاء وإلغاء رموز الإذن. أوامر الإذن تقرأ كائن الإذن من المدخل القياسي:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

إعطاء وإلغاء الإذن على دور:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

هذه التعليمات تحديث الكائن [ البيانات المعدنية](/ar/blockchain/metadata.md). استخدم `SetKeyValue` لإدخال أو استبدال مدخل للبيانات المقدمة و `RemoveKeyValue` لحذف واحد.

تفويضات البيانات الأساسية `set` تقرأ قيمة JSON من المدخل القياسي:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

يتوفر نفس النمط للحسابات وتعريفات الأصول، NFTs، RWAs، والتحفيزات:

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

`SetParameter` تغير المعايير في جميع أنحاء السلسلة التي يعرضها نموذج البيانات النشطة والمنفذ.

تحديد المعيار عن طريق تمرير عبارة معايير واحدة JSON على المدخل القياسي:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

يتم استخدام هذه التعليمات لتنفيذ محفزات [ ](./triggers.md).

CLI يمكن تسجيل المحفزات والاشتراك في أحداث تنفيذ المحفزة مباشرة. فإنه لا يوفر أمرًا مكتوبًا `execute trigger` ، لذلك لتقديم تعليمات يدوية `ExecuteTrigger`، إنشاء صف `InstructionBox` المتسلسل مع أداة SDK أو جهاز تنفيذ وإرسال الترتيب الناتج من JSON عبر `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## التعليمات الأخرى {#other-instructions}

Iroha يعرض أيضًا تعليمات المستوى الأدنى للوصول إلى وقت التشغيل والتكامل مع المنفذ:

- `Log`: إصدار مدخل سجل أثناء التنفيذ.
- `CustomInstruction`: تحميل حمولات مفيدة خاصة بالجهاز التنفيذي JSON
- `Upgrade`: تنشيط تحديث المنفذ

قم بإرسال تعليمات `Log` مع مساعدة البينغ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

قم بإرسال تعليمات التنفيذية المخصصة كسلسلة `InstructionBox`. شكل الحمولة الفائدة هو محدد لتنفيذ، لذلك توليد التعليمات مع مطابقة SDK أو أدوات تنفيذ:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

قم بتحديث المنفذ من ملف IVM رمز البايت مرتب:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
