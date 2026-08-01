---
translation_locale: ur
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama پیکجوں {#musubi-kotodama-packages}

Musubi Kotodama سورس پیکجوں کے لئے پیکیج مینیجر ہے۔ یہ ڈویلپرز کو ایک کارگو کی طرح ورک فلو فراہم کرتا ہے تاکہ وہ Kotodama افعال کا اشتراک کرسکیں جبکہ پیکیج کی شناخت کو عالمی سطح پر پہلے آنے والے نام ٹیبل کے بجائے SORA اور Iroha ناموں سے منسلک کیا جاسکے۔

Musubi کا استعمال کریں جب آپ کی ضرورت ہو:

- دوبارہ استعمال ہونے والی Kotodama ماخذ لائبریریاں شائع کریں۔
- `Musubi.lock` میں عین مطابق منتقلی کے ذریعہ انحصار
- تصدیق شدہ SoraFS آرکائیو کی ذمہ داریوں سے انحصار کا ذریعہ دوبارہ بنائیں۔
- ایک ہی نام کی جگہ میں dapp معاہدہ عرفات کے لئے پیکجوں کے نام کی جگہ مربوط کریں
- آن لائن رجسٹری کے ذریعے پیکجوں کا معائنہ، شائع کرنا، ٹریک کرنا، یا عرفان دینا

## پیکجوں کے نام {#package-names}

کینیکل پیکج آئی ڈی کا استعمال:

```text
namespace/package
```

درست ریلیز حوالہ جات کا استعمال:

```text
namespace/package@version
```

کسی نام کی جگہ سے پہلے کوئی اہم `@` نہیں ہے۔ `@` جداکار ورژن کے ضمیمہ کے لئے مخصوص ہے۔

ناموں کی جگہ کا سیگمنٹ Kotodama dapp معاہدے کے مستعار میں استعمال ہونے والے ضمیمہ سے ملتا ہے:

|پیکیج کی شناخت |متعلقہ معاہدے کا عرفی شکل |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

نام خالی جگہوں میں یا تو `<dataspace>` یا `<domain>.<dataspace>` فارم ہوتا ہے۔ جب کسی پیکیج میں ڈی اے پی پی لنک ہوتا ہے تو ، Musubi چیک کرتا ہے کہ ہر منسلک معاہدے کا مستعار پیکیج کے ساتھ ایک ہی نام خالی ضمیمہ استعمال کرتا ہے.

## ظاہر {#manifest}

ایک پیکج `Musubi.toml` سے شروع ہوتا ہے:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

انحصار درست ورژن، دیکھ بھال کے تقاضے، ٹائلڈ کی ضروریات، وائلڈ کارڈز جیسے `1.*` یا موازنہ فہرستوں جیسے `>=1.0.0,<2.0.0` استعمال کرسکتے ہیں.

`Musubi.lock` منتخب شدہ منتقلی گراف کو آن چین رجسٹری سے ریکارڈ کرتا ہے۔ ہر مقفل شدہ نوڈ اپنا کینیکل پیکیج ریف ، منتخب ضرورت ، SoraFS manifest digest ، ماخذ آرکائیو ہیش ، بائٹ گنتی ، فائل گنتی ، برآمد شدہ افعال ، تعیناتی ذریعہ آرکائیوز پلان ، اور انحصار کے عرفات کو اسٹور کرتا ہے۔ قفل فائل میں داخل ہونے سے پہلے مختصر ناموں کو حل کیا جاتا ہے.

## مقامی ورک فلو {#local-workflow}

بہاؤ Iroha کام کی جگہ جڑ سے، Cargo کے ذریعے Musubi چلائیں:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

`install --offline` کا استعمال کسی نوڈ سے استفسار کیے بغیر درست ورژن کی انحصار کے لئے غیر حل شدہ لاک فائل لکھنے کے لئے کریں۔ CI میں ایک پرانی لاک فائل کو مسترد کرنے کے لیے `install --locked` کا استعمال کریں.

`build` کیشڈ انحصار کے ذرائع کو `math::add()` جیسے کالز کو تعیناتی اندرونی Kotodama فنکشن ناموں سے دوبارہ لکھ کر منسلک کرتا ہے۔ یہ ان افعال پر کالز کو مسترد کرتا ہے جن پر انحصار برآمد نہیں کیا گیا تھا۔ Musubi v1 لائبریریاں صرف فنکشن ہیں: انحصار کے ذرائع جن میں ریاستی اعلامیے ، ٹرگرز ، کوٹوبا بلاکس ، مستقل یا دیگر غیر فنکشن معاہدے کی اشیاء شامل ہیں وہ مسترد کردیئے جاتے ہیں۔

## ماخذ آرکائیو حاصل کرنا {#fetching-source-archives}

Musubi کیش کے ذیلی حکموں کے ذریعے یا بعد میں حل کرتے وقت لاپتہ انحصار ذرائع کو حاصل کر سکتا ہے:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

براہ راست گیٹ وے وصول کرنے کے لئے ایک یا زیادہ SoraFS گیٹ وائی فراہم کنندہ کی وضاحتیں استعمال ہوتی ہیں۔

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

فراہم کنندہ کی پائل لوڈ فائلیں اور گیٹ وے فراہم کرنے والے ایک دوسرے کو نکالنے کے آپریشن کے لئے الگ تھلگ ہیں۔ اگر ایک سے زیادہ لاک شدہ پیکج غائب ہے تو ، ہر گیٹ وائی فراہم کنندہ کو `package=<dependency-alias>` ، `package=<namespace/package@version>` ، `package=<namespace/package>` ، یا `manifest=<64-hex SoraFS manifest digest>` کے ساتھ دائرہ کار کریں۔

گیٹ وے `base-url` اور `privacy-url` اقدار کو استعمال کرنا ضروری ہے `https://` ڈیفالٹ کے طور پر. مقامی ٹیسٹ گیٹ ویز استعمال کر سکتے ہیں `http://localhost`, `http://127.0.0.1`, یا `http://[::1]` صرف `--gateway-allow-insecure-localhost`. سٹریم ٹوکن رن ٹائم اسناد ہیں اور ان میں نہیں لکھا جاتا ہے `Musubi.lock`.

## اشاعت {#publishing}

`pack` deterministic حساب کرتا ہے BLAKE3-256 ماخذ آرکائیو ہیش پلس ماخذ بائٹ اور فائل گنتی. جب `--car-out`, `--sorafs-manifest-out`, یا `--source-plan-out` فراہم کیا جاتا ہے، یہ بھی تعیناتی کی تعمیر SoraFS CAR مفید بوجھ، SoraFS واضح، اور Musubi ایک ہی منبع فائل سیٹ سے ماخذ آرکائیو پلان.

شائع کرنے سے پہلے ایک خشک رن کا استعمال کریں:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

بغیر `--dry-run`, `publish` پہلے سے طے شدہ دستاویزات کے تحت لکھتا ہے `.musubi/dist/<namespace>/<name>/<version>/`, اختیاری طور پر manifest اور payload کے ذریعے اپ لوڈ کرتا ہے Torii میں ہوں SoraFS اسٹوریج پن اختتامی نقطہ کے ساتھ `--upload`, پیدا کردہ ریکارڈ کرتا ہے SoraFS pin، اور پیش کرتا ہے `PublishMusubiRelease` ترتیب کے ذریعے Iroha کلائنٹ.

شائع شدہ ریلیزوں میں درج ذیل شامل ہوں گے:

- ایک غیر خالی کینیکل ماخذ آرکائیو
- ایک تعیناتی ماخذ آرکائیو پلان
- کم از کم ایک برآمد شدہ Kotodama فنکشن
- انحصار کے ریکارڈ جو ٹریک ریلیز کو منتخب نہیں کرتے ہیں
- جب موجود ہو تو ایک ڈی اے پی لنک، جس کے معاہدے کا عرفی نام پیکج کے نام کی جگہ سے ملتا ہے

## رجسٹری سوالات اور زندگی کا دورانیہ {#registry-queries-and-lifecycle}

رجسٹری کو تلاش کریں اور اس کی جانچ پڑتال:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

ینکنگ نئی ریزولوشن سے ایک رہائی چھپاتا ہے، لیکن موجودہ لاک فائلوں کو دوبارہ پیش کیا جا سکتا ہے:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi `namespace/package` کو کینیکل پیکیج کا نام بنا کر عالمی نام سکوٹنگ سے بچتا ہے۔ کسی نام کی جگہ میں شائع کرنے کی اجازت اسی ملکیت یا تفویض کردہ اجازت ماڈل کے ذریعہ ہونی چاہئے جو اس Kotodama dapp نام کی جگہ کے لئے استعمال کیا جاتا ہے۔ کوریٹڈ گلوبل شارٹ عرفی پیکیج کے مالک سے علیحدہ ہیں: `SetMusubiShortAlias` کو `CanSetMusubiShortAlias` اجازت کی ضرورت ہوتی ہے ، اور ہدف والے پیکیج میں پہلے ہی کم از کم ایک فعال ریلیز ہونا ضروری ہے۔

## Iroha سطحیں {#iroha-surfaces}

Musubi پہلی کلاس Iroha کی ہدایات اور سوالات کا استعمال کرتا ہے:

|سطح |مقصد |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |ایک ناقابلِ تبدیلی پیکیج ریلیز شائع کریں۔ |
|`YankMusubiRelease` |ایک موجودہ ریلیز کو ٹریک کے طور پر نشان لگاؤ. |
|`SetMusubiShortAlias` |ایک پیکج کی شناخت کے لئے ایک کوریٹڈ عالمی مختصر عرفی منسلک کریں. |
|`AssertMusubiReleaseExists` |ایک ٹھوس پیکیج ورژن کے وجود کی ضرورت ہے. |
|`FindMusubiReleaseByRef` |پیکیج ریفرنس کے مطابق ایک رہائی حاصل کریں. |
|`FindMusubiPackageVersions` |پیکیج کی شناخت کے لیے ورژن درج کریں۔ |
|`FindMusubiPackageReleases` |پیکیج آئی ڈی کے لئے ریلیز خلاصے درج کریں۔ |
|`SearchMusubiPackages` |ناموں کی جگہ اور متن کے لحاظ سے پیکج خلاصہ تلاش کریں۔ |
|`FindMusubiShortAliasByName` |ایک کوریٹڈ مختصر عرفی حل. |

Torii ظاہر کرتا ہے کہ Musubi HTTP کے تحت روٹ فیملی `/v1/musubi/`. ایجنٹ کا سامنا کرنا MCP آلات کے طور پر بے نقاب کیا جاتا ہے `iroha.musubi.` مستعار۔ دیکھیں [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md) اور [سوال کا حوالہ](/ur/reference/queries.md) وسیع تر کے لئے API نقشہ.
