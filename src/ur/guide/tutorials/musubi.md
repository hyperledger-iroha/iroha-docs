---
translation_locale: ur
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Musubi Kotodama پیکجوں {#musubi-kotodama-packages}

Musubi Kotodama سورس پیکجوں کے لئے پہلا ریلیز پیکیج مینیجر ہے۔ یہ ایک عین مطابق آن چین انحصار گراف کو حل کرتا ہے ، SoraFS کی تصدیق کرتا ہے۔ ماخذ آرکائیوز، منتخب کردہ کام کی جگہ کو مرتب اور جانچتا ہے، کینونیکل CAR آرکائیو بناتا ہے، اور Iroha کے ذریعے ناقابل تبدیلی ریلیز شائع کرتا ہے.

Musubi کا استعمال کریں جب آپ کی ضرورت ہو:

- دوبارہ استعمال ہونے والی Kotodama فنکشن لائبریریاں شائع کریں
- `Musubi.lock` میں ایک درست ٹرانزٹیو گراف پائن کریں
- حتمی شدہ SoraFS آرکائیو کی ذمہ داریوں سے انحصار کا ذریعہ دوبارہ بنائیں
- ایک پیکج یا کثیر پیکج ورک اسپیس بنائیں اور اس کا تجربہ کریں
- آن لائن رجسٹری کے ذریعے پیکجوں کا معائنہ، شائع کرنا، کھینچنا، برقرار رکھنا یا مستعار نام

## پیکجوں کے نام {#package-names}

کینونیکل پیکج سلیکٹرز استعمال کرتے ہیں:

```text
namespace/package
```

درست ریلیز کی شناخت کرنے والے ایک ورژن شامل کریں:

```text
namespace/package@version
```

ناموں کی جگہ سے پہلے کوئی لیڈ `@` نہیں ہے۔ ایک نام کی جگہ یا تو ڈیٹا اسپیس جڑ ہے جیسے `universal` یا ڈومین کے اہل ڈیٹا اسپیس جیسے `dex.universal`۔ لائیجر اس ساختی نام کی جگہ کو ایک مستحکم ہوم ڈیٹا اسپیس سے منسلک کرتا ہے جس پر پیکیج کا دعوی کیا جاسکتا ہے۔

## مینی فیسٹ اور لاک فائل {#manifest-and-lockfile}

پیکیج پہلی ریلیز کا مقررہ `Musubi.toml` اسکیما استعمال کرتا ہے۔ مینی فیسٹ کو `manifest-version = 1`، Kotodama edition `"1"` اور IVM ABI version `1` کا اعلان کرنا ہوگا؛ کوئی متبادل مینی فیسٹ یا ABI mode نہیں۔

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

انحصار درست ورژن ، دیکھ بھال یا ٹائلڈ کی ضروریات ، `1.*` جیسے وائلڈ کارڈز اور `>=1.0.0,<2.0.0` جیسے کوما سے الگ موازنہ سیٹ استعمال کرسکتے ہیں۔ انحصار ٹیبل کلید والدین مقامی درآمد کا مستعار ہے۔ `package` ہمیشہ کینونیکل رجسٹری سلیکٹر ہوتا ہے۔

`Musubi.lock` گراف کو بالکل جینیس سے اخذ شدہ `NetworkId` اور ایک حتمی رجسٹری اسنیپ شاٹ سے منسلک کرتا ہے۔ یہ منتخب کردہ ورک اسپیس جڑیں اور ناقابل تبدیل ریلیز نوڈس ریکارڈ کرتا ہے، ریلیز ، ماخذ ، انٹرفیس ، آرکائیو ، ABI ، اور عین مطابق انحصار کے کنارے کے وعدے شامل ہیں۔ جب حل شدہ گراف کی ضرورت ہوتی ہے تو متوازی ورژن کی اجازت دی جاتی ہے۔

## ترتیب دیں Taira SoraFS کھینچنا {#configure-taira-sorafs-fetching}

Taira اس کام کے بہاؤ کے لئے عوامی ٹیسٹ نیٹ ورک ہے. Taira کلائنٹ کی ترتیب جس میں چیک ان چین اور موجودہ پنڈت جینس سے ماخوذ نیٹ ورک کی شناخت ہے، پھر ذیل میں فراہم کنندہ کے مخصوص تصدیق شدہ وصولی پابندیاں شامل کریں۔ Taira ری سیٹ تبدیل کر سکتے ہیں `NetworkId`; اس کو مستحکم سلسلہ سے اخذ کرنے کے بجائے دستخط شدہ تعیناتی پروفائل سے تازہ کریں۔ UUID. اکاؤنٹ پر دستخط کرنے کا مواد اور فراہم کنندہ آپریٹر کی چابیاں صرف مالکان کے رن ٹائم فائلوں میں رہیں گی۔

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

پبلک ٹیسٹ نیٹ روٹ سے Taira کے منظور شدہ فراہم کنندگان کو دریافت کریں:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

فراہم کنندہ کیٹلاگ فراہم کرنے والے کی شناخت اور اشتہاری اختتامی پوائنٹس فراہم کرتا ہے۔ منتخب کردہ فراہم کنندہ سے مماثل آپریٹر کی اجازت حاصل کریں۔ رن ٹائم اس کلید کو محدود سلسلہ ٹوکن کے لئے درخواست کرنے کے لئے استعمال کرتا ہے۔ ٹوکن نہ تو CLI دلیلیں ہیں اور نہ ہی لاک فائل کا مواد۔

استعمال نہ کریں Taira تصدیق کنندہ پن URL کے طور `url`. چیک ان کی تصدیق کرنے والوں نے داخل کیا ہے SoraFS اسٹوریج غیر فعال ہے. `https://taira-validator-{1,2,3,4}.sora.org` اختتامی پوائنٹس پن رجسٹریشن قبول کرتے ہیں، جبکہ آرکائیو ریڈ منتخب کردہ منظور شدہ فراہم کنندہ کے استعمال کرتے ہیں. HTTPS اصل۔

## مقامی ورک فلو {#local-workflow}

بہاؤ Iroha کام کی جگہ جڑ سے، پیکج ڈائرکٹری بنائیں یا داخل کریں اور کارگو کے ذریعے Musubi چلائیں:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` حتمی رجسٹری گراف کو حل کرتا ہے ، اپ ڈیٹس `Musubi.lock` جب اجازت دی جاتی ہے، اور تصدیق شدہ سے ناقابل تبدیل مقامی کیش بھرتا ہے SoraFS مقامات. `check`, `build`, `test`, اور `package` اپنے کام سے پہلے ایک ہی گراف اور کیش چیک کریں.

کسی بھی لاک فائل کی تبدیلی کو مسترد کرنے کے لئے `--locked` کا استعمال کریں۔ صرف اس وقت `--offline` کا استعمال کریں جب رجسٹری انڈیکس اور ہر مطلوبہ آرکائیو دونوں پہلے ہی کیشڈ ہوں۔ `--frozen` ان دو پابندیوں کو یکجا کرتا ہے۔ ایک آف لائن کیشے ناکام ہوجاتا ہے۔ Musubi کبھی بھی غیر حل شدہ لاک فائل نہیں لکھتا ہے۔

انحصار کے ذرائع کو `math::add()` جیسے اہل کالوں کو تعیناتی داخلی Kotodama ناموں سے دوبارہ لکھ کر منسلک کیا جاتا ہے۔ ایک غیر برآمد شدہ فنکشن پر انحصار کی کال مسترد کردی جاتی ہے۔ درآمد شدہ لائبریریاں افعال کو بے نقاب کرتی ہیں۔ مقامی `[[contract]]` اور `[[test]]` اہداف واضح پیکیج کے اہداف رہتے ہیں۔

## کیش کی تصدیق اور مرمت {#cache-verification-and-repair}

عوامی کیش کمانڈز غیر تبدیل شدہ ، رجسٹری کے مصروف آرکائیوز پر کام کرتے ہیں:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` قرنطینہ قابل اعتماد اولاد کو خراب کرتا ہے اور حتمی فراہم کنندہ کے ثبوت کی اجازت دیتے وقت عین مطابق آرکائیو کو دوبارہ ترتیب دیتا ہے۔ زندہ غیر خالی تغیرات کے ل pruning جان بوجھ کر ناکامی سے بند کیا جاتا ہے۔ درجہ بندی شدہ امیدواروں کا معائنہ کرنے کے لئے `--dry-run` کا استعمال کریں۔

## پیکیجنگ اور اشاعت {#packaging-and-publishing}

آرکائیو لکھنے سے پہلے صاف مثبت فائل سیٹ کی جانچ پڑتال کریں، پھر کینونیکل پیکج بنائیں:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package`، `target/package/<namespace>-<name>-<version>.car` لکھتا ہے۔ CAR کینونیکل پیکیج مینی فیسٹ، معنوی ریلیز مینی فیسٹ، عین verification lock، ماخذ درخت، انٹرفیس digest اور SoraFS archive commitment کو باندھتا ہے۔ پہلی ریلیز کی CLI میں الگ `pack`، `--car-out`، `--sorafs-manifest-out` یا `--source-plan-out` کمانڈز نہیں ہیں۔

اشاعت ایک دستخط شدہ ، دوبارہ شروع کرنے والا نیٹ ورک ورک ورک فلو ہے۔ منتخب کردہ `client.toml` میں مطلوبہ `[musubi.publication]` پابندیاں کے ساتھ ساتھ اکاؤنٹ اور Taira نیٹ ورک کی ترتیب شامل ہونی چاہئے۔ پیکج بالکل ایک کام کی جگہ کا رکن:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

آپریشن جرنل اور seed-ingress حد کے پائیدار ہو جانے کے بعد واپس آنے کے لیے `--detach` استعمال کریں۔ کسی پائیدار آپریشن کو `publish --resume <operation-id> --config client.toml` کے ساتھ جاری رکھیں۔ زیادہ محدود `--recover <operation-id>` راستہ صرف ایک بے داغ، ingress سے پہلے کے جرنل کے لیے غائب ناقابلِ تبدیلی sidecars دوبارہ بناتا ہے۔ اشاعت کے لیے کوئی `--dry-run` یا عمومی عوامی upload fallback نہیں ہے؛ مقامی preflight کے لیے `package --list` اور `package` چلائیں۔

## رجسٹری استفسارات اور زندگی کا دورانیہ {#registry-queries-and-lifecycle}

ایک ہی Taira کلائنٹ ترتیب کے ساتھ حتمی رجسٹری کی تلاش اور جانچ پڑتال کریں:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

ینکنگ نئے ریزولوشنز سے ایک ناقابل تبدیل رہائی کو خارج کرتا ہے جبکہ موجودہ عین مطابق قفلیں دوبارہ پیش کی جاسکتی ہیں۔ پہلے موجودہ ینکنج نظر ثانی پڑھیں ، پھر موازنہ اور سیٹ تغیرات جمع کرو:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

اس حالت کو تبدیل کرنے کے لئے `unyank` کا استعمال کریں اسی پیکیج، ورژن، اور تازہ طور پر پڑھا نظر ثانی. پیکیج کی ملکیت اور برقرار رکھنے کے کردار کنٹرول شائع، yank، میٹا ڈیٹا، اور آرکائیو مقام کی اجازت۔ گلوبل عرفات میں اپنی قیمتوں پر رجسٹریشن، ری ٹارگٹ ہسٹری، اور موازنہ اور سیٹ revisions ہیں؛ وہ پیکج کے مالک کا شارٹ کٹ نہیں ہیں.

## Iroha سطحیں {#iroha-surfaces}

Musubi پہلی اشاعت V1 ہدایات اور استفسارات کا استعمال کرتا ہے:

|سطح |مقصد |
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |ایک نام کی جگہ کو اس کے مستحکم گھر ڈیٹا اسپیس سے منسلک کریں. |
|`RegisterMusubiArchiveV1` |ایک ناقابل تبدیل تصدیق شدہ ماخذ آرکائیو کی ذمہ داری درج کریں. |
|`AddMusubiArchiveLocationV1` |ایک ثابت شدہ SoraFS آرکائیو مقام شامل کریں یا تجدید کریں۔ |
|`PublishMusubiReleaseV1` |ایک پیکیج کا دعویٰ کریں یا اسے اپ ڈیٹ کریں اور ایک ناقابلِ تبدیلی ریلیز شائع کریں۔ |
|`SetMusubiReleaseYankV1` |ایک درست ریلیز کی کھینچی ہوئی حالت کا موازنہ کریں اور مقرر کریں۔|
|`InviteMusubiPackageMaintainerV1` |واضح پیکیج رول دعوت نامہ بہاؤ شروع کریں۔ |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |ایک منظم عالمی عرف کو رجسٹر کریں یا دوبارہ ہدف بنائیں۔ |
|`AssertMusubiReleaseDigestV1` |درست غیر متغیر ریلیز ڈائجسٹ کی تصدیق کریں. |
|`FindMusubiExactPackageV1` |ایک عین مطابق پیکیج اور اس کے ترمیم کو پڑھیں۔ |
|`FindMusubiExactReleaseV1` |ایک عین مطابق ریلیز اسنیپ شاٹ پڑھیں۔ |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |حتمی رہائی کے امیدواروں کو حل کریں یا فہرست بنائیں۔ |
|`FindMusubiArchiveLocationsV1` |حتمی فراہم کنندہ کی طرف سے حمایت شدہ آرکائیو مقامات کو پڑھیں. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |موجودہ عرف ہدف یا اس کی ناقابل تبدیل تاریخ کو پڑھیں. |

Torii ذیل میں ایپ روٹ فیملی کو بے نقاب کرتا ہے `/v1/musubi/*`. MCP آلات موجودہ استعمال کرتے ہیں `iroha.musubi.queries.*` اور `iroha.musubi.instructions.*` نام. دیکھیں [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md) اور [استفسار کا حوالہ](/ur/reference/queries.md) وسیع تر کے لئے API نقشہ.
