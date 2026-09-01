---
translation_locale: ar
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha عمليات التعليمات {#iroha-special-instructions}

عندما تحدثنا عن [كيف يعمل Iroha](/ar/blockchain/iroha-explained)، قلنا أن عمليات تعليمات Iroha هي الطريقة الوحيدة لتعديل حالة العالم. إذن، ما نوع التعليمات ما العمليات التي لدينا؟ إذا كنت قد قرأت الأدلة الخاصة باللغة في هذا الدرس، فقد شاهدت بالفعل بعض التعليمات: `Register<Account>` و `Mint<Numeric>`.

إليك القائمة الكاملة لعمليات التعليمات Iroha:

|تعليمات|الأوصاف|
| --------------------------------------------------------- | ------------------------------------------------ |
| [تسجيل/إلغاء التسجيل](#un-register)                       |قم بإعطاء معرف لكيان جديد على البلوكشين.|
| [Mint/Burn](#mint-burn) |صك/احرق الأصول الرقمية أو أطلق التكرارات.|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |تحديث بيانات وصف الكائن في البلوك تشين.|
|[SetParameter](#setparameter)|اضبط معلمة على مستوى السلسلة.|
| [Grant/Revoke](#grant-revoke)                             |امنح أو أزل الأذونات والأدوار.|
| [نقل](#transfer)                                     |نقل الملكية أو قيمة الأصول.|
| [الحساب الضامن الأصلي وقفل الأصول](#native-escrow-and-asset-locks) |قفل الأصول الرقمية في عهدة البروتوكول.|
| [التسوية الخاصة الذرية](#atomic-private-settlement) | إدارة التجمعات السرية والحزم الذرية. |
| [ExecuteTrigger](#executetrigger)                         |تنفيذ المشغلات.|
| [Log/Custom/Upgrade](#other-instructions)                 |تسجيل أو توسيع أو ترقية سلوك بيئة تنفيذ البرنامج.|

لنبدأ بملخص لعمليات تعليمات Iroha؛ ما هي الكائنات التي يمكن استدعاء كل تعليم لها وما هي التعليمات المتاحة لكل كائن.

## ملخص {#summary}

لكل تعليمات، هناك قائمة من الكائنات التي يمكن تشغيل هذه التعليمات عليها. على سبيل المثال، تغطي تحويل المتغيرات كائنات دفتر الأستاذ القابلة للملكية والأصول الرقمية، بينما تغطي الإصدار الأصول الرقمية وتكرار المحفزات.

بعض التعليمات تتطلب تحديد وجهة. على سبيل المثال، إذا قمت بتحويل أصول، فأنت دائمًا بحاجة إلى تحديد الحساب الذي تنقل إليه هذه الأصول. من ناحية أخرى، عندما تقوم بتسجيل شيء ما، كل ما تحتاجه هو الشيء الذي تريد تسجيله.

|تعليمات|الأشياء|وجهة|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |إعداد النطاق العادي، واسم مستعار لمجال البيانات، واسم مستعار للحساب|                      |
|[تسجيل/إلغاء التسجيل](#un-register)|الحسابات، تعريفات الأصول، NFTs، الأدوار، المشغلات، نظراء الشبكة؛ إزالة النطاق|                      |
| [Mint/Burn](#mint-burn) |الأصول الرقمية، تكرار المحفزات|حسابات أو محفزات|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |الكائنات التي تحتوي على [البيانات الوصفية](./metadata.md): النطاقات، الحسابات، تعريفات الأصول، NFTs، RWAs، المشغلات|                      |
|[SetParameter](#setparameter)|معلمات السلسلة|                      |
| [Grant/Revoke](#grant-revoke)                             | [الأدوار، رموز الصلاحيات](/ar/blockchain/permissions.md)                                                  |الحسابات أو الأدوار|
|[نقل](#transfer)|النطاقات، تعريفات الأصول، الأصول الرقمية، NFTs|الحسابات|
| [الحساب الضامن الأصلي وقفل الأصول](#native-escrow-and-asset-locks) |الضمانات الرقمية للأصول، تأمين الأصول، قيم الالتزام التشفيري للضمانات المجهولة|المشترون، الوجهات، أو تقسيمات النزاعات|
|[تسوية المعاملات المالية الخاصة الذرية](#atomic-private-settlement)|مجموعات بيانات البروتوكول السرية محدودة النطاق، تدوير السياسات، الحزم النهائية، وعلامات الإيقاف|                      |
| [ExecuteTrigger](#executetrigger)                         |المحفزات|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |السجلات، الحمولات الخاصة بالمُنَفِّذ، ترقيات المُنفِّذ|                      |

هناك طريقة أخرى للنظر في ISI، من حيث كائن دفتر الأستاذ البلوكتشين الذي يتعاملون معه:

|هدف|التعليمات|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|الحساب|تسجيل/إلغاء تسجيل الحسابات، استلام الأصول، تحديث بيانات الحساب، منح/سحب الأذونات والأدوار|
|النطاق|ضمان إعداد النطاق، إلغاء تسجيل النطاقات، نقل ملكية النطاق، تحديث بيانات النطاق|
|تعريف الأصل|تسجيل/إلغاء تسجيل التعريفات، نقل الملكية، تحديث بيانات التعريف|
|أصل|سك/حرق كمية رقمية، تحويل كمية رقمية|
|حساب الضمان|فتح، قبول، تعليم دفع المبلغ المرسل، إصدار، إلغاء، نزاع، حل، سحب، أو انتهاء صلاحية سجلات الحفظ الأصلية|
|NFT|تسجيل/إلغاء تسجيل NFTs، نقل الملكية، تحديث البيانات الوصفية|
|RWA|تسجيل الحصص، نقل الكمية، الحجز/الإفراج، التجميد/إلغاء التجميد، استرداد، الدمج، تحديث البيانات الوصفية والتحكمات|
|زناد|تسجيل/إلغاء التسجيل، تكرار محفز الصك/الحرق، تنفيذ المحفز، تحديث بيانات محفز|
|العالم|تسجيل/إلغاء تسجيل نظائر الشبكة والأدوار، ضبط المعلمات، ترقية المنفذ|

## CLI أمثلة {#cli-examples}

تفترض الأمثلة في هذه الصفحة أنك تقوم بتشغيل الأوامر من مساحة العمل المزودة أعلاه Iroha مقابل تكوين العميل المحلي الافتراضي:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

إذا قمت بتثبيت النسخة الثنائية `iroha`، استخدم `iroha --config ./defaults/client.toml` بدلاً منها. استبدل العناصر النائبة أدناه بالقيم من شبكتك:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

عند استهداف شبكة الاختبار العامة Taira، استخدم تكوين عميل Taira. قبل تشغيل الأمثلة التي تتطلب دفع رسوم، احفظ مساعد خدمة تمويل شبكة الاختبار من [احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، ثم اطلب XOR من شبكة الاختبار من خدمة تمويل شبكة الاختبار:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

بعد ظهور الأصل المموّل من خدمة الاختبار، أرفق بعمليات الكتابة بيانات تعريف أصل رسوم التنفيذ المطلوبة:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` هو المسار العادي للإصدار الأول لإنشاء النطاقات وعقود الإيجار الخاصة بها SNS. إنه يربط بشكل إعلاني مساحة البيانات الدقيقة، المالك، مدة الإيجار، وحارس التحقق من الرسوم والسعر، ثم ينشئ أو يصلح جميع الحالات المطلوبة بشكل ذري. استخدم نقطة النهاية المصادقة `POST /v1/aliases/setup/plan` API أو سير العمل المطابق CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

النوايا والخطة خالية من السرية، ولكن خطوة التطبيق تقوم بتوقيع وإرسال معاملة عادية باستخدام الحساب المُكوَّن. ترتبط الخطة بسلسلتها، والجهة المخولة، والمرساة في الحالة الحية، والموعد النهائي؛ لا تستخدم واحدة على شبكة أخرى.

## (إلغاء) التسجيل {#un-register}

التسجيل وإلغاء التسجيل هما التعليمات المستخدمة لمنح معرف لكيان جديد على البلوكشين.

كل شيء يمكن تسجيله هو كل من `Registrable` و`Identifiable`، ولكن ليس كل شيء `Identifiable` هو `Registrable`. يتم تسجيل معظم الأشياء مباشرة، ولكن في بعض الحالات يكون التمثيل في البلوكشين يحتوي على بيانات أكثر بكثير. لأسباب تتعلق بالأمان والأداء، نستخدم البناة لمثل هذه الهياكل البيانية (على سبيل المثال `NewAccount`)، ولتسجيل النظراء على الشبكة يوجد تعليمات مخصصة لإثبات الملكية. كقاعدة عامة، كل ما يمكن تسجيله يمكن أيضًا إلغاء تسجيله، لكن هذه ليست قاعدة صارمة.

يمكنك تسجيل الحسابات، تعريفات الأصول، NFTs، نظراء الشبكة، الأدوار، والمحفزات. يستخدم إعداد النطاق `EnsureAlias`؛ وحمولة `Register::Domain` الخام محجوزة لـ تستخدم تسجيل نظير الشبكة في التمهيد/النشأة `RegisterPeerWithPop`، الذي يحمل دليلاً على حيازة مفتاح نظير الشبكة. تحقق من [اتفاقيات التسمية](/ar/reference/naming.md) لمعرفة القيود المفروضة على أسماء الكيانات.

RWA يتم إنشاء الحصص من خلال التعليمات المخصصة `RegisterRwa`. الكود الحالي لا يكشف عن تعليمات `UnregisterRwa`؛ استخدم `RedeemRwa` لإلغاء تمثيل الكمية.

::: info

لاحظ أنه اعتمادًا على كيفية اتخاذك قرار إعداد [كتلة النشأة في البلوكشين](/ar/guide/configure/genesis.md) في `genesis.json` (وبشكل خاص، سواء قررت تضمين تسجيل رموز الإذن أم لا)، يمكن أن تكون عملية تسجيل حساب مختلفة جدًا. بشكل عام، يمكننا تلخيصها على النحو التالي:

- في البلوكشين العام، يجب أن يكون أي شخص قادراً على تسجيل حساب.
- في البلوكتشين الخاص، يمكن أن يكون هناك عملية فريدة لتسجيل الحسابات. في بلوكتشين خاص نموذجي، أي بلوكتشين بدون أي عمليات فريدة لتسجيل الحسابات، تحتاج إلى حساب لتسجيل حساب آخر.

نحن نناقش هذه الاختلافات بالتفصيل الكبير عندما [قارن بين سلاسل الكتل الخاصة والعامة](/ar/guide/configure/modes.md).

:::

::: info

تسجيل نظير الشبكة هو حاليًا الطريقة الوحيدة لإضافة نظراء الشبكة الذين لم يكونوا جزءًا من مجموعة نظراء الشبكة الموثوق بهم الأصلية إلى الشبكة.

:::

استخدم دليلًا محددًا للغة لتسجيل كائنات البلوك تشين:

|اللغة|دليل|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |استخدم [Iroha CLI](/ar/get-started/operate-iroha-via-cli.md) لإعداد النطاقات وتسجيل الحسابات والأصول.|
| Rust                  |استخدم [Rust درس تعليمي](/ar/guide/tutorials/rust.md).|
| Kotlin/جافا           |استخدم [Kotlin/Java](/ar/guide/tutorials/kotlin-java.md).|
| Python                |استخدم [Python درس تعليمي](/ar/guide/tutorials/python.md).|
| JavaScript/TypeScript |استخدم [JavaScript/TypeScript](/ar/guide/tutorials/javascript.md).|

قم بتخطيط وتطبيق إعداد المجال العادي، ثم قم بإلغاء تسجيل المجال عندما لا يكون هناك حاجة إليه:

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

تسجيل وإلغاء تسجيل الحسابات:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

تسجيل وإلغاء تسجيل تعريفات الأصول:

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

تسجيل وإلغاء تسجيل NFTs. يقرأ تسجيل NFT محتواه JSON من الإدخال القياسي:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

تسجيل وإلغاء تسجيل الأدوار:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

تسجيل وإلغاء تسجيل المشغلات. يحتاج تسجيل المشغل إما إلى الشيفرة البايتية IVM المترجمة أو قائمة تعليمات مسلسلة. يبني هذا المثال تعليمات `Log` باستخدام CLI ويقوم بتمريرها إلى تسجيل المشغل:

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

سجّل وألغِ تسجيل نظراء الشبكة. قم بإنشاء المفتاح BLS و PoP مع `kagami` إذا لم تكن لديك بالفعل:

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

## سك/حرق {#mint-burn}

يمكن أن يشير الإصدار والتدمير إلى الأصول الرقمية والمحركات مع عدد محدود من التكرارات. يمكن إعلان بعض الأصول على أنها غير قابلة للطباعة، مما يعني أنه يمكن إصدارها مرة واحدة فقط بعد التسجيل.

يتم إصدار الأصول لحساب محدد، عادةً الحساب الذي سجل الأصل في المقام الأول. كميات الأصول غير سالبة، لذا لا يمكنك أبدًا أن تمتلك `$-1.0` من أصل ما أو تدمير كمية سالبة والحصول على إصدار.

استخدم دليلًا محددًا للغة لإصدار أصول البلوك تشين:

- [CLI](/ar/get-started/operate-iroha-via-cli.md)
- [Rust](/ar/guide/tutorials/rust.md)
- [Kotlin/Java](/ar/guide/tutorials/kotlin-java.md)
- [Python](/ar/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ar/guide/tutorials/javascript.md)

إليك أمثلة على تدمير الأصول:

- [CLI](/ar/get-started/operate-iroha-via-cli.md)
- [Rust](/ar/guide/tutorials/rust.md)

إصدار وتدمير الأصول الرقمية:

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

إصدار وتدمير تكرارات الزناد:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## نقل {#transfer}

النقل ينقل الملكية أو القيمة بين الحسابات. تغطي متغيرات النقل العامة المجالات، تعريفات الأصول، الأصول الرقمية، و NFTs. يستخدم تحريك كمية RWA التعليمات المخصصة `TransferRwa` و`ForceTransferRwa` الموضحة في [الأصول الواقعية](/ar/blockchain/rwas.md).

للقيام بذلك، يجب منح الحساب [إذن لنقل الأصول](/ar/reference/permissions.md). راجع مثالاً حول كيفية نقل الأصول باستخدام [CLI](/ar/get-started/operate-iroha-via-cli.md) أو [Rust](/ar/guide/tutorials/rust.md).

نقل الأصول الرقمية:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

نقل ملكية النطاق والأصل وتحديد الملكية NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## الضمان الأصلي وقفل الأصول {#native-escrow-and-asset-locks}

تعليمات الضمان الأصلية تقفل الأصول الرقمية التي يديرها بروتوكول دفتر الأستاذ على البلوكشين. تُستخدم لتسوية المعاملات المالية على نمط السوق، وقفل الأصول العامة، وتدفقات الضمان المحمية المجهولة.

يستخدم الضمان في السوق `OpenAssetEscrow`، `AcceptAssetEscrow`، `MarkEscrowPaymentSent`، `ReleaseAssetEscrow`، `CancelAssetEscrow`، `OpenEscrowDispute`، و`ResolveEscrowDispute`. تستخدم الأقفال العامة للأصول `OpenAssetLock`، `DrawdownAssetLock` `CancelAssetLock` و `ExpireAssetLock`. يعكس الضمان المجهول دورة حياة السوق مع `OpenAnonymousAssetEscrow` و `AcceptAnonymousAssetEscrow` و `MarkAnonymousEscrowPaymentSent` و `ReleaseAnonymousAssetEscrow` و `CancelAnonymousAssetEscrow` و `OpenAnonymousEscrowDispute` و `ResolveAnonymousEscrowDispute`.

هذه ISIs لا تمتلك حاليًا أوامر CLI من الدرجة الأولى. استخدم منشئي SDK بالنمط المطبوع أو حمولات التعليمات التسلسلية، وانظر إلى [ضمان الأصل الأصلي](/ar/blockchain/escrow.md) لتفاصيل دورة الحياة، الأذونات، الاستفسارات، الأحداث، و Rust الأمثلة.

## تسوية المعاملات المالية الخاصة الذرية {#atomic-private-settlement}

تُعتبر عائلة التعليمات الخاصة بتسوية الذرات المُدارة منفصلة عن Native الشفاف AMX. يقوم `ActivatePrivateSettlementPoolV1` بإنشاء مجموعة بيانات بروتوكول سرية محدودة النطاق للطريق من توقع الحوكمة المحجوب وقيم الالتزام التشفيري الأصلية للبروتوكول الواحد. يقوم `FinalizeAtomicPrivateSettlementV1` بتطبيق حزمة واحدة كاملة مصدقة من قبل اللجنة بشكل ذري، بينما يقوم `AbortAtomicPrivateSettlementV1` بنشر فقط علامة المحطة العامة المصرح بها من قبل الراعي.

`RotatePrivateSettlementPoolPolicyV1` مقيد بحوكمة الخصوصية. يتطلب القيمة الدقيقة الحالية لهضم التشفير الخاص بالحوكمة، ويحافظ على المسار، ومجموعة بيانات البروتوكول، وقيمة الالتزام التشفيري المرتبطة بالأصول، والحدود الحالة، ومجموعات الإعادة، وسجلات نتائج البروتوكول النهائية. يُقدّم المراجعة العامة بمقدار واحد، ويستخدم فترة مفتاح مدقق أحدث. يتم تفعيل التدوير عند ارتفاع إدراجه ولا يمكن أن يشارك هذا الارتفاع مع سجل نتيجة البروتوكول لنفس المسار/المجمع. يحافظ خط النسخ العام على سجلات نتائج البروتوكول النهائية قبل إعادة تشغيل التدوير - صالحة ومطابقة لإعادة التشغيل بشكل متسق؛ تفشل حزَم السياسات القديمة الجارية مغلقة. يجب على المشغلين الاحتفاظ بمفاتيح فك التشفير القديمة للكبسولات المخزنة أو إدارة وإختبار إعادة تغليف الكبسولة قبل تدميرها.

يظل المسار معطلاً بشكل افتراضي وليس مؤهلاً للإنتاج. راجع [تشغيل تسوية المعاملات المالية الخاصة عبر المساحات البيانية الذرية](/ar/get-started/atomic-private-settlement) لمتطلبات التهيئة، ومبدأ التفويض، والتدقيق، والاسترداد، والإصدار.

## منح/سحب {#grant-revoke}

تُستخدم تعليمات المنح والإلغاء للحساب [الأذونات والأدوار](permissions.md).

`Grant` يُستخدم لمنح المستخدم بشكل دائم إما إذنًا واحدًا، أو مجموعة من الأذونات ("دور"). لا يمكن إزالة الأذونات والأدوار الممنوحة إلا عبر تعليمات `Revoke`. وبالتالي، يجب استخدام هذه التعليمات بحذر.

منح وسحب دور على حساب:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

منح وسحب رموز الإذن. تقوم أوامر الإذن بقراءة كائن الإذن من الإدخال القياسي:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

منح وإلغاء الأذونات على دور:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

تقوم هذه التعليمات بتحديث الكائن [البيانات الوصفية](/ar/blockchain/metadata.md). استخدم `SetKeyValue` لإدراج أو استبدال إدخال بيانات وصفية و`RemoveKeyValue` لحذف إدخال.

أوامر البيانات الوصفية `set` تقرأ القيمة JSON من الإدخال القياسي:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

النمط نفسه متاح للحسابات، تعريفات الأصول، NFTs، RWAs، والمحركات:

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

`SetParameter` يغيّر المعلمات عبر السلسلة التي يكشف عنها نموذج البيانات النشط والمنفذ.

قم بتعيين معلمة بتمرير كائن معلمة واحد JSON عبر الإدخال القياسي:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

يُستخدم هذا التعليمات لتنفيذ [المحفزات](./triggers.md).

يمكن لـ CLI تسجيل المحفزات والاشتراك في أحداث تنفيذ المحفز مباشرةً. لا يوفر أمر `execute trigger` مكتوب النوع، لذا لتقديم تعليمات الدليل `ExecuteTrigger`، توليد `InstructionBox` مسلسل باستخدام أداة SDK أو منفذ وتنفيذ تمرير مصفوفة JSON الناتجة عبر `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## تعليمات أخرى {#other-instructions}

Iroha يكشف أيضًا عن التعليمات منخفضة المستوى لبيئة تنفيذ البرامج وتكامل المنفذ:

- `Log`: إصدار إدخال سجل أثناء التنفيذ
- `CustomInstruction`: حمل حمولات JSON الخاصة بمنفذ التنفيذ
- `Upgrade`: تفعيل ترقية المنفذ

قدّم تعليمات `Log` باستخدام مساعد البينغ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

قم بإرسال تعليمات منفذ مخصص كـ `InstructionBox` مسلسلة. شكل الحمولة محدد حسب المنفذ، لذا قم بإنشاء التعليمات باستخدام SDK المتوافق أو أدوات المنفذ:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

قم بترقية المنفذ من ملف البايت كود المترجم IVM:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
