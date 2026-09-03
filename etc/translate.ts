import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface, type Interface as ReadlineInterface } from 'node:readline'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slugify } from '@mdit-vue/shared'
import MarkdownIt from 'markdown-it'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'

const TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single'
const GOOGLE_TRANSLATION_ENGINE = 'google-translate'
const NLLB_TRANSLATION_ENGINE = 'nllb-200-ct2'
const TRANSLATION_STATUS = 'machine-validated'
const MAX_REQUEST_CHARACTERS = 3_500
const MAX_ATTEMPTS = 6

const TECHNICAL_TERM_PATTERN =
  /\b(?:CTranslate2|Docker Compose|Hyperledger Iroha|Iroha 3|LF Decentralized Trust|NLLB-200|Node\.js|SORA Nexus|Android|Docker|Hyperledger|Iroha|Kagami|Kaigi|KeePassXC|Kotodama|Kotlin|Kura|Minamoto|Musubi|Nexus|Norito|pnpm|Python|Rust|rustup|SoraDNS|SoraFS|SoraNet|Soracloud|Sumeragi|Swift|Taira|Torii|VitePress|cargo|curl|git|jq|npm|rustc|systemd|yarn)\b/gu
const CAMEL_CASE_IDENTIFIER_PATTERN = /\b[A-Z][a-z]+(?:[A-Z][A-Za-z0-9]*)+\b/gu
const UPPERCASE_IDENTIFIER_PATTERN = /\b[A-Z][A-Z0-9]+(?:[-/][A-Z0-9]+(?=$|[^\p{L}\p{N}_]))*(?:s)?\b/gu
const DOMAIN_NAME_PATTERN = /\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}\b/giu

const GOOGLE_LANGUAGE_CODES: Readonly<Record<string, string>> = {
  'zh-hans': 'zh-CN',
  'zh-hant': 'zh-TW',
}

const CURATED_EXACT_TRANSLATIONS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  am: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- የፊደሎችን አቢይና ንዑስ ሆሄ ሁኔታ ይጠብቁ እና የ `Unicode` መደበኛነትን አይተግብሩ።',
    'They do not prove that the header class matches the controller.': 'የራስጌው ክፍል ከመቆጣጠሪያው ጋር መዛመዱን አያረጋግጡም።',
    'Use strict `AccountId` validation before authorization or persistence.':
      'ከፈቃድ መስጠት ወይም ከማከማቸት በፊት ጥብቅ `AccountId` ማረጋገጫ ይጠቀሙ።',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC፣ NFKC፣ የስፋት ልወጣ፣ የአቢይ/ንዑስ ፊደል ማጠፍ ወይም ተመሳሳይ መልክ ባለው ቁምፊ መተካት አይተግብሩ።',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'ትክክለኛ ፖሊሲ ቢያንስ አንድ አባል፣ አዎንታዊ ክብደቶች፣ ያልተደጋገሙ የሕዝብ ቁልፎች እና ከ `1` እስከ የአባላት ክብደት ድምር ያለ ገደብ አለው።',
    '10. Require `byte-for-byte` equality with the trimmed input.': '10. ከተከረከመው ግብዓት ጋር `byte-for-byte` እኩልነትን ይጠይቁ።',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- አቢይ ወይም ንዑስ ፊደሎች፣ የቁምፊ ስፋቶች፣ `kana`፣ የፍጆታ ጭነት ወይም የቼክ ድምር የተቀየረበት ሕብረቁምፊ',
    '- Use a collation that preserves letter case and character width.':
      '- የፊደላትን አቢይ/ንዑስ ሁኔታ እና የቁምፊዎችን ስፋት የሚጠብቅ የማነጻጸሪያ ደንብ ይጠቀሙ።',
    '- Keep the full address available when a compact display shortens its middle.':
      '- የታመቀ ማሳያ መካከለኛውን ክፍል ሲያሳጥር ሙሉውን አድራሻ እንዲገኝ ያድርጉ።',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- ከቅጽል ስም እንደገና ከመገንባት ይልቅ የተከማቸውን ካኖኒካል ID ይጠቀሙ።',
    '`AccountId` display and JSON use canonical I105.': 'የ `AccountId` ማሳያ እና JSON ካኖኒካል I105 ይጠቀማሉ።',
  },
  ar: {
    'Its sentinel identifies the intended network with a chain discriminant.':
      'تحدّد علامة الشبكة الشبكة المقصودة باستخدام مميّز السلسلة.',
    'An I105 account ID is domainless.': 'معرّف الحساب I105 ID بلا نطاق.',
    'Deriving an I105 ID does not register or fund the account.': 'لا يؤدي اشتقاق I105 ID إلى تسجيل الحساب أو تمويله.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- حافظ على حالة الأحرف (الكبيرة والصغيرة) كما هي، ولا تطبّق تسوية `Unicode`.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- يجب ألا يكون لـ I105 ID لاحقة `@domain` أو `@domain.dataspace`.',
    '- A regular expression is not an I105 validator.': '- التعبير النمطي ليس أداة تحقق من I105.',
    'Network sentinel': 'علامة الشبكة',
    '### Network sentinels {#network-sentinels}': '### علامات الشبكة {#network-sentinels}',
    'Canonical sentinel': 'علامة الشبكة المعيارية',
    'A decoder must enforce the expected discriminant.': 'يجب أن تفرض وحدة فك الترميز مميّز السلسلة المتوقع.',
    'The checksum cannot detect a sentinel substitution.': 'لا يستطيع المجموع الاختباري اكتشاف استبدال علامة الشبكة.',
    'Forms such as `n00042`, `n369`, `n753`, and `n0` are not canonical.':
      'الأشكال مثل `n00042` و`n369` و`n753` و`n0` ليست تمثيلات معيارية.',
    'The transaction-chain ID and the I105 chain discriminant are separate values.':
      'قيمة ID لسلسلة المعاملات ومميّز سلسلة I105 قيمتان منفصلتان.',
    'They do not materialize an `AccountId`.': 'لا تنشئ هذه الأوامر كائن `AccountId`.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'تتحقق هذه الأوامر من علامة الشبكة، والأبجدية، والمجموع الاختباري، وأطوال البايتات، وبنية `CurveId`/المفتاح، ومن إعادة الترميز الدقيقة على مستوى العنوان.',
    'They do not by themselves validate all multisig policy semantics.':
      'لا تتحقق هذه الأوامر بمفردها من جميع دلالات سياسة التوقيع المتعدد.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'استخدم التحقق الصارم من `AccountId` قبل التفويض أو التخزين الدائم.',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'يستخدم المجموع الاختباري مولدات `Bech32` `polymod` والثابت `0x2bc830a3`.',
    'The checksum-only HRP is the ASCII string `snx`.':
      'إن HRP المستخدم حصريًا للمجموع الاختباري هو سلسلة ASCII `snx`.',
    'The checksum-only HRP is not printed in the address.':
      'لا يُدرج HRP المستخدم حصريًا للمجموع الاختباري في العنوان.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'لا تطبّق NFC أو NFKC، ولا تحوّل عرض الأحرف، ولا توحّد حالة الأحرف، ولا تستبدل الأحرف بأخرى متشابهة بصريًا.',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      'النطاق ومساحة البيانات والاسم المستعار وUAID وبايتات البيانات الوصفية للحساب غير موجودة.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'استخدم الصيغة المدمجة عندما لا يتجاوز طول الحمولة الخام للمفتاح العام 255 بايتًا:',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'لا يكون الترميز الممتد معياريًا لمفتاح يمكن تمثيله بالصيغة المدمجة.',
    '### Multisig controller {#multisig-controller}': '### وحدة تحكم متعددة التوقيعات {#multisig-controller}',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. أزِل فقط محارف المسافات البيضاء المسموح بها أثناء النقل من حول القيمة كاملةً.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. اقرأ علامة الشبكة واشترط مميّز السلسلة المتوقع.',
    '4. Split off the six checksum digits.': '4. افصل أرقام المجموع الاختباري الستة.',
    '6. Verify the checksum over those canonical bytes.':
      '6. تحقّق من المجموع الاختباري المحسوب على تلك البايتات المعيارية.',
    '- no trailing bytes': '- عدم وجود بايتات زائدة في النهاية',
    '- a valid multisig policy when applicable': '- سياسة توقيع متعدد صالحة عند الاقتضاء',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. أنشئ التمثيل المعياري لـ `AccountId` باستخدام المميّز المتوقع.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. اشترط التطابق `byte-for-byte` مع الإدخال بعد إزالة المسافات المحيطة به.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'ترفض خطوة `render-and-compare` النهائية والصريحة في التطبيق علامات الشبكة الرقمية غير ذات التمثيل الأدنى، وتخطيطات المتحكّم غير المعيارية، ومواد السياسة المعاد ترتيبها، وأي صياغة أخرى يمكن فك ترميزها لكنها لا تطابق ناتج V1 الحالي للمُرمِّز.',
    'The decoded discriminant does not match the required network': 'المميّز المفكوك لا يطابق الشبكة المطلوبة',
    'No canonical named or numeric sentinel was found': 'لم يُعثر على علامة شبكة معيارية مسمّاة أو رقمية',
    'A controller field is truncated or uses a non-canonical length form':
      'أحد حقول المتحكّم مبتور أو يستخدم صيغة طول غير معيارية',
    'The input is not an accepted canonical I105 form': 'الإدخال ليس صيغة I105 معيارية مقبولة',
    '- an I105 literal with an appended `@domain` suffix': '- قيمة I105 أُلحقت بها لاحقة `@domain`',
    '- Never substitute an account alias for an I105 ID.': '- لا تستخدم اسمًا مستعارًا للحساب بدلًا من I105 ID مطلقًا.',
    '- Use a collation that preserves letter case and character width.':
      '- استخدم قواعد ترتيب ومقارنة للنصوص تحافظ على حالة الأحرف وعرض المحارف.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- احتفظ بمميّز السلسلة أو ملف تعريف الشبكة المسمّى مع بيانات الحساب المصدّرة والنسخ الاحتياطية.',
    '`AccountId` display and JSON use canonical I105.':
      'يستخدم عرض `AccountId` وتمثيله بصيغة JSON الشكل المعياري I105.',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'استدعِ مُرمِّز I105 الصريح الخاص بـ `AccountAddress` عند الحاجة إلى ID حساب خارجي.',
  },
  az: {
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      '`treasury@payments.universal` kimi bir dəyər hesab aliasıdır, I105 ID-nin başqa yazılışı deyil.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Hərflərin böyük-kiçikliyini qoruyun və `Unicode` normallaşdırmasını tətbiq etməyin.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID-də `@domain` və ya `@domain.dataspace` şəkilçisi olmamalıdır.',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Faydalı yük|`base-105` kanonik hesab nəzarətçisi baytlarının kodlanması |Əhatə olunur |',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Avtorizasiyadan və ya davamlı yaddaşa yazmadan əvvəl ciddi `AccountId` təsdiqləməsindən istifadə edin.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, simvol eninin çevrilməsi, hərf registrinin qatlanması və ya oxşar görünüşlü simvollarla əvəzləmə tətbiq etməyin.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` |Rezerv edilmiş `extension flag` |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 bayt |Xam açarın uzunluğu |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 bayt |Xam açarın uzunluğu, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 bayt |Xam açarın uzunluğu |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` baytlar |Xam ictimai açar yükü |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` baytlar |Xam ictimai açar yükü |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Etibarlı siyasətin ən azı bir üzvü və müsbət çəkiləri olmalı, təkrarlanan ictimai açarları olmamalı, həddi isə `1`-dən üzvlərin çəkilərinin cəminədək olmalıdır.',
    '4. Split off the six checksum digits.': '4. Yoxlama cəminin altı rəqəmini ayırın.',
    '- a valid multisig policy when applicable': '- tətbiq olunduğu halda etibarlı multisig siyasəti',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Kənar boşluqları kəsilmiş girişlə `byte-for-byte` bərabərlik tələb edin.',
    '- Never substitute an account alias for an I105 ID.': '- Heç vaxt I105 ID-ni hesab aliası ilə əvəz etməyin.',
    '- Use a collation that preserves letter case and character width.':
      '- Hərflərin böyük-kiçikliyini və simvol enini qoruyan kollasiyadan istifadə edin.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId` ekranı və JSON təqdimatı kanonik I105-dən istifadə edir.',
  },
  ba: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Хәрефтәрҙең ҙур-бәләкәй булыуын һаҡлағыҙ һәм `Unicode` нормалләштереүен ҡулланмағыҙ.',
    '- A regular expression is not an I105 validator.': '- Регуляр аңлатма I105 валидаторы түгел.',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '|Селтәр sentinel-ы |Тексты бер `u16` сылбыр дискриминантына тап килтерә |Ҡапланмаған |',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Файҙалы йөкләмә|`base-105` каноник иҫәп контроллеры байттарын кодлау |Ҡапланған |',
    'The payload and checksum identify the account controller.':
      'Файҙалы йөкләмә һәм контроль сумма иҫәп контроллерын билдәләй.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Улар sentinel-ды, алфавитты, контроль сумманы, байт оҙонлоҡтарын, `CurveId`/асҡыс формаһын һәм адрес ҡатламының теүәл ҡабат кодланыуын тикшерә.',
    'They do not materialize an `AccountId`.': 'Улар `AccountId` объектын булдырмай.',
    'They do not by themselves validate all multisig policy semantics.':
      'Улар үҙҙәре генә multisig сәйәсәтенең бөтә семантикаһын тикшермәй.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Авторизациялау йәки даими һаҡлау алдынан `AccountId`-ҙы ҡәтғи тикшереүҙе ҡулланығыҙ.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, киңлекте үҙгәртеү, хәреф регистрын берләштереү йәки оҡшаш күренгән символға алмаштырыуҙы ҡулланмағыҙ.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` | Резервтағы `extension flag` |',
    'Current V1 encoders emit header `0x02` for a single-key controller and `0x0a` for a multisig controller.':
      'Хәҙерге V1 кодлаусылары бер асҡыслы контроллер өсөн `0x02` башлығын һәм multisig контроллер өсөн `0x0a` башлығын сығара.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'Асыҡ асҡыстың сей йөкмәткеһе 255 байттан артмаһа, компакт форманы ҡулланығыҙ:',
    'Keys longer than 255 bytes use the extended form:': '255 байттан оҙонораҡ асҡыстар киңәйтелгән форманы ҡуллана:',
    '| `curve`      |          1 byte | `CurveId` registry value |': '|`curve` |1 байт |`CurveId` реестры ҡиммәте |',
    '| `curve`      |          1 byte | `CurveId` registry value     |':
      '|`curve` |1 байт |`CurveId` реестры ҡиммәте |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 байт |Сей асҡыс оҙонлоғо |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 байт |Сей асҡыс оҙонлоғо, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 байт |Сей асҡыс оҙонлоғо |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` байт |Сей асыҡ асҡыс йөкмәткеһе |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` байт |Сей асыҡ асҡыс йөкмәткеһе |',
    '| `members`        | Variable | Repeated member records        |':
      '|`members` |Үҙгәрешле |Ҡабатланған ағза яҙмалары |',
    '| `weight`     |         2 bytes | Member approval weight   |': '|`weight` |2 байт |Ағзаның раҫлау ауырлығы |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Яраҡлы сәйәсәттә кәм тигәндә бер ағза һәм ыңғай ауырлыҡтар булырға, ҡабатланған асыҡ асҡыстар булмаҫҡа, ә сик `1`-ҙән ағзалар ауырлыҡтарының суммаһына тиклем булырға тейеш.',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Каноник төҙөлөш ағзаларҙы ҡултамға алгоритмының тотороҡло исеме, нуль айырыусы байт, шунан сей асыҡ асҡыс байттары буйынса сортлай.',
    '4. Split off the six checksum digits.': '4. Контроль суммаһының алты цифрын айырып алығыҙ.',
    '6. Verify the checksum over those canonical bytes.': '6. Ошо каноник байттар өсөн контроль сумманы тикшерегеҙ.',
    '- a supported `CurveId`': '- ярҙам ителгән `CurveId`',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Ҡушымтаның асыҡ һуңғы `render-and-compare` аҙымы минималь булмаған һанлы sentinel-дарҙы, контроллерҙың каноник булмаған урынлашыуҙарын, яңынан тәртипкә һалынған сәйәсәт материалын һәм декодланған, әммә кодлаусының ағымдағы V1 сығышы булмаған башҡа һәр яҙылышты кире ҡаға.',
    '- Never substitute an account alias for an I105 ID.': '- I105 ID урынына бер ҡасан да иҫәп ҡушаматын ҡулланмағыҙ.',
    '- Use a collation that preserves letter case and character width.':
      '- Хәрефтәрҙең ҙур-бәләкәй булыуын һәм символ киңлеген һаҡлаған сағыштырыу тәртибен ҡулланығыҙ.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId` дисплейы һәм JSON күрһәтелеше каноник I105 ҡуллана.',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Түбән кимәлдәге `AccountAddress` дисплейы/JSON күрһәтелеше эске һәм көйләү контексттары өсөн каноник ун алтылыҡ форманы ҡуллана.',
  },
  dz: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- ཡི་གུའི་ཆེ་ཆུང་ཉམས་མེད་བཞག་ནི་དང་ `Unicode` normalization མི་འབད།',
    'A decoder must enforce the expected discriminant.':
      'Decoder གིས་ རེ་བ་བསྐྱེད་པའི་ chain discriminant དེ་ ངེས་པར་དུ་བརྟག་དཔྱད་འབད་དགོ།',
    'They do not by themselves validate all multisig policy semantics.':
      'དེ་ཚུ་གིས་ ཁོང་རང་གིས་ multisig policy semantics ཆ་ཚང་བརྟག་དཔྱད་མི་འབད།',
    'They do not prove that the header class matches the controller.':
      'དེ་ཚུ་གིས་ header class དེ་ controller དང་མཐུན་པའི་ཁུངས་སྐྱེལ་མི་འབད།',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Authorization ཡང་ན་ persistence མ་འབད་བའི་ཧེ་མ་ strict `AccountId` validation ལག་ལེན་འཐབ་དགོ།',
    'Leading zero bytes are preserved as zero-valued `base-105` digits.':
      'འགོ་ཐོག་གི་ zero bytes ཚུ་ zero-valued `base-105` digits སྦེ་ཉར་ཚགས་འབདཝ་ཨིན།',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|ཁེ་ཕན་གྱི་འགན་ཁུར་ |`base-105` ཀ་ནོ་སི་ཀཱན་གྱི་རྩིས་ཁྲ་འཛིན་སྐྱོང་གི་ བའི་ཊི་ཚུ་ ཨེབ་གཏང་འབདཝ་ཨིན། |ཚུད་ཡོདཔ་ |',
    '| `7..5` |     3 |                          `0` | Address format version field |':
      '| `7..5` |     3 |                          `0` |Address format version field |',
    '| `2..1` |     2 |                          `1` | Normalization version field  |':
      '| `2..1` |     2 |                          `1` |Normalization version field |',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` |ཟུར་བཞག་འབད་ཡོད་པའི་ `extension flag` |',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '`AccountId` ལུ་བསྒྱུར་ཞིནམ་ལས་ དེའི་ canonical rendering དང་བསྡུར་བ་ཅིན་ ད་ལྟོའི་ V1 canonicality ངེས་གཏན་འབདཝ་ཨིན།',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'Raw public-key payload དེ་ 255 bytes ལས་མ་ལྷག་པའི་སྐབས་ compact form ལག་ལེན་འཐབ།',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` བའི་ཊི་ |Raw public-key payload |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` བའི་ཊི་ |Raw public-key payload |',
    '| `weight`     |         2 bytes | Member approval weight   |': '|`weight` |2 byte |Member approval weight |',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'SDK དེ་ རེ་བའི་ chain discriminant དང་གཅིག་ཁར configure འབད་ཞིནམ་ལས་ `AccountId` ལུ parse འབད་དེ་ ལོག་ཐོབ་པའི་ canonical rendering དེ་ trimmed input དང་བསྡུར།',
    'The comparison is significant because the parser can normalize decodable controller material while constructing the `AccountId`.':
      'དབྱེ་བསྡུར་འདི་གལ་ཆེ། parser གིས་ `AccountId` བཟོ་བའི་སྐབས་ decodable controller material ལུ normalize འབད་ཚུགསཔ་ལས་ཨིན།',
    'The low-level decoder can preserve other version and normalization bit values and does not independently cross-check the class against the controller tag.':
      'གནས་རིམ་དམའ་བའི decoder གིས་ version དང་ normalization bit values གཞན་ཚུ་ཉར་ཚགས་འབད་ཚུགས་རུང་ class དེ་ controller tag དང་རང་དབང་སྦེ་ cross-check མི་འབད།',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 byte |Raw key གི་རིང་ཚད་, `big-endian` |',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'Compact form ནང་ཚུད་མི་ key ཅིག་ལུ་ extended encoding འདི་ canonical མེན།',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Valid policy ཅིག་ལུ་ ཉུང་མཐའ་འཐུས་མི་གཅིག་, positive weights, duplicate public keys མེདཔ་, དེ་ལས་ threshold དེ་ `1` ལས་ member weights གི་བསྡོམས་ཚད་ཚུན་ཡོད་དགོ།',
    'An I105 literal has no fixed character length because multisig and post-quantum controllers can be large.':
      'Multisig དང་ post-quantum controllers ཚུ་སྦོམ་འགྱོ་ཚུགསཔ་ལས་ I105 literal ལུ་ character length གཏན་འཁེལ་མེད།',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. གནས་གོང་ཆ་ཚང་གི་མཐའ་འཁོར་ལས་ སྐྱེལ་འདྲེན་ལུ་ཆོག་པའི་ whitespace རྐྱངམ་ཅིག trim འབད།',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. Sentinel ལྷག་ཞིནམ་ལས་ རེ་བའི་ chain discriminant དགོཔ་སྦེ་བཟོ།',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. ལྷག་ལུས་ `Unicode` symbol རེ་རེ་ ངེས་ཏིག་ 105-symbol alphabet བརྒྱུད་དེ map འབད།',
    '4. Split off the six checksum digits.': '4. Checksum digits དྲུག་ཁ་ཕྱེ།',
    '5. Convert the payload digits back to canonical bytes.': '5. Payload digits ཚུ་ canonical bytes ལུ་ལོག་སྒྱུར།',
    '6. Verify the checksum over those canonical bytes.': '6. Canonical bytes དེ་ཚུའི་ checksum བརྟག་དཔྱད་འབད།',
    '7. Parse the header and controller, requiring:':
      '7. Header དང་ controller དབྱེ་ཞིབ་འབད་ཞིནམ་ལས་ འདི་ཚུ་དགོཔ་སྦེ་བཟོ།',
    '- exact field lengths': '- field lengths ངེས་ཏིག',
    '- a supported `CurveId`': '- རྒྱབ་སྐྱོར་ཡོད་པའི་ `CurveId`',
    '- a valid public key': '- public key ཆ་གནས་ཅན',
    '- no trailing bytes': '- trailing bytes མེདཔ',
    '- a valid multisig policy when applicable': '- འོས་འབབ་ཡོད་ཚེ་ multisig policy ཆ་གནས་ཅན',
    '8. Construct an `AccountId`.': '8. `AccountId` བཟོ།',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. རེ་བའི་ discriminant གི་དོན་ལུ་ `AccountId` དེ་ canonical སྦེ render འབད།',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Trim འབད་ཡོད་པའི་ input དང་ `byte-for-byte` འདྲ་མཉམ་དགོཔ་སྦེ་བཟོ།',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Application གི་མཇུག་གི་ `render-and-compare` step ཁ་གསལ་དེ་གིས་ non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material དང་ decode འབད་ཚུགས་རུང་ encoder གི་ད་ལྟོའི་ V1 output མེན་པའི་ཡིག་སྡེབ་གཞན་ཚུ་ཆ་མཉམ་ཆ་མེད་གཏངམ་ཨིན།',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      'Checksum ལེགས་ཤོམ་ཡོདཔ་ ཡང་ན་ low-level `AccountAddress` parse ལེགས་ཤོམ་ཡོདཔ་གིས་ བརྟག་དཔྱད་འདིའི་ཚབ་མི་འབད།',
    '- Use a collation that preserves letter case and character width.':
      '- ཡི་གུའི་ཆེ་ཆུང་དང་ character width སྲུང་མི་ collation ལག་ལེན་འཐབ།',
    '- Reuse an address only with its network context.':
      '- Address དེ་ དེའི་ network context དང་གཅིག་ཁར་རྐྱངམ་ཅིག་ལོག་ལག་ལེན་འཐབ།',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- Alias ལས་ལོག་བཟོ་ནིའི་ཚབ་ལུ་ ཉར་ཚགས་འབད་ཡོད་པའི་ canonical ID ལག་ལེན་འཐབ།',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'External account ID དགོ་པའི་སྐབས་ `AccountAddress` I105 encoder ཁ་གསལ་དེ་ལུ་འབོ།',
  },
  es: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Conserve exactamente las mayúsculas y minúsculas, y no aplique la normalización de `Unicode`.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'No aplique NFC ni NFKC, ni convierta el ancho de los caracteres, ni cambie las mayúsculas y minúsculas, ni sustituya caracteres por otros visualmente similares.',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      'El dominio, el espacio de datos, el alias, el UAID y los bytes de metadatos de la cuenta no están presentes.',
    '| `key_len`    |          1 byte | Raw key length           |':
      '|`key_len` |1 byte |Longitud de la clave en bruto |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 bytes |Longitud de la clave en bruto, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |':
      '|`key_len` |2 bytes |Longitud de la clave en bruto |',
    'The checksum-only HRP is the ASCII string `snx`.':
      'El HRP usado exclusivamente para la suma de comprobación es la cadena ASCII `snx`.',
    'The checksum-only HRP is not printed in the address.':
      'El HRP usado exclusivamente para la suma de comprobación no se incluye en la dirección.',
    '4. Split off the six checksum digits.': '4. Separe los seis dígitos correspondientes a la suma de comprobación.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Verifique la suma de comprobación calculada sobre esos bytes canónicos.',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. Genere la representación canónica del `AccountId` para el discriminante esperado.',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- una cadena en la que se hayan cambiado las letras mayúsculas o minúsculas, el ancho de los caracteres, los caracteres `kana`, la carga útil o la suma de comprobación',
    '- Never substitute an account alias for an I105 ID.': '- Nunca use un alias de cuenta en lugar de un I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Use una intercalación que preserve las mayúsculas y minúsculas y el ancho de los caracteres.',
    '`AccountId` display and JSON use canonical I105.':
      'La visualización de `AccountId` y su representación JSON usan el formato I105 canónico.',
  },
  fr: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Respectez la casse des lettres et n’appliquez aucune normalisation `Unicode`.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Ils vérifient la sentinelle, l’alphabet, la somme de contrôle, les longueurs en octets, la conformité du `CurveId` et de la clé, ainsi que le réencodage exact au niveau de l’adresse.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'N’appliquez ni NFC, ni NFKC, ni conversion de largeur, ni repliement de casse, ni substitution par des caractères visuellement similaires.',
    '4. Split off the six checksum digits.': '4. Détachez les six chiffres de la somme de contrôle.',
    '6. Verify the checksum over those canonical bytes.': '6. Vérifiez la somme de contrôle sur ces octets canoniques.',
    '- a supported `CurveId`': '- un `CurveId` pris en charge',
    '- Never substitute an account alias for an I105 ID.':
      '- N’utilisez jamais un alias de compte à la place de l’I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Utilisez une collation qui préserve la casse des lettres et la largeur des caractères.',
    '`AccountId` display and JSON use canonical I105.':
      'L’affichage de `AccountId` et sa représentation JSON utilisent la forme I105 canonique.',
  },
  hy: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Պահպանեք տառերի մեծատառ/փոքրատառ ձևը և մի կիրառեք `Unicode` նորմալացում։',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Դրանք ստուգում են sentinel-ը, այբուբենը, ստուգիչ գումարը, բայթերի երկարությունները, `CurveId`-ի/բանալու ձևը և հասցեի շերտի ճշգրիտ վերակոդավորումը։',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Օգտագործեք `AccountId`-ի խիստ վավերացում նախքան թույլտվումը կամ պահպանումը։',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'Մի կիրառեք NFC, NFKC, լայնության փոխակերպում, տառերի ռեգիստրի միավորում կամ նման տեսք ունեցող նիշերով փոխարինում։',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Օգտակար բեռը|`base-105` կանոնիկ հաշվի վերահսկիչի բայթերի կոդավորումը |Ընդգրկված |',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` | Պահուստավորված `extension flag` |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 բայթ |Հում բանալու երկարությունը |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 բայթ |Հում բանալու երկարությունը, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 բայթ |Հում բանալու երկարությունը |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` բայթեր |Հում հանրային բանալու օգտակար բեռը |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` բայթեր |Հում հանրային բանալու օգտակար բեռը |',
    '| `members`        | Variable | Repeated member records        |':
      '|`members` |Փոփոխական |Կրկնվող անդամների գրառումներ |',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Կանոնիկ կառուցումը անդամներին դասակարգում է ըստ ստորագրման ալգորիթմի կայուն անվան, զրոյական բաժանարար բայթի, ապա՝ հանրային բանալու հում բայթերի։',
    '4. Split off the six checksum digits.': '4. Առանձնացրեք ստուգիչ գումարի վեց թվանշանները։',
    '6. Verify the checksum over those canonical bytes.': '6. Ստուգեք այդ կանոնիկ բայթերի ստուգիչ գումարը։',
    '- a supported `CurveId`': '- աջակցվող `CurveId`',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Հավելվածի հստակ վերջնական `render-and-compare` քայլը մերժում է ոչ նվազագույն թվային sentinel-ները, վերահսկիչի ոչ կանոնիկ դասավորությունները, վերադասավորված քաղաքականության նյութը և ցանկացած այլ գրառում, որը ապակոդավորվում է, բայց չի համապատասխանում կոդավորիչի ընթացիկ V1 ելքին։',
    '- Never substitute an account alias for an I105 ID.': '- Երբեք I105 ID-ն մի փոխարինեք հաշվի alias-ով։',
    '- Use a collation that preserves letter case and character width.':
      '- Օգտագործեք համադրում, որը պահպանում է տառերի մեծատառ/փոքրատառ ձևը և նիշերի լայնությունը։',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId`-ի ցուցադրումը և JSON ներկայացումը օգտագործում են կանոնիկ I105։',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Ցածր մակարդակի `AccountAddress`-ի ցուցադրումը/JSON ներկայացումը ներքին և վրիպազերծման համատեքստերում օգտագործում է կանոնիկ տասնվեցական ձևը։',
  },
  he: {
    'Its sentinel identifies the intended network with a chain discriminant.':
      'הסנטינל שלו מזהה את הרשת המיועדת באמצעות מבחין השרשרת.',
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      'ערך כגון `treasury@payments.universal` הוא כינוי חשבון, ולא איות אחר של ה־I105 ID.',
    'Deriving an I105 ID does not register or fund the account.':
      'גזירת I105 ID אינה רושמת את החשבון ואינה מממנת אותו.',
    '- Store and compare the canonical UTF-8 string exactly.': '- שמרו והשוו במדויק את מחרוזת ה־UTF-8 הקנונית.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- שמרו על רישיות האותיות ואל תחילו נרמול `Unicode`.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- ל־I105 ID אסור שתהיה סיומת `@domain` או `@domain.dataspace`.',
    '- A regular expression is not an I105 validator.': '- ביטוי רגולרי אינו כלי אימות ל־I105.',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| חלק | מטרה | כיסוי סכום הביקורת |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| סנטינל רשת | ממפה את הטקסט למבחין שרשרת `u16` אחד | לא מכוסה |',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '| מטען | קידוד `base-105` של הבתים הקנוניים של בקר החשבון | מכוסה |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| סכום ביקורת | שישה ערכי `5-bit` בסגנון `Bech32m`, המיוצגים באלפבית I105 | N/A |',
    'The payload and checksum identify the account controller.': 'המטען וסכום הביקורת מזהים את בקר החשבון.',
    'A decoder must enforce the expected discriminant.': 'מפענח חייב לאכוף את מבחין השרשרת הצפוי.',
    'The checksum cannot detect a sentinel substitution.': 'סכום הביקורת אינו יכול לזהות החלפה של הסנטינל.',
    '| Network or context      |               Chain discriminant |      Hex | Canonical sentinel                          |':
      '| רשת או הקשר | מבחין שרשרת | Hex | סנטינל קנוני |',
    'The named values always use their named sentinel.': 'ערכים בעלי שם משתמשים תמיד בסנטינל בעל השם המתאים להם.',
    'The transaction-chain ID and the I105 chain discriminant are separate values.':
      'ה־ID של שרשרת העסקאות ומבחין השרשרת של I105 הם ערכים נפרדים.',
    'Choosing an endpoint or chain ID does not implicitly choose the address profile.':
      'בחירת נקודת קצה או ID של שרשרת אינה בוחרת במשתמע את פרופיל הכתובת.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'הפקודות מאמתות את הסנטינל, האלפבית, סכום הביקורת, אורכי הבתים, המבנה של `CurveId`/המפתח, ואת הקידוד מחדש המדויק בשכבת הכתובת.',
    'They do not materialize an `AccountId`.': 'הן אינן יוצרות `AccountId`.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'השתמשו באימות קפדני של `AccountId` לפני הרשאה או שמירה מתמשכת.',
    'For a private network, use its configured discriminant explicitly with `--network-prefix`.':
      'ברשת פרטית, השתמשו במפורש במבחין שהוגדר לה באמצעות `--network-prefix`.',
    'Re-encoding changes only the network context.': 'קידוד מחדש משנה רק את הקשר הרשת.',
    'The checksum-only HRP is the ASCII string `snx`.': 'ה־HRP המשמש רק לסכום הביקורת הוא מחרוזת ה־ASCII `snx`.',
    'The checksum-only HRP is not printed in the address.': 'ה־HRP המשמש רק לסכום הביקורת אינו מופיע בכתובת.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'אל תחילו NFC, NFKC, המרת רוחב, קיפול רישיות או החלפה בתו דומה למראה.',
    'All multi-byte integers below are unsigned and `big-endian`.':
      'כל המספרים השלמים מרובי־הבתים שלהלן הם ללא סימן ובסדר `big-endian`.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0` | 1 | `0` | `extension flag` שמור |',
    'Address classes `2` and `3` are unassigned.': 'מחלקות הכתובת `2` ו־`3` אינן מוקצות.',
    'The low-level decoder can preserve other version and normalization bit values and does not independently cross-check the class against the controller tag.':
      'המפענח ברמה הנמוכה יכול לשמר ערכי ביט אחרים של גרסה ונרמול, ואינו מבצע באופן עצמאי בדיקה צולבת של המחלקה מול תג הבקר.',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      'המרה ל־`AccountId` והשוואה לייצוג הקנוני שלו מוכיחות קנוניות לפי V1 הנוכחי.',
    '| `key_len`    |          1 byte | Raw key length           |': '| `key_len` | בית אחד | אורך המפתח הגולמי |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '| `public_key` | `key_len` בתים | מטען המפתח הציבורי הגולמי |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '| `key_len` | 2 בתים | אורך המפתח הגולמי, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '| `key_len` | 2 בתים | אורך המפתח הגולמי |',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'הבנייה הקנונית ממיינת את החברים לפי השם היציב של אלגוריתם החתימה, אחריו בית מפריד אפס, ולאחר מכן בתי המפתח הציבורי הגולמי.',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'לאחר הגדרת ה־SDK עם מבחין השרשרת הצפוי, נתחו ל־`AccountId` והשוו את הייצוג הקנוני שהוחזר לקלט לאחר הסרת הרווחים מקצותיו.',
    'The comparison is significant because the parser can normalize decodable controller material while constructing the `AccountId`.':
      'ההשוואה חשובה משום שהמנתח יכול לנרמל חומר בקר שניתן לפענוח בעת בניית ה־`AccountId`.',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. הסירו רק רווחי תעבורה מותרים מסביב לערך המלא.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. קראו את הסנטינל ודרשו את מבחין השרשרת הצפוי.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. מפו כל סמל `Unicode` שנותר דרך האלפבית המדויק בן 105 הסמלים.',
    '7. Parse the header and controller, requiring:': '7. נתחו את הכותרת ואת הבקר, ודרשו:',
    '- no trailing bytes': '- שלא יהיו בתים עודפים בסוף',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. הציגו את `AccountId` בצורה קנונית עבור המבחין הצפוי.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. דרשו שוויון `byte-for-byte` לקלט לאחר הסרת הרווחים מקצותיו.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'שלב ה־`render-and-compare` הסופי והמפורש של היישום דוחה סנטינלים מספריים שאינם מינימליים, פריסות בקר שאינן קנוניות, חומר מדיניות שסודר מחדש, וכל איות אחר שניתן לפענוח אך אינו הפלט הנוכחי של מקודד V1.',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      'אימות מוצלח של סכום הביקורת או ניתוח מוצלח ברמה הנמוכה של `AccountAddress` אינם תחליף לבדיקה זו.',
    '| `ERR_I105_TOO_SHORT`             | The body cannot contain both payload and checksum                   |':
      '| `ERR_I105_TOO_SHORT` | הגוף אינו יכול להכיל גם את המטען וגם את סכום הביקורת |',
    '- an account alias such as `alice@wonderland.universal`': '- כינוי חשבון כגון `alice@wonderland.universal`',
    '- an I105 literal with an appended `@domain` suffix': '- ליטרל I105 שבסופו נוספה סיומת `@domain`',
    '- an address for the wrong chain discriminant': '- כתובת עבור מבחין שרשרת שגוי',
    '- Send the exact I105 UTF-8 string in JSON account fields.':
      '- שלחו את מחרוזת I105 UTF-8 המדויקת בשדות החשבון ב־JSON.',
    '- `Percent-encode` the complete account ID before placing it in a URL path segment.':
      '- לפני הצבת ID החשבון המלא במקטע נתיב של URL, בצעו לו `Percent-encode`.',
    '- Never substitute an account alias for an I105 ID.': '- לעולם אל תשתמשו בכינוי חשבון במקום I105 ID.',
    '- Store the canonical string returned by the codec with `byte-preserving` comparison semantics.':
      '- שמרו את המחרוזת הקנונית שה־codec מחזיר, עם סמנטיקת השוואה `byte-preserving`.',
    '- Use a collation that preserves letter case and character width.':
      '- השתמשו בקולציה המשמרת רישיות אותיות ורוחב תווים.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- שמרו את מבחין השרשרת או את פרופיל הרשת בעל השם יחד עם נתוני החשבון שיוצאו ועם הגיבויים.',
    '- Display the complete address and provide a copy action.': '- הציגו את הכתובת המלאה וספקו פעולת העתקה.',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'כאשר נדרש ID של חשבון חיצוני, הפעילו את מקודד I105 המפורש של `AccountAddress`.',
  },
  ja: {
    '- Select the network profile before encoding or validating an address.':
      '- アドレスをエンコードまたは検証する前に、ネットワークプロファイルを選択してください。',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- 英字の大文字と小文字を保持し、`Unicode` 正規化を適用しないでください。',
    '- A regular expression is not an I105 validator.': '- 正規表現は I105 バリデーターではありません。',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| 部分 | 目的 | チェックサムの対象 |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| ネットワークセンチネル | テキストを 1 つの `u16` チェーン識別値に対応付ける | 対象外 |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| チェックサム | I105 アルファベットで表現した `Bech32m` 形式の 6 個の `5-bit` 値 | N/A |',
    'The payload and checksum identify the account controller.':
      'ペイロードとチェックサムはアカウントコントローラーを識別します。',
    'A decoder must enforce the expected discriminant.':
      'デコーダーは期待されるチェーン識別値を必ず検証しなければなりません。',
    'The checksum cannot detect a sentinel substitution.': 'チェックサムではセンチネルの置き換えを検出できません。',
    '| Network or context      |               Chain discriminant |      Hex | Canonical sentinel                          |':
      '| ネットワークまたはコンテキスト | チェーン識別値 | Hex | 正規センチネル |',
    'The named values always use their named sentinel.':
      '名前付きの値には、常に対応する名前付きセンチネルを使用します。',
    'Forms such as `n00042`, `n369`, `n753`, and `n0` are not canonical.':
      '`n00042`、`n369`、`n753`、`n0` のような形式は正規ではありません。',
    'Use strict `AccountId` validation before authorization or persistence.':
      '認可または永続化の前に、厳格な `AccountId` 検証を行ってください。',
    'For a private network, use its configured discriminant explicitly with `--network-prefix`.':
      'プライベートネットワークでは、設定済みのチェーン識別値を `--network-prefix` で明示的に指定してください。',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'チェックサムでは、`Bech32` の `polymod` 生成子と定数 `0x2bc830a3` を使用します。',
    'The checksum-only HRP is not printed in the address.': 'チェックサム専用の HRP はアドレスに出力されません。',
    'All multi-byte integers below are unsigned and `big-endian`.':
      '以下の複数バイト整数はすべて符号なしで、`big-endian` です。',
    'The `base-105` body encodes a binary account payload, not a public-key string and not a Norito JSON object:':
      '`base-105` 本文はバイナリアカウントペイロードをエンコードするものであり、公開鍵文字列でも Norito JSON オブジェクトでもありません:',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '`AccountId` に変換し、その正規の表現と比較することで、現在の V1 正規性を確認できます。',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      '生の公開鍵ペイロードが 255 バイト以下の場合は、コンパクト形式を使用します:',
    '| `key_len`    |          1 byte | Raw key length           |': '| `key_len` | 1 バイト | 生の鍵の長さ |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '| `public_key` | `key_len` バイト | 生の公開鍵ペイロード |',
    'Keys longer than 255 bytes use the extended form:': '255 バイトを超える鍵では拡張形式を使用します:',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '| `key_len` | 2 バイト | 生の鍵の長さ、`big-endian` |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '| `public_key` | `key_len` バイト | 生の公開鍵ペイロード |',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'コンパクト形式に収まる鍵に対して、拡張エンコードは正規ではありません。',
    '| `threshold`      |  2 bytes | Required total approval weight |':
      '| `threshold` | 2 バイト | 必要な承認の重みの合計 |',
    '| `weight`     |         2 bytes | Member approval weight   |': '| `weight` | 2 バイト | メンバーの承認の重み |',
    '| `key_len`    |         2 bytes | Raw key length           |': '| `key_len` | 2 バイト | 生の鍵の長さ |',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      '正規構築では、署名アルゴリズムの安定した名前、ゼロ区切りバイト、生の公開鍵バイトの順でメンバーを並べ替えます。',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'SDK に期待されるチェーン識別値を設定した後、`AccountId` として解析し、返された正規の表現を前後の許可された空白を除去した入力と比較します。',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. 値全体の前後にある、許可された転送上の空白だけを除去します。',
    '5. Convert the payload digits back to canonical bytes.': '5. ペイロードの各桁を正規バイト列へ戻します。',
    '6. Verify the checksum over those canonical bytes.': '6. その正規バイト列に対してチェックサムを検証します。',
    '- no trailing bytes': '- 末尾に余分なバイトがないこと',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. 期待されるチェーン識別値に対して `AccountId` を正規形式で表現します。',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. 前後の許可された空白を除去した入力との `byte-for-byte` 一致を要求します。',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'アプリケーションの明示的な最終 `render-and-compare` ステップでは、最小形式でない数値センチネル、非正規のコントローラーレイアウト、並べ替えられたポリシー素材、およびデコードできてもエンコーダーの現在の V1 出力ではないその他の表記を拒否します。',
    '- an I105 literal with an appended `@domain` suffix': '- 末尾に `@domain` サフィックスを付加した I105 リテラル',
    '- an address for the wrong chain discriminant': '- 誤ったチェーン識別値のアドレス',
    '- `Percent-encode` the complete account ID before placing it in a URL path segment.':
      '- 完全なアカウント ID を URL パスセグメントに配置する前に `Percent-encode` してください。',
    '- Never substitute an account alias for an I105 ID.':
      '- I105 ID の代わりにアカウントエイリアスを使用しないでください。',
    '- Use a collation that preserves letter case and character width.':
      '- 英字の大文字と小文字、および文字幅を保持する照合順序を使用してください。',
    '- Display the complete address and provide a copy action.':
      '- 完全なアドレスを表示し、コピー操作を提供してください。',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      '外部アカウント ID が必要な場合は、明示的な `AccountAddress` I105 エンコーダーを呼び出してください。',
  },
  ka: {
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      'ისეთი მნიშვნელობა, როგორიცაა `treasury@payments.universal`, ანგარიშის ალიასია და არა I105 ID-ის ჩაწერის სხვა ფორმა.',
    'Deriving an I105 ID does not register or fund the account.':
      'I105 ID-ის გამოყვანა ანგარიშს არც არეგისტრირებს და არც აფინანსებს.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- შეინარჩუნეთ ასოების რეგისტრი და არ გამოიყენოთ `Unicode` ნორმალიზაცია.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID-ს არ უნდა ჰქონდეს `@domain` ან `@domain.dataspace` სუფიქსი.',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| ნაწილი | დანიშნულება | საკონტროლო ჯამის დაფარვა |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| ქსელის სენტინელი | ტექსტს აკავშირებს ერთ `u16` ჯაჭვის დისკრიმინანტთან | არ არის დაფარული |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| საკონტროლო ჯამი | I105 ანბანით წარმოდგენილი `Bech32m`-ის სტილის ექვსი `5-bit` მნიშვნელობა | N/A |',
    'The payload and checksum identify the account controller.':
      'სასარგებლო დატვირთვა და საკონტროლო ჯამი ანგარიშის კონტროლერს განსაზღვრავს.',
    'A decoder must enforce the expected discriminant.':
      'დეკოდერმა უნდა უზრუნველყოს მოსალოდნელ დისკრიმინანტთან შესაბამისობა.',
    'The checksum cannot detect a sentinel substitution.':
      'საკონტროლო ჯამს სენტინელის ჩანაცვლების აღმოჩენა არ შეუძლია.',
    '| Network or context      |               Chain discriminant |      Hex | Canonical sentinel                          |':
      '| ქსელი ან კონტექსტი | ჯაჭვის დისკრიმინანტი | Hex | კანონიკური სენტინელი |',
    'The named values always use their named sentinel.':
      'დასახელებული მნიშვნელობები ყოველთვის შესაბამის დასახელებულ სენტინელს იყენებს.',
    'Inspect the detected format, canonical hex, and selected network context as JSON:':
      'შეამოწმეთ აღმოჩენილი ფორმატი, კანონიკური hex და არჩეული ქსელის კონტექსტი JSON-ის სახით:',
    'Audit the address-codec structure of a newline-separated file without silently accepting parse failures:':
      'ახალი ხაზებით გამოყოფილი ფაილის address-codec-ის სტრუქტურა ისე შეამოწმეთ, რომ პარსინგის შეცდომები ჩუმად არ მიიღოთ:',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'ისინი ამოწმებენ სენტინელს, ანბანს, საკონტროლო ჯამს, ბაიტების სიგრძეებს, `CurveId`/გასაღების სტრუქტურას და მისამართის ფენაზე ზუსტ ხელახალ კოდირებას.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'ავტორიზაციამდე ან მუდმივ შენახვამდე გამოიყენეთ `AccountId`-ის მკაცრი ვალიდაცია.',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'საკონტროლო ჯამი იყენებს `Bech32` `polymod` გენერატორებს და კონსტანტას `0x2bc830a3`.',
    'The checksum-only HRP is the ASCII string `snx`.':
      'მხოლოდ საკონტროლო ჯამისთვის განკუთვნილი HRP არის ASCII სტრიქონი `snx`.',
    'The checksum-only HRP is not printed in the address.':
      'მხოლოდ საკონტროლო ჯამისთვის განკუთვნილი HRP მისამართში არ იბეჭდება.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'არ გამოიყენოთ NFC, NFKC, სიგანის გარდაქმნა, ასოების რეგისტრის გათანაბრება ან ვიზუალურად მსგავსი სიმბოლოთი ჩანაცვლება.',
    'All multi-byte integers below are unsigned and `big-endian`.':
      'ქვემოთ მოცემული ყველა მრავალბაიტიანი მთელი რიცხვი უნიშნოა და `big-endian` ფორმატშია.',
    'Address classes `2` and `3` are unassigned.': 'მისამართის კლასები `2` და `3` არ არის მინიჭებული.',
    'An `extension flag` of `1` is rejected.': '`extension flag`-ის მნიშვნელობა `1` უარყოფილია.',
    'The low-level decoder can preserve other version and normalization bit values and does not independently cross-check the class against the controller tag.':
      'დაბალი დონის დეკოდერს შეუძლია შეინარჩუნოს ვერსიისა და ნორმალიზაციის ბიტების სხვა მნიშვნელობები და დამოუკიდებლად არ ამოწმებს კლასის შესაბამისობას კონტროლერის ტეგთან.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'გამოიყენეთ კომპაქტური ფორმა, თუ ნედლი საჯარო გასაღების სასარგებლო დატვირთვა არ აღემატება 255 ბაიტს:',
    '| `key_len`    |          1 byte | Raw key length           |': '| `key_len` | 1 ბაიტი | ნედლი გასაღების სიგრძე |',
    'Keys longer than 255 bytes use the extended form:': '255 ბაიტზე გრძელი გასაღებები გაფართოებულ ფორმას იყენებს:',
    '| `key_len`    |         2 bytes | Raw key length           |': '| `key_len` | 2 ბაიტი | ნედლი გასაღების სიგრძე |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'მოქმედ პოლიტიკას უნდა ჰყავდეს სულ მცირე ერთი წევრი, ჰქონდეს დადებითი წონები, არ ჰქონდეს დუბლირებული საჯარო გასაღებები, ხოლო ზღვარი უნდა იყოს `1`-დან წევრების წონათა ჯამამდე.',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'SDK-ის მოსალოდნელი ჯაჭვის დისკრიმინანტით კონფიგურაციის შემდეგ, მნიშვნელობა გააანალიზეთ როგორც `AccountId` და დაბრუნებული კანონიკური წარმოდგენა შეადარეთ კიდეებზე ნებადართული ცარიელი სივრცისგან გასუფთავებულ შესატანს.',
    'For an untrusted string, a conforming application should:': 'არასანდო სტრიქონისთვის შესაბამისმა აპლიკაციამ უნდა:',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. სრული მნიშვნელობის გარშემო მხოლოდ ნებადართული სატრანსპორტო ცარიელი სივრცე მოაშორეთ.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. წაიკითხეთ სენტინელი და მოითხოვეთ მოსალოდნელი ჯაჭვის დისკრიმინანტი.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. დარჩენილი ყოველი `Unicode` სიმბოლო ზუსტი 105-სიმბოლოიანი ანბანით ასახეთ.',
    '4. Split off the six checksum digits.': '4. გამოყავით საკონტროლო ჯამის ექვსი ციფრი.',
    '6. Verify the checksum over those canonical bytes.': '6. ამ კანონიკურ ბაიტებზე საკონტროლო ჯამი გადაამოწმეთ.',
    '- a valid public key': '- მოქმედი საჯარო გასაღები',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId` კანონიკურად წარმოადგინეთ მოსალოდნელი დისკრიმინანტისთვის.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. მოითხოვეთ `byte-for-byte` ტოლობა კიდეებზე ნებადართული ცარიელი სივრცისგან გასუფთავებულ შესატანთან.',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      'საკონტროლო ჯამის წარმატებული შემოწმება ან დაბალი დონის `AccountAddress`-ის პარსინგი ამ შემოწმებას ვერ ჩაანაცვლებს.',
    '- an account alias such as `alice@wonderland.universal`':
      '- ანგარიშის ალიასი, მაგალითად `alice@wonderland.universal`',
    '- an I105 literal with an appended `@domain` suffix':
      '- I105 ლიტერალი, რომელსაც ბოლოში დამატებული აქვს `@domain` სუფიქსი',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      'აპლიკაციის საზღვარზე ალიასები ამოხსენით და დაბრუნებული კანონიკური I105 ID შეინარჩუნეთ ავტორიზაციის, ხელმოწერის, ნებართვებისა და აუდიტის ჩანაწერებისთვის.',
    '| `ERR_INVALID_PUBLIC_KEY`         | The key is invalid for the algorithm selected by its `CurveId`      |':
      '| `ERR_INVALID_PUBLIC_KEY` | გასაღები არასწორია მისი `CurveId`-ის მიერ არჩეული ალგორითმისთვის |',
    '| `ERR_I105_TOO_SHORT`             | The body cannot contain both payload and checksum                   |':
      '| `ERR_I105_TOO_SHORT` | სხეული ვერ შეიცავს ერთდროულად სასარგებლო დატვირთვასა და საკონტროლო ჯამს |',
    '- Never substitute an account alias for an I105 ID.': '- არასოდეს გამოიყენოთ ანგარიშის ალიასი I105 ID-ის ნაცვლად.',
    '- Use a collation that preserves letter case and character width.':
      '- გამოიყენეთ კოლაცია, რომელიც ინარჩუნებს ასოების რეგისტრსა და სიმბოლოს სიგანეს.',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- ალიასიდან ხელახლა აგების ნაცვლად გამოიყენეთ შენახული კანონიკური ID.',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'როდესაც გარე ანგარიშის ID არის საჭირო, გამოიძახეთ `AccountAddress`-ის ცხადი I105 ენკოდერი.',
  },
  kk: {
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      '`treasury@payments.universal` сияқты мән — I105 ID-дің басқа жазылуы емес, тіркелгі бүркеншік аты.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Әріптердің үлкен-кішілігін сақтаңыз және `Unicode` қалыпқа келтіруін қолданбаңыз.',
    '- A regular expression is not an I105 validator.': '- Тұрақты өрнек I105 валидаторы емес.',
    'A decoder must enforce the expected discriminant.':
      'Декодер күтілетін дискриминанттың сәйкестігін міндетті түрде қамтамасыз етуі тиіс.',
    'They do not materialize an `AccountId`.': 'Олар `AccountId` нысанын жасамайды.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Авторизациялау немесе тұрақты сақтауға жазу алдында `AccountId` қатаң тексеруін қолданыңыз.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, енді түрлендіруді, әріп регистрін бүктеуді немесе ұқсас таңбамен алмастыруды қолданбаңыз.',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Жарамды саясатта кемінде бір мүше, оң салмақтар болуы, қайталанатын ашық кілттер болмауы және шек `1`-ден мүшелер салмақтарының қосындысына дейін болуы тиіс.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` | Резервтелген `extension flag` |',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. Сентинелді оқып, күтілетін тізбек дискриминантын талап етіңіз.',
    '4. Split off the six checksum digits.': '4. Бақылау сомасының алты цифрын бөліп алыңыз.',
    '- exact field lengths': '- өрістердің дәл ұзындықтары',
    '- a supported `CurveId`': '- қолдау көрсетілетін `CurveId`',
    '- a valid public key': '- жарамды ашық кілт',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId` мәнін күтілетін дискриминант үшін канондық түрде көрсетіңіз.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Қырқылған кіріспен `byte-for-byte` теңдікті талап етіңіз.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Қолданбаның нақты соңғы `render-and-compare` қадамы минималды емес сандық сентинелдерді, канондық емес контроллер орналасуларын, қайта реттелген саясат материалын және декодталатын, бірақ кодтаушының ағымдағы V1 шығысына жатпайтын кез келген басқа жазылымды қабылдамайды.',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      'Қолданба шекарасында бүркеншік аттарды шешіп, авторизациялау, қол қою, рұқсаттар және аудит жазбалары үшін қайтарылған канондық I105 ID мәнін сақтаңыз.',
    '- Never substitute an account alias for an I105 ID.':
      '- Ешқашан I105 ID орнына тіркелгі бүркеншік атын қолданбаңыз.',
    '- Use a collation that preserves letter case and character width.':
      '- Әріптердің үлкен-кішілігі мен таңба енін сақтайтын салыстыру ережесін қолданыңыз.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId` дисплейі мен JSON көрсетілімі канондық I105 пішімін пайдаланады.',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Төменгі деңгейдегі `AccountAddress` дисплейі/JSON көрсетілімі ішкі және жөндеу контекстерінде канондық он алтылық пішімді пайдаланады.',
  },
  mn: {
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      '`treasury@payments.universal` зэрэг утга нь I105 ID-ийн өөр бичлэг биш, дансны alias юм.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Үсгийн том, жижиг хэлбэрийг хэвээр хадгалж, `Unicode` нормчлол бүү хэрэглэ.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID нь `@domain` эсвэл `@domain.dataspace` дагавартай байж болохгүй.',
    '- A regular expression is not an I105 validator.': '- Тогтмол илэрхийлэл нь I105 баталгаажуулагч биш.',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Payload |`base-105` каноник дансны controller байтын кодлол |Хамрагдана |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '|Хяналтын нийлбэр |I105 цагаан толгойгоор дүрслэгдсэн зургаан `Bech32m` маягийн `5-bit` утга |N/A |',
    'The payload and checksum identify the account controller.':
      'Payload болон хяналтын нийлбэр нь дансны controller-ийг тодорхойлно.',
    'The sentinel selects the network context.': 'Sentinel нь сүлжээний контекстийг сонгоно.',
    'A decoder must enforce the expected discriminant.':
      'Декодер нь хүлээгдэж буй дискриминантыг заавал шалган мөрдүүлэх ёстой.',
    'The checksum cannot detect a sentinel substitution.':
      'Хяналтын нийлбэр нь sentinel-ийг сольсныг илрүүлэх боломжгүй.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Эдгээр нь sentinel, цагаан толгой, хяналтын нийлбэр, байтын урт, `CurveId`/түлхүүрийн хэлбэр болон хаягийн түвшний яг ижил дахин кодлолтыг шалгана.',
    'They do not materialize an `AccountId`.': 'Эдгээр нь `AccountId` үүсгэдэггүй.',
    'They do not prove that the header class matches the controller.':
      'Эдгээр нь header-ийн ангилал controller-той тохирч байгааг нотлохгүй.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Зөвшөөрөл олгох эсвэл байнгын хадгалалт хийхээс өмнө `AccountId`-ийн хатуу баталгаажуулалт хэрэглэнэ.',
    'For a private network, use its configured discriminant explicitly with `--network-prefix`.':
      'Хувийн сүлжээнд түүний тохируулсан дискриминантыг `--network-prefix`-ээр ил тод зааж хэрэглэнэ.',
    'It does not register the account on the target network or prove that the same controller should be reused there.':
      'Энэ нь зорилтот сүлжээнд дансыг бүртгэхгүй бөгөөд ижил controller-ийг тэнд дахин ашиглах ёстойг нотлохгүй.',
    'Leading zero bytes are preserved as zero-valued `base-105` digits.':
      'Эхний тэг байтуудыг тэг утгатай `base-105` цифрүүд болгон хадгална.',
    'The six checksum values are in the range `0..31` and are rendered through the same I105 alphabet as the payload.':
      'Хяналтын нийлбэрийн зургаан утга `0..31` мужид байх бөгөөд payload-тай адил I105 цагаан толгойгоор дүрслэгдэнэ.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, өргөн хувиргалт, үсгийн том/жижиг хэлбэрийг нэгтгэх эсвэл төстэй дүрстэй тэмдэгтээр орлуулахыг бүү хэрэглэ.',
    '### Header byte {#header-byte}': '### Header байт {#header-byte}',
    '| Bits   | Width |       Current encoder output | Meaning                      |':
      '|Битүүд |Өргөн |Одоогийн кодлогчийн гаралт |Утга |',
    '| `7..5` |     3 |                          `0` | Address format version field |':
      '| `7..5` |     3 |                          `0` |Хаягийн форматын хувилбарын талбар |',
    '| `4..3` |     2 | `0` single key, `1` multisig | Address class                |':
      '| `4..3` |     2 |`0` нэг түлхүүр, `1` multisig |Хаягийн ангилал |',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` |Нөөцөлсөн `extension flag` |',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '`AccountId` руу хөрвүүлээд түүний каноник дүрслэлийг харьцуулах нь одоогийн V1 каноник хэлбэр мөн болохыг нотолно.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'Түүхий нийтийн түлхүүрийн өгөгдөл хамгийн ихдээ 255 байт бол компакт хэлбэрийг ашиглана:',
    '| Field        |           Width | Value or meaning         |': '|Талбар |Өргөн |Утга |',
    '| Field        |           Width | Value or meaning             |': '|Талбар |Өргөн |Утга |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 байт |Түүхий түлхүүрийн урт |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 байт |Түүхий түлхүүрийн урт, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 байт |Түүхий түлхүүрийн урт |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` байт |Түүхий нийтийн түлхүүрийн өгөгдөл |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` байт |Түүхий нийтийн түлхүүрийн өгөгдөл |',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'Компакт хэлбэрт багтах түлхүүрт өргөтгөсөн кодлол каноник биш.',
    '### Multisig controller {#multisig-controller}': '### Multisig controller {#multisig-controller}',
    '| Field            |    Width | Value or meaning               |': '|Талбар |Өргөн |Утга |',
    '| `members`        | Variable | Repeated member records        |':
      '|`members` |Хувьсах |Давтагдах гишүүний бичлэгүүд |',
    'Each member record is:': 'Гишүүн бүрийн бичлэг:',
    '| Field        |           Width | Meaning                  |': '|Талбар |Өргөн |Утга |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Хүчинтэй policy нь дор хаяж нэг гишүүнтэй, эерэг жинтэй, давхардсан нийтийн түлхүүргүй, threshold нь `1`-ээс гишүүдийн жингийн нийлбэр хүртэл байна.',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Каноник үүсгэлт гишүүдийг гарын үсгийн алгоритмын тогтвортой нэр, тэг тусгаарлагч байт, дараа нь түүхий нийтийн түлхүүрийн байтаар эрэмбэлнэ.',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## AccountId-ийн хатуу баталгаажуулалт ба каноник байдал {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'SDK-г хүлээгдэж буй сүлжээний дискриминантаар тохируулсны дараа `AccountId` болгон задлан шинжилж, буцаасан каноник дүрслэлийг захын зайг авсан оролттой харьцуулна.',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. Бүхэл утгын эргэн тойронд тээвэрлэлтийн зөвшөөрөгдсөн хоосон зайг л тайрна.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. Sentinel-ийг уншиж, хүлээгдэж буй сүлжээний дискриминантыг шаард.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. Үлдсэн `Unicode` тэмдэг бүрийг яг 105 тэмдэгтэй цагаан толгойгоор хөрвүүл.',
    '4. Split off the six checksum digits.': '4. Хяналтын нийлбэрийн зургаан цифрийг салга.',
    '5. Convert the payload digits back to canonical bytes.':
      '5. Payload-ийн цифрүүдийг каноник байт руу буцаан хөрвүүл.',
    '6. Verify the checksum over those canonical bytes.': '6. Тэдгээр каноник байтын хяналтын нийлбэрийг шалга.',
    '7. Parse the header and controller, requiring:': '7. Header болон controller-ийг задлан, дараахыг шаард:',
    '- exact field lengths': '- талбаруудын яг урт',
    '- a supported `CurveId`': '- дэмжигдсэн `CurveId`',
    '- a valid public key': '- хүчинтэй нийтийн түлхүүр',
    '- no trailing bytes': '- төгсгөлийн илүү байтгүй байх',
    '- a valid multisig policy when applicable': '- хэрэглэх тохиолдолд хүчинтэй multisig policy',
    '8. Construct an `AccountId`.': '8. `AccountId` үүсгэ.',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId`-ийг хүлээгдэж буй дискриминантад каноник байдлаар дүрсэл.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Захын зайг авсан оролттой `byte-for-byte` ижил байхыг шаард.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Хэрэглээний эцсийн тодорхой `render-and-compare` алхам нь хамгийн бага бус тоон sentinel-үүд, каноник бус controller байрлалууд, дахин эрэмбэлэгдсэн policy материал болон декодлогддог боловч encoder-ийн одоогийн V1 гаралт биш бусад бүх бичлэгийг няцаана.',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      'Хяналтын нийлбэр амжилттай байх эсвэл доод түвшний `AccountAddress` задлалт энэ шалгалтыг орлохгүй.',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- Том эсвэл жижиг үсэг, тэмдэгтийн өргөн, `kana`, payload эсвэл хяналтын нийлбэр нь өөрчлөгдсөн тэмдэгт мөр',
    '- Use a collation that preserves letter case and character width.':
      '- Үсгийн том, жижиг хэлбэр болон тэмдэгтийн өргөнийг хадгалдаг эрэмбэлэлтийг ашигла.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- Экспортолсон дансны өгөгдөл болон нөөц хуулбарт chain discriminant эсвэл нэрлэсэн network profile-ийг хамт хадгал.',
    '- Reuse an address only with its network context.':
      '- Хаягийг зөвхөн өөрийнх нь сүлжээний контексттэй хамт дахин ашигла.',
    '- Display the complete address and provide a copy action.': '- Бүрэн хаягийг харуулж, хуулах үйлдэл өг.',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- Alias-аас дахин бүтээхийн оронд хадгалсан каноник ID-г ашигла.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId`-ийн дэлгэц болон JSON дүрслэл каноник I105-г ашиглана.',
  },
  my: {
    '- Select the network profile before encoding or validating an address.':
      '- လိပ်စာကို ကုဒ်သွင်းခြင်း သို့မဟုတ် အတည်ပြုခြင်း မပြုမီ ကွန်ရက်ပရိုဖိုင်ကို ရွေးပါ။',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- စာလုံးအကြီးအသေးကို မပြောင်းဘဲ ထိန်းသိမ်းပြီး `Unicode` normalization ကို မပြုလုပ်ပါနှင့်။',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID တွင် `@domain` သို့မဟုတ် `@domain.dataspace` နောက်ဆက် မပါရပါ။',
    '- A regular expression is not an I105 validator.': '- regular expression သည် I105 validator မဟုတ်ပါ။',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| အပိုင်း | ရည်ရွယ်ချက် | checksum လွှမ်းခြုံမှု |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| ကွန်ရက် sentinel | စာသားကို `u16` chain discriminant တစ်ခုနှင့် ချိတ်ဆက်ပေးသည် | checksum မလွှမ်းခြုံ |',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '| payload | canonical account-controller bytes များ၏ `base-105` encoding | checksum လွှမ်းခြုံ |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| checksum | I105 alphabet ဖြင့် ဖော်ပြသော `Bech32m` ပုံစံ `5-bit` တန်ဖိုး ခြောက်ခု | N/A |',
    'The payload and checksum identify the account controller.':
      'payload နှင့် checksum တို့က account controller ကို သတ်မှတ်ပေးသည်။',
    'The same controller has the same payload and checksum on Taira and Minamoto, but each network uses a different leading sentinel.':
      'တူညီသော controller ၏ payload နှင့် checksum သည် Taira နှင့် Minamoto နှစ်ခုလုံးတွင် တူညီသော်လည်း ကွန်ရက်တစ်ခုစီတွင် ရှေ့ဆုံး sentinel မတူညီပါ။',
    'A decoder must enforce the expected discriminant.':
      'decoder သည် မျှော်မှန်းထားသော discriminant ကို မဖြစ်မနေ စစ်ဆေးရမည်။',
    'Choosing an endpoint or chain ID does not implicitly choose the address profile.':
      'endpoint သို့မဟုတ် chain ID ကို ရွေးခြင်းက address profile ကို အလိုအလျောက် ရွေးပေးခြင်းမဟုတ်ပါ။',
    "The Taira form applies Taira's sentinel to the same payload:":
      'Taira ပုံစံသည် တူညီသော payload ပေါ်တွင် Taira sentinel ကို အသုံးပြုသည်:',
    'The `convert`, `normalize`, and `audit` commands operate on the lower-level `AccountAddress` codec.':
      '`convert`၊ `normalize` နှင့် `audit` command များသည် low-level `AccountAddress` codec ပေါ်တွင် လုပ်ဆောင်သည်။',
    'They do not by themselves validate all multisig policy semantics.':
      '၎င်းတို့တစ်ခုတည်းဖြင့် multisig policy semantics အားလုံးကို အတည်မပြုနိုင်ပါ။',
    'Use strict `AccountId` validation before authorization or persistence.':
      'authorization သို့မဟုတ် persistent storage မပြုမီ တင်းကျပ်သော `AccountId` validation ကို အသုံးပြုပါ။',
    'It does not register the account on the target network or prove that the same controller should be reused there.':
      '၎င်းသည် target network ပေါ်တွင် account ကို register မလုပ်သလို တူညီသော controller ကို ထိုနေရာတွင် ပြန်သုံးသင့်ကြောင်းလည်း သက်သေမပြပါ။',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC၊ NFKC၊ width conversion၊ case folding သို့မဟုတ် ရုပ်ဆင်တူသင်္ကေတဖြင့် အစားထိုးခြင်းကို မပြုလုပ်ပါနှင့်။',
    'All multi-byte integers below are unsigned and `big-endian`.':
      'အောက်ပါ multi-byte integer အားလုံးသည် unsigned ဖြစ်ပြီး `big-endian` ဖြစ်သည်။',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'raw public-key payload သည် 255 ဘိုက်အထိသာ ရှိပါက compact form ကို အသုံးပြုပါ:',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '| `public_key` | `key_len` ဘိုက် | raw public-key payload |',
    'Keys longer than 255 bytes use the extended form:':
      '255 ဘိုက်ထက်ရှည်သော key များသည် extended form ကို အသုံးပြုသည်:',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'compact form နှင့် ကိုက်ညီသော key အတွက် extended encoding သည် canonical မဟုတ်ပါ။',
    '| `threshold`      |  2 bytes | Required total approval weight |':
      '| `threshold` | 2 ဘိုက် | လိုအပ်သော approval weight စုစုပေါင်း |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'မှန်ကန်သော policy တစ်ခုတွင် အနည်းဆုံး member တစ်ဦး၊ သုညထက်ကြီးသော weight များ၊ duplicate public key မရှိခြင်းနှင့် `1` မှ member weight စုစုပေါင်းအထိရှိသည့် threshold တစ်ခု ပါရမည်။',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Canonical construction သည် member များကို signing algorithm ၏ stable name၊ zero separator byte၊ ထို့နောက် raw public-key bytes အလိုက် စီစဉ်သည်။',
    'For an untrusted string, a conforming application should:':
      'မယုံကြည်ရသော string တစ်ခုအတွက် စံနှုန်းနှင့်ကိုက်ညီသော application သည် အောက်ပါတို့ကို လုပ်ဆောင်သင့်သည်:',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. တန်ဖိုးအပြည့်၏ အစနှင့်အဆုံးရှိ ခွင့်ပြုထားသော transport whitespace ကိုသာ trim လုပ်ပါ။',
    '4. Split off the six checksum digits.': '4. checksum digit ခြောက်လုံးကို ခွဲထုတ်ပါ။',
    '7. Parse the header and controller, requiring:':
      '7. header နှင့် controller ကို parse လုပ်ပြီး အောက်ပါတို့ကို လိုအပ်ပါသည်:',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. မျှော်မှန်းထားသော discriminant အတွက် `AccountId` ကို canonical ပုံစံဖြင့် render လုပ်ပါ။',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. trimmed input နှင့် `byte-for-byte` တူညီမှုကို လိုအပ်သည်။',
    'Do not accept these values in a strict account-ID field:':
      'တင်းကျပ်သော account-ID field တွင် ဤတန်ဖိုးများကို လက်မခံပါနှင့်:',
    '- an I105 literal with an appended `@domain` suffix': '- အဆုံးတွင် `@domain` suffix ထည့်ထားသော I105 literal',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- စာလုံးအကြီးအသေး၊ character width၊ `kana`၊ payload သို့မဟုတ် checksum ပြောင်းလဲထားသော string',
    '| `ERR_INVALID_PUBLIC_KEY`         | The key is invalid for the algorithm selected by its `CurveId`      |':
      '| `ERR_INVALID_PUBLIC_KEY` | key သည် ၎င်း၏ `CurveId` ရွေးထားသော algorithm အတွက် မမှန်ကန်ပါ |',
    '- Send the exact I105 UTF-8 string in JSON account fields.':
      '- တိကျသော I105 UTF-8 string ကို JSON account field များတွင် ပို့ပါ။',
    '- `Percent-encode` the complete account ID before placing it in a URL path segment.':
      '- account ID အပြည့်ကို URL path segment ထဲ မထည့်မီ `Percent-encode` လုပ်ပါ။',
    '- Never substitute an account alias for an I105 ID.':
      '- I105 ID အစား account alias ကို မည်သည့်အခါမျှ မသုံးပါနှင့်။',
    '- Use a collation that preserves letter case and character width.':
      '- စာလုံးအကြီးအသေးနှင့် character width ကို ထိန်းသိမ်းသော collation ကို အသုံးပြုပါ။',
    '- Reuse an address only with its network context.': '- လိပ်စာကို ၎င်း၏ network context နှင့်သာ ပြန်လည်အသုံးပြုပါ။',
    '- Display the complete address and provide a copy action.': '- လိပ်စာအပြည့်အစုံကို ပြသပြီး copy action ကို ပေးပါ။',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'ပြင်ပ account ID လိုအပ်ပါက explicit `AccountAddress` I105 encoder ကို ခေါ်သုံးပါ။',
  },
  pt: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Preserve exatamente o uso de maiúsculas e minúsculas e não aplique normalização `Unicode`.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'Não aplique NFC, NFKC, conversão de largura, dobramento de maiúsculas/minúsculas ou substituição por caracteres visualmente semelhantes.',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 byte |Comprimento da chave bruta |',
    '| `key_len`    |         2 bytes | Raw key length           |':
      '|`key_len` |2 bytes |Comprimento da chave bruta |',
    '4. Split off the six checksum digits.': '4. Separe os seis dígitos da soma de verificação.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Verifique a soma de verificação sobre esses bytes canônicos.',
    '- Never substitute an account alias for an I105 ID.': '- Nunca use um alias de conta no lugar de um I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Use uma colação que preserve maiúsculas e minúsculas e a largura dos caracteres.',
    '- Preserve every `kana` character exactly.': '- Preserve exatamente cada caractere `kana`.',
    '- Keep the full address available when a compact display shortens its middle.':
      '- Mantenha o endereço completo disponível quando uma exibição compacta encurtar a parte central.',
    '`AccountId` display and JSON use canonical I105.':
      'A exibição de `AccountId` e sua representação JSON usam I105 canônico.',
  },
  ru: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Сохраняйте регистр букв и не применяйте нормализацию `Unicode`.',
    'The transaction-chain ID and the I105 chain discriminant are separate values.':
      'ID цепочки транзакций и дискриминатор цепочки I105 — это разные значения.',
    'They do not materialize an `AccountId`.': 'Эти команды не создают объект `AccountId`.',
    'They do not by themselves validate all multisig policy semantics.':
      'Эти команды сами по себе не проверяют всю семантику политики мультиподписи.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Используйте строгую проверку `AccountId` перед авторизацией или постоянным сохранением.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'Не применяйте NFC, NFKC, преобразование ширины символов, приведение регистра или замену визуально похожих символов.',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      'Домен, пространство данных, псевдоним, UAID и байты метаданных учётной записи отсутствуют.',
    '`CurveId` registry value': 'Значение из реестра `CurveId`',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. Удалите только разрешённые при передаче пробельные символы вокруг всего значения.',
    '4. Split off the six checksum digits.': '4. Отделите шесть цифр контрольной суммы.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Проверьте контрольную сумму для этих канонических байтов.',
    '- no trailing bytes': '- отсутствие лишних байтов в конце',
    '- a valid multisig policy when applicable': '- допустимая политика мультиподписи, если применимо',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. Сформируйте каноническое представление `AccountId` для ожидаемого дискриминатора.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Требуйте равенства `byte-for-byte` со входной строкой после удаления пробелов по краям.',
    'The body cannot contain both payload and checksum':
      'Тело слишком короткое, чтобы вместить и полезную нагрузку, и контрольную сумму',
    '- Never substitute an account alias for an I105 ID.':
      '- Никогда не используйте псевдоним учётной записи вместо I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Используйте правило сортировки и сравнения, сохраняющее регистр букв и ширину символов.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- Храните дискриминатор цепочки или именованный профиль сети вместе с экспортированными данными учётной записи и резервными копиями.',
    '`AccountId` display and JSON use canonical I105.':
      'Для отображения `AccountId` и его представления в JSON используется канонический формат I105.',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Низкоуровневое представление `AccountAddress` для отображения и JSON использует канонический шестнадцатеричный формат во внутренних контекстах и при отладке.',
  },
  ur: {
    '- Store and compare the canonical UTF-8 string exactly.':
      '- کینونیکل UTF-8 سٹرنگ کو بعینہٖ ذخیرہ کریں اور اسی طرح اس کا موازنہ کریں۔',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- حروف کی بڑی/چھوٹی حالت برقرار رکھیں اور `Unicode` نارملائزیشن لاگو نہ کریں۔',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| چیک سم | I105 حروفِ تہجی میں دکھائی گئی `Bech32m` طرز کی چھ `5-bit` قدریں | N/A |',
    'The payload and checksum identify the account controller.': 'پے لوڈ اور چیک سم اکاؤنٹ کنٹرولر کی شناخت کرتے ہیں۔',
    'The named values always use their named sentinel.': 'نام زدہ اقدار ہمیشہ اپنا نام زدہ سینٹینل استعمال کرتی ہیں۔',
    'Use strict `AccountId` validation before authorization or persistence.':
      'اختیار دہی یا مستقل ذخیرہ کرنے سے پہلے سخت `AccountId` توثیق استعمال کریں۔',
    'When converting an existing address between explicit contexts, also supply the source with `--expect-prefix`:':
      'کسی موجودہ پتے کو واضح سیاقوں کے درمیان تبدیل کرتے وقت، ماخذ کا سابقہ بھی `--expect-prefix` کے ذریعے فراہم کریں:',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'چیک سم `Bech32` کے `polymod` جنریٹرز اور مستقل `0x2bc830a3` استعمال کرتا ہے۔',
    'The checksum-only HRP is the ASCII string `snx`.': 'صرف چیک سم کے لیے HRP، ASCII سٹرنگ `snx` ہے۔',
    'The checksum-only HRP is not printed in the address.': 'صرف چیک سم کے لیے HRP ایڈریس میں شامل نہیں کیا جاتا۔',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0` | 1 | `0` | محفوظ `extension flag` |',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'جب خام عوامی کلید کا پے لوڈ زیادہ سے زیادہ 255 بائٹس ہو تو کمپیکٹ شکل استعمال کریں:',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'جو کلید کمپیکٹ شکل میں سما سکتی ہو، اس کے لیے توسیعی انکوڈنگ کینونیکل نہیں ہے۔',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'کینونیکل تشکیل ارکان کو پہلے دستخطی الگورتھم کے مستحکم نام، پھر صفر جداکار بائٹ، اور اس کے بعد خام عوامی کلید کے بائٹس کے لحاظ سے ترتیب دیتی ہے۔',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'متوقع چین ڈسکرمننٹ کے ساتھ SDK کو کنفیگر کرنے کے بعد، قدر کو `AccountId` کے طور پر پارس کریں اور واپس آنے والی کینونیکل نمائندگی کا موازنہ کناروں کی اجازت یافتہ خالی جگہ ہٹائی ہوئی ان پٹ سے کریں۔',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. مکمل قدر کے اردگرد صرف اجازت یافتہ ترسیلی خالی جگہ کو ہٹائیں۔',
    '4. Split off the six checksum digits.': '4. چیک سم کے چھ ہندسوں کو الگ کریں۔',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. متوقع ڈسکرمننٹ کے لیے `AccountId` کو کینونیکل صورت میں پیش کریں۔',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. کناروں کی خالی جگہ ہٹائی ہوئی ان پٹ کے ساتھ `byte-for-byte` برابری لازم کریں۔',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'ایپلی کیشن کا واضح آخری `render-and-compare` مرحلہ غیر کم سے کم عددی سینٹینلز، غیر کینونیکل کنٹرولر لے آؤٹس، دوبارہ ترتیب دیے گئے پالیسی مواد، اور ہر ایسی دوسری املا کو مسترد کرتا ہے جو ڈی کوڈ تو ہو سکتی ہو لیکن انکوڈر کا موجودہ V1 آؤٹ پٹ نہ ہو۔',
    '- an account alias such as `alice@wonderland.universal`': '- اکاؤنٹ کا عرف، مثلاً `alice@wonderland.universal`',
    '- an I105 literal with an appended `@domain` suffix': '- ایک I105 لٹرل جس کے آخر میں `@domain` لاحقہ شامل ہو',
    '- an address for the wrong chain discriminant': '- غلط چین ڈسکرمننٹ کے لیے ایڈریس',
    '| `ERR_UNKNOWN_CURVE`              | The controller declares an unassigned or unavailable `CurveId`      |':
      '| `ERR_UNKNOWN_CURVE` | کنٹرولر ایک غیر مختص یا غیر دستیاب `CurveId` کا اعلان کرتا ہے |',
    '- Never substitute an account alias for an I105 ID.': '- کبھی بھی I105 ID کی جگہ اکاؤنٹ کا عرف استعمال نہ کریں۔',
    '- Use a collation that preserves letter case and character width.':
      '- ایسا تقابلی ترتیب نامہ استعمال کریں جو حروف کی بڑی/چھوٹی حالت اور حروف کی چوڑائی برقرار رکھے۔',
    '- Display the complete address and provide a copy action.':
      '- مکمل ایڈریس دکھائیں اور اسے نقل کرنے کی سہولت فراہم کریں۔',
    '- Preserve every `kana` character exactly.': '- ہر `kana` حرف کو بعینہٖ محفوظ رکھیں۔',
  },
  uz: {
    Part: 'Qism',
    Purpose: 'Maqsad',
    'Checksum coverage': 'Tekshiruv summasi qamrovi',
    'Network sentinel': 'Tarmoq sentineli',
    'Maps the text to one `u16` chain discriminant': 'Matnni bitta `u16` zanjir diskriminantiga moslaydi',
    'Not covered': 'Qamrab olinmagan',
    Payload: 'Foydali yuk',
    '`base-105` encoding of the canonical account-controller bytes':
      'Kanonik hisob boshqaruvchisi baytlarining `base-105` kodlanishi',
    Covered: 'Qamrab olingan',
    Checksum: 'Tekshiruv summasi',
    'Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet':
      'I105 alifbosi orqali ifodalangan `Bech32m` uslubidagi oltita `5-bit` qiymat',
    'A decoder must enforce the expected discriminant.': 'Dekoder kutilgan diskriminantni majburiy tekshirishi kerak.',
    'The checksum cannot detect a sentinel substitution.':
      'Tekshiruv summasi sentinel almashtirilganini aniqlay olmaydi.',
    '### Network sentinels {#network-sentinels}': '### Tarmoq sentinellari {#network-sentinels}',
    'Network or context': 'Tarmoq yoki kontekst',
    'Chain discriminant': 'Zanjir diskriminanti',
    Hex: 'Hex',
    'Canonical sentinel': 'Kanonik sentinel',
    'The named values always use their named sentinel.':
      'Nomli qiymatlar uchun har doim ularning nomli sentineli ishlatiladi.',
    'Choosing an endpoint or chain ID does not implicitly choose the address profile.':
      'Endpoint yoki zanjir ID sini tanlash manzil profilini avtomatik ravishda tanlamaydi.',
    "The Taira form applies Taira's sentinel to the same payload:":
      'Taira shakli ayni shu foydali yukga Taira sentinelini qo‘llaydi:',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Ular sentinel, alifbo, tekshiruv summasi, bayt uzunliklari, `CurveId`/kalit tuzilishi va manzil qatlamining aynan qayta kodlanishini tekshiradi.',
    'They do not materialize an `AccountId`.': 'Ular `AccountId` obyektini hosil qilmaydi.',
    'They do not prove that the header class matches the controller.':
      'Ular sarlavha sinfi boshqaruvchiga mos kelishini isbotlamaydi.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Avtorizatsiya yoki doimiy saqlashdan oldin qat’iy `AccountId` tekshiruvidan foydalaning.',
    'The `base-105` body encodes a binary account payload, not a public-key string and not a Norito JSON object:':
      '`base-105` tanasi ochiq kalit satrini yoki Norito JSON obyektini emas, ikkilik hisob foydali yukini kodlaydi:',
    'Reserved `extension flag`': 'Zaxiralangan `extension flag`',
    'An `extension flag` of `1` is rejected.': '`extension flag` qiymati `1` bo‘lsa, u rad etiladi.',
    'The low-level decoder can preserve other version and normalization bit values and does not independently cross-check the class against the controller tag.':
      'Quyi darajadagi dekoder boshqa versiya va normallashtirish bit qiymatlarini saqlab qolishi mumkin, ammo sinfni boshqaruvchi tegi bilan mustaqil ravishda o‘zaro tekshirmaydi.',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '`AccountId` ga aylantirish va uning kanonik ko‘rinishini taqqoslash joriy V1 kanonikligini tasdiqlaydi.',
    '1 byte': '1 bayt',
    '2 bytes': '2 bayt',
    '`key_len` bytes': '`key_len` bayt',
    'Raw key length': 'Xom kalit uzunligi',
    'Raw key length, `big-endian`': 'Xom kalit uzunligi, `big-endian`',
    'Raw public-key payload': 'Ochiq kalitning xom foydali yuki',
    'Member approval weight': 'A’zoning tasdiqlash vazni',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Yaroqli siyosatda kamida bitta a’zo, musbat vaznlar va takrorlanmagan ochiq kalitlar bo‘lishi, chegara qiymati esa `1` dan a’zolar vaznlari yig‘indisigacha bo‘lishi kerak.',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Kanonik tuzilish a’zolarni avval imzolash algoritmining barqaror nomi, keyin nol ajratuvchi bayt va undan so‘ng xom ochiq kalit baytlari bo‘yicha saralaydi.',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## Qat’iy AccountId tekshiruvi va kanoniklik {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      "SDK'ni kutilgan zanjir diskriminanti bilan sozlagach, qiymatni `AccountId` sifatida tahlil qiling va qaytarilgan kanonik ko‘rinishni chetki bo‘shliqlari olib tashlangan kirish bilan taqqoslang.",
    'For an untrusted string, a conforming application should:':
      'Ishonchsiz satr uchun talablarga mos ilova quyidagilarni bajarishi kerak:',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. Faqat to‘liq qiymatning boshi va oxiridagi ruxsat etilgan transport bo‘shliqlarini olib tashlang.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. Sentinelni o‘qing va kutilgan zanjir diskriminantini talab qiling.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. Qolgan har bir `Unicode` belgisini aniq 105 belgili alifbo bo‘yicha xaritalang.',
    '4. Split off the six checksum digits.': '4. Tekshiruv summasining olti raqamini ajrating.',
    '5. Convert the payload digits back to canonical bytes.':
      '5. Foydali yuk raqamlarini qayta kanonik baytlarga aylantiring.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Shu kanonik baytlar bo‘yicha tekshiruv summasini tekshiring.',
    '7. Parse the header and controller, requiring:':
      '7. Sarlavha va boshqaruvchini tahlil qilib, quyidagilarni talab qiling:',
    '- exact field lengths': '- maydonlarning aniq uzunliklari',
    '- a supported `CurveId`': '- qo‘llab-quvvatlanadigan `CurveId`',
    '- a valid public key': '- yaroqli ochiq kalit',
    '- no trailing bytes': '- oxirida ortiqcha baytlar yo‘qligi',
    '- a valid multisig policy when applicable': '- tegishli holatda yaroqli multisig siyosati',
    '8. Construct an `AccountId`.': '8. `AccountId` yarating.',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId` obyektini kutilgan diskriminant uchun kanonik tarzda ifodalang.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Chetki bo‘shliqlari olib tashlangan kirish bilan `byte-for-byte` tenglikni talab qiling.',
    '- an I105 literal with an appended `@domain` suffix': '- oxiriga `@domain` suffiksi qo‘shilgan I105 literali',
    '- Never substitute an account alias for an I105 ID.': '- Hech qachon I105 ID o‘rniga hisob aliasini ishlatmang.',
    '- Send the exact I105 UTF-8 string in JSON account fields.':
      '- JSON hisob maydonlarida aynan I105 UTF-8 satrini yuboring.',
    '- Use a collation that preserves letter case and character width.':
      '- Harf registri va belgi kengligini saqlaydigan kollatsiyadan foydalaning.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- Zanjir diskriminantini yoki nomlangan tarmoq profilini eksport qilingan hisob ma’lumotlari va zaxira nusxalari bilan birga saqlang.',
    '- Preserve every `kana` character exactly.': '- Har bir `kana` belgisini aynan saqlang.',
    'The body cannot contain both payload and checksum':
      'Tana foydali yuk va tekshiruv summasining ikkalasini ham sig‘dira olmaydi',
    'Deriving an I105 ID does not register or fund the account.':
      "I105 ID'ni hosil qilish hisobni ro‘yxatdan o‘tkazmaydi va uni moliyalashtirmaydi.",
    '- A regular expression is not an I105 validator.': '- Regex I105 validatori emas.',
    'The alphabet is `Unicode`-sensitive.': 'Alifbo `Unicode` kod nuqtalarini aynan farqlaydi.',
    'The exact sequence uses `compatibility-width` Japanese `kana` symbols plus the code points shown for `ヰ` and `ヱ`.':
      'Aniq ketma-ketlik `compatibility-width` formatidagi yapon `kana` belgilaridan hamda `ヰ` va `ヱ` uchun ko\u2018rsatilgan aynan shu kod nuqtalaridan foydalanadi.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC yoki NFKC tarzida normallashtirishni, belgi kengligini o\u2018zgartirishni, harf registrini birxillashtirishni yoki belgilarni ko\u2018rinishi o\u2018xshash boshqa belgilar bilan almashtirishni qo\u2018llamang.',
    'ASCII `0`, `O`, `I`, and `l` are not alphabet symbols.': 'ASCII `0`, `O`, `I` va `l` alifbo belgilari emas.',
  },
  'zh-hans': {
    '- Store and compare the canonical UTF-8 string exactly.': '- 精确存储并比较规范 UTF-8 字符串。',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- 保留字母大小写，且不要应用 `Unicode` 规范化。',
    '- A regular expression is not an I105 validator.': '- 正则表达式不是 I105 验证器。',
    Part: '部分',
    Purpose: '用途',
    'Checksum coverage': '校验和覆盖范围',
    'Network sentinel': '网络 sentinel',
    'Maps the text to one `u16` chain discriminant': '将文本映射到一个 `u16` 链区分符',
    'Not covered': '未覆盖',
    Payload: '有效载荷',
    '`base-105` encoding of the canonical account-controller bytes': '规范账户控制器字节的 `base-105` 编码',
    Covered: '已覆盖',
    Checksum: '校验和',
    'Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet':
      '通过 I105 字母表呈现的六个 `Bech32m` 风格 `5-bit` 值',
    'The payload and checksum identify the account controller.': '有效载荷和校验和标识账户控制器。',
    'The sentinel selects the network context.': 'Sentinel 选择网络上下文。',
    'A decoder must enforce the expected discriminant.': '解码器必须确保链区分符符合预期。',
    'The checksum cannot detect a sentinel substitution.': '校验和无法检测 sentinel 替换。',
    'Network or context': '网络或上下文',
    'Chain discriminant': '链区分符',
    Hex: '十六进制',
    'Canonical sentinel': '规范 sentinel',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      '它们验证 sentinel、字母表、校验和、字节长度、`CurveId`/密钥结构以及地址层的精确重新编码。',
    'They do not prove that the header class matches the controller.': '它们无法证明标头类别与控制器匹配。',
    'Use strict `AccountId` validation before authorization or persistence.':
      '在授权或持久化之前使用严格的 `AccountId` 验证。',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      '不要应用 NFC、NFKC、宽度转换、大小写折叠或相似字符替换。',
    Bits: '位',
    Width: '宽度',
    'Current encoder output': '当前编码器输出',
    Meaning: '含义',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '转换为 `AccountId` 并比较其规范呈现可证明当前 V1 的规范性。',
    Field: '字段',
    'Value or meaning': '值或含义',
    Variable: '可变',
    'Repeated member records': '重复的成员记录',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      '有效策略至少包含一个成员，各权重为正，没有重复公钥，且阈值介于 `1` 与成员权重总和之间。',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## 严格的 AccountId 验证和规范性 {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      '在使用预期链区分符配置 SDK 后，将输入解析为 `AccountId`，并将返回的规范呈现与去除首尾空白后的输入进行比较。',
    '1. Trim only permitted transport whitespace around the complete value.': '1. 仅删除整个值周围允许存在的传输空白。',
    '2. Read the sentinel and require the expected chain discriminant.': '2. 读取 sentinel，并要求链区分符符合预期。',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. 按准确的 105 符号字母表映射其余每个 `Unicode` 符号。',
    '4. Split off the six checksum digits.': '4. 分离出六个校验和数字。',
    '5. Convert the payload digits back to canonical bytes.': '5. 将有效载荷数字转换回规范字节。',
    '6. Verify the checksum over those canonical bytes.': '6. 验证这些规范字节的校验和。',
    '7. Parse the header and controller, requiring:': '7. 解析标头和控制器，并要求：',
    '- exact field lengths': '- 精确的字段长度',
    '- a supported `CurveId`': '- 受支持的 `CurveId`',
    '- a valid public key': '- 有效的公钥',
    '- no trailing bytes': '- 没有尾随字节',
    '- a valid multisig policy when applicable': '- 适用时有效的多重签名策略',
    '8. Construct an `AccountId`.': '8. 构建 `AccountId`。',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. 针对预期的链区分符以规范形式呈现 `AccountId`。',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. 要求与去除首尾空白后的输入 `byte-for-byte` 相等。',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      '校验和成功或低层级 `AccountAddress` 解析不能替代此检查。',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      '其中不包含域、数据空间、别名、UAID 或账户元数据字节。',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- 大写或小写字母、字符宽度、`kana`、有效载荷或校验和被更改的字符串',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      '在应用程序边界解析别名，并保留返回的规范 I105 ID，用于授权、签名、权限和审计记录。',
    '- Never substitute an account alias for an I105 ID.': '- 切勿用账户别名替代 I105 ID。',
    '- Store the canonical string returned by the codec with `byte-preserving` comparison semantics.':
      '- 使用 `byte-preserving` 比较语义存储编解码器返回的规范字符串。',
    '- Use a collation that preserves letter case and character width.': '- 使用保留字母大小写和字符宽度的排序规则。',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- 使用存储的规范 ID，而不是根据别名重新构建它。',
    '`AccountId` display and JSON use canonical I105.': '`AccountId` 的显示和 JSON 表示使用规范 I105。',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      '较低层级的 `AccountAddress` 显示/JSON 表示在内部和调试上下文中使用规范十六进制格式。',
    'Account report, statement, and notification validation': '账户报告、对账单和通知的验证',
    'Apply deterministic heuristics to decide whether compression is worthwhile.':
      '采用确定性启发式方法判断是否值得压缩。',
    'Carry manifest announcements, feedback, key updates, and capability negotiation.':
      '承载清单通告、反馈消息、密钥更新和能力协商。',
    'List committed transactions.': '列出已提交的链上交易。',
    'Return the domain endorsement policy.': '返回链上域的背书政策。',
    'Return on-chain executor configuration parameters.': '返回链上执行器的配置参数。',
    'Supported with requirements': '有条件支持',
  },
  'zh-hant': {
    '- Store and compare the canonical UTF-8 string exactly.': '- 精確儲存並比較規範 UTF-8 字串。',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- 保留字母大小寫，且不要套用 `Unicode` 正規化。',
    '- A regular expression is not an I105 validator.': '- 正規表示式不是 I105 驗證器。',
    Part: '部分',
    Purpose: '用途',
    'Checksum coverage': '校驗和涵蓋範圍',
    'Network sentinel': '網路 sentinel',
    'Maps the text to one `u16` chain discriminant': '將文字映射到一個 `u16` 鏈區分符',
    'Not covered': '未涵蓋',
    Payload: '有效載荷',
    '`base-105` encoding of the canonical account-controller bytes': '規範帳戶控制器位元組的 `base-105` 編碼',
    Covered: '已涵蓋',
    Checksum: '校驗和',
    'Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet':
      '透過 I105 字母表呈現的六個 `Bech32m` 風格 `5-bit` 值',
    'The payload and checksum identify the account controller.': '有效載荷和校驗和識別帳戶控制器。',
    'The sentinel selects the network context.': 'Sentinel 選擇網路上下文。',
    'A decoder must enforce the expected discriminant.': '解碼器必須確保鏈區分符符合預期。',
    'The checksum cannot detect a sentinel substitution.': '校驗和無法偵測 sentinel 替換。',
    'Network or context': '網路或上下文',
    'Chain discriminant': '鏈區分符',
    Hex: '十六進位',
    'Canonical sentinel': '規範 sentinel',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      '它們驗證 sentinel、字母表、校驗和、位元組長度、`CurveId`/金鑰結構以及地址層的精確重新編碼。',
    'They do not prove that the header class matches the controller.': '它們無法證明標頭類別與控制器相符。',
    'Use strict `AccountId` validation before authorization or persistence.':
      '在授權或持久化之前使用嚴格的 `AccountId` 驗證。',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      '不要套用 NFC、NFKC、寬度轉換、大小寫摺疊或相似字元替換。',
    Bits: '位元',
    Width: '寬度',
    'Current encoder output': '目前編碼器輸出',
    Meaning: '含義',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '轉換為 `AccountId` 並比較其規範呈現可證明目前 V1 的規範性。',
    Field: '欄位',
    'Value or meaning': '值或含義',
    Variable: '可變',
    'Repeated member records': '重複的成員記錄',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      '有效策略至少包含一個成員，各權重為正，沒有重複公鑰，且閾值介於 `1` 與成員權重總和之間。',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## 嚴格的 AccountId 驗證和規範性 {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      '在使用預期鏈區分符設定 SDK 後，將輸入解析為 `AccountId`，並將傳回的規範呈現與去除首尾空白後的輸入進行比較。',
    '1. Trim only permitted transport whitespace around the complete value.': '1. 僅刪除整個值周圍允許存在的傳輸空白。',
    '2. Read the sentinel and require the expected chain discriminant.': '2. 讀取 sentinel，並要求鏈區分符符合預期。',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. 按準確的 105 符號字母表映射其餘每個 `Unicode` 符號。',
    '4. Split off the six checksum digits.': '4. 分離出六個校驗和數字。',
    '5. Convert the payload digits back to canonical bytes.': '5. 將有效載荷數字轉換回規範位元組。',
    '6. Verify the checksum over those canonical bytes.': '6. 驗證這些規範位元組的校驗和。',
    '7. Parse the header and controller, requiring:': '7. 解析標頭和控制器，並要求：',
    '- exact field lengths': '- 精確的欄位長度',
    '- a supported `CurveId`': '- 受支援的 `CurveId`',
    '- a valid public key': '- 有效的公鑰',
    '- no trailing bytes': '- 沒有尾隨位元組',
    '- a valid multisig policy when applicable': '- 適用時有效的多重簽名策略',
    '8. Construct an `AccountId`.': '8. 建構 `AccountId`。',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. 針對預期的鏈區分符以規範形式呈現 `AccountId`。',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. 要求與去除首尾空白後的輸入 `byte-for-byte` 相等。',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      '校驗和成功或低層級 `AccountAddress` 解析不能替代此檢查。',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      '其中不包含網域、資料空間、別名、UAID 或帳戶中繼資料位元組。',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- 大寫或小寫字母、字元寬度、`kana`、有效載荷或校驗和被更改的字串',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      '在應用程式邊界解析別名，並保留傳回的規範 I105 ID，用於授權、簽署、權限和稽核記錄。',
    '- Never substitute an account alias for an I105 ID.': '- 切勿以帳戶別名替代 I105 ID。',
    '- Store the canonical string returned by the codec with `byte-preserving` comparison semantics.':
      '- 使用 `byte-preserving` 比較語義儲存編解碼器傳回的規範字串。',
    '- Use a collation that preserves letter case and character width.': '- 使用保留字母大小寫和字元寬度的定序規則。',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- 使用儲存的規範 ID，而不是根據別名重新建構它。',
    '`AccountId` display and JSON use canonical I105.': '`AccountId` 的顯示和 JSON 表示使用規範 I105。',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      '較低層級的 `AccountAddress` 顯示/JSON 表示在內部和偵錯情境中使用規範十六進位格式。',
    'Account report, statement, and notification validation': '帳戶報告、對帳單與通知的驗證',
    'Apply deterministic heuristics to decide whether compression is worthwhile.':
      '採用確定性啟發式方法判斷是否值得壓縮。',
    'Carry manifest announcements, feedback, key updates, and capability negotiation.':
      '承載清單通告、回饋訊息、金鑰更新與能力協商。',
    'List committed transactions.': '列出已提交的鏈上交易。',
    'Return the domain endorsement policy.': '返回鏈上網域的背書政策。',
    'Return on-chain executor configuration parameters.': '返回鏈上執行器的設定參數。',
    'Supported with requirements': '有條件支援',
  },
}

/** Return a reviewed exact translation while preserving surrounding whitespace. */
export function curatedExactTranslation(source: string, locale: DocsLocale): string | undefined {
  const boundary = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source)
  if (!boundary) return undefined
  const translated = CURATED_EXACT_TRANSLATIONS[locale.key]?.[boundary[2]]
  return translated === undefined ? undefined : `${boundary[1]}${translated}${boundary[3]}`
}

/** Return reviewed exact units for generated-document regression checks. */
export function curatedExactTranslationEntries(locale: DocsLocale): ReadonlyArray<readonly [string, string]> {
  return Object.entries(CURATED_EXACT_TRANSLATIONS[locale.key] ?? {})
}

export const NLLB_LANGUAGE_CODES: Readonly<Record<string, string>> = {
  es: 'spa_Latn',
  pt: 'por_Latn',
  fr: 'fra_Latn',
  ru: 'rus_Cyrl',
  ar: 'arb_Arab',
  ur: 'urd_Arab',
  ja: 'jpn_Jpan',
  he: 'heb_Hebr',
  my: 'mya_Mymr',
  ka: 'kat_Geor',
  hy: 'hye_Armn',
  az: 'azj_Latn',
  kk: 'kaz_Cyrl',
  ba: 'bak_Cyrl',
  am: 'amh_Ethi',
  dz: 'dzo_Tibt',
  uz: 'uzn_Latn',
  mn: 'khk_Cyrl',
  'zh-hans': 'zho_Hans',
  'zh-hant': 'zho_Hant',
}

export const TRANSLATION_MINIMUM_RATIO: Readonly<Record<string, number>> = {
  am: 0.35,
  ar: 0.4,
  az: 0.5,
  ba: 0.5,
  dz: 0.5,
  es: 0.5,
  fr: 0.5,
  he: 0.35,
  hy: 0.5,
  ja: 0.25,
  ka: 0.5,
  kk: 0.5,
  mn: 0.5,
  my: 0.5,
  pt: 0.5,
  ru: 0.5,
  ur: 0.5,
  uz: 0.5,
  'zh-hans': 0.25,
  'zh-hant': 0.25,
}

export const SENTENCE_COVERAGE_MINIMUM_RATIO: Readonly<Record<string, number>> = {
  am: 0.49,
  ar: 0.62,
  az: 0.76,
  ba: 0.75,
  dz: 0.78,
  es: 0.82,
  fr: 0.83,
  he: 0.57,
  hy: 0.83,
  ja: 0.42,
  ka: 0.75,
  kk: 0.78,
  mn: 0.79,
  my: 0.87,
  pt: 0.77,
  ru: 0.79,
  ur: 0.67,
  uz: 0.83,
  'zh-hans': 0.25,
  'zh-hant': 0.25,
}

const sentenceSegmenters = new Map<string, Intl.Segmenter>()

export function translationMinimumRatio(localeKey: string): number {
  return TRANSLATION_MINIMUM_RATIO[localeKey] ?? 0.5
}

export function sentenceCoverageMinimumRatio(localeKey: string): number {
  return SENTENCE_COVERAGE_MINIMUM_RATIO[localeKey] ?? 0.7
}

export function sentenceCount(content: string, language: string): number {
  let segmenter = sentenceSegmenters.get(language)
  if (!segmenter) {
    segmenter = new Intl.Segmenter(language, { granularity: 'sentence' })
    sentenceSegmenters.set(language, segmenter)
  }
  return [...segmenter.segment(content)].filter(({ segment }) => /\p{L}/u.test(segment)).length
}

interface FrontmatterDocument {
  frontmatter: string | null
  body: string
}

interface ProtectedMarkdown {
  masked: string
  valueForMarker(marker: string): string | undefined
  restore(translated: string): string
}

type ProtectedMarkerStyle = 'html' | 'identifier'

export interface TranslationProvider {
  readonly engine?: string
  readonly protectedMarkdownMode?: 'inline' | 'inline-identifiers' | 'fragments'
  languageCode?(locale: DocsLocale): string
  translate(text: string, targetLanguage: string): Promise<string>
  translateBatch?(texts: readonly string[], targetLanguage: string): Promise<string[]>
  close?(): Promise<void>
}

interface GenerateOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
  routes?: readonly string[]
  concurrency?: number
  provider?: TranslationProvider
}

interface SynchronizeHeadingAnchorOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
  routes?: readonly string[]
}

type SynchronizeMarkdownStructureOptions = SynchronizeHeadingAnchorOptions

interface NllbProviderOptions {
  python?: string
  model: string
}

interface PendingNllbRequest {
  resolve(translations: string[]): void
  reject(error: Error): void
}

interface NllbResponse {
  id?: unknown
  translations?: unknown
  error?: unknown
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/** Return exact technical tokens whose spelling translations must preserve. */
export function technicalIdentifiers(source: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const pattern of [
    TECHNICAL_TERM_PATTERN,
    CAMEL_CASE_IDENTIFIER_PATTERN,
    UPPERCASE_IDENTIFIER_PATTERN,
    DOMAIN_NAME_PATTERN,
  ]) {
    for (const match of source.matchAll(pattern)) {
      counts.set(match[0], (counts.get(match[0]) ?? 0) + 1)
    }
  }
  const irohaVersionMatches = source.match(/\bIroha 3\b/gu) ?? []
  if (irohaVersionMatches.length > 0) {
    counts.set('Iroha', (counts.get('Iroha') ?? 0) + irohaVersionMatches.length)
  }
  const nexusMatches = source.match(/\bNexus\b/gu) ?? []
  if (nexusMatches.length > 0) counts.set('Nexus', nexusMatches.length)
  return counts
}

function splitFrontmatter(content: string): FrontmatterDocument {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content)
  if (!match) return { frontmatter: null, body: content }
  return {
    frontmatter: match[1],
    body: content.slice(match[0].length),
  }
}

interface MarkdownHeading {
  explicitAnchor?: string
  lineIndex: number
  stableAnchor: string
}

export interface MarkdownContainerDirective {
  indentation: string
  keyword?: string
  lineIndex: number
  title?: string
}

const HEADING_MARKDOWN = new MarkdownIt({ html: true })
const EXPLICIT_HEADING_ANCHOR = /\s+\{#([A-Za-z_][\w:.-]*)\}\s*$/u

function headingText(markdown: string): string {
  const inline = HEADING_MARKDOWN.parseInline(markdown, {})[0]
  return (inline?.children ?? [])
    .filter((token) => token.type === 'text' || token.type === 'code_inline')
    .map((token) => token.content)
    .join('')
}

/** Return stable VitePress heading IDs derived from the English source. */
export function markdownHeadings(source: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = []
  const usedAnchors = new Set<string>()
  const lines = source.split(/\r?\n/u)
  let fence: { character: string; length: number } | undefined

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
      }
      continue
    }
    if (fenceMarker) {
      fence = { character: fenceMarker[1][0], length: fenceMarker[1].length }
      continue
    }

    const heading = /^( {0,3}#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/u.exec(line)
    if (!heading) continue
    const explicitAnchor = EXPLICIT_HEADING_ANCHOR.exec(heading[2])?.[1]
    const baseAnchor = explicitAnchor ?? slugify(headingText(heading[2].replace(EXPLICIT_HEADING_ANCHOR, '')))
    let stableAnchor = baseAnchor
    let duplicateIndex = 1
    while (usedAnchors.has(stableAnchor)) {
      stableAnchor = `${baseAnchor}-${duplicateIndex}`
      duplicateIndex += 1
    }
    usedAnchors.add(stableAnchor)
    headings.push({ explicitAnchor, lineIndex, stableAnchor })
  }

  return headings
}

/** Return VitePress container directives outside fenced code blocks. */
export function markdownContainerDirectives(source: string): MarkdownContainerDirective[] {
  const directives: MarkdownContainerDirective[] = []
  const lines = source.split(/\r?\n/u)
  let fence: { character: string; length: number } | undefined

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
      }
      continue
    }
    if (fenceMarker) {
      fence = { character: fenceMarker[1][0], length: fenceMarker[1].length }
      continue
    }

    const directive = /^( {0,3}):::[ \t]*(?:(\S+)(?:[ \t]+(.*?))?)?[ \t]*$/u.exec(line)
    if (!directive) continue
    directives.push({
      indentation: directive[1],
      keyword: directive[2],
      lineIndex,
      title: directive[3],
    })
  }

  return directives
}

/** Add stable English-derived IDs to every Markdown heading in a document body. */
export function addStableHeadingAnchors(source: string): string {
  const lines = source.split(/\r?\n/u)
  for (const heading of markdownHeadings(source)) {
    if (heading.explicitAnchor) continue
    lines[heading.lineIndex] = `${lines[heading.lineIndex]} {#${heading.stableAnchor}}`
  }
  return lines.join('\n')
}

function stripTrailingWhitespaceOutsideFences(source: string): string {
  const lines = source.split('\n')
  let fence: { character: string; length: number } | undefined

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
        lines[index] = line.replace(/[ \t]+$/u, '')
      }
      continue
    }

    const normalized = line.replace(/[ \t]+$/u, '')
    lines[index] = normalized
    const openingFence = /^ {0,3}(`{3,}|~{3,})/u.exec(normalized)
    if (openingFence) {
      fence = { character: openingFence[1][0], length: openingFence[1].length }
    }
  }

  return lines.join('\n')
}

function applyStableHeadingAnchors(source: string, stableAnchors: readonly string[]): string {
  const lines = source.split(/\r?\n/u)
  const localizedHeadings = markdownHeadings(source)
  if (localizedHeadings.length !== stableAnchors.length) {
    throw new Error(`heading inventory drift (expected ${stableAnchors.length}, found ${localizedHeadings.length})`)
  }
  for (let index = 0; index < localizedHeadings.length; index += 1) {
    const heading = localizedHeadings[index]
    const withoutAnchor = lines[heading.lineIndex].replace(EXPLICIT_HEADING_ANCHOR, '')
    lines[heading.lineIndex] = `${withoutAnchor} {#${stableAnchors[index]}}`
  }
  return lines.join('\n')
}

function applyStableContainerDirectives(
  source: string,
  expectedDirectives: readonly MarkdownContainerDirective[],
): string {
  const lines = source.split(/\r?\n/u)
  const localizedDirectives = markdownContainerDirectives(source)
  if (localizedDirectives.length !== expectedDirectives.length) {
    throw new Error(
      `container directive inventory drift (expected ${expectedDirectives.length}, found ${localizedDirectives.length})`,
    )
  }

  for (let index = 0; index < expectedDirectives.length; index += 1) {
    const expected = expectedDirectives[index]
    const localized = localizedDirectives[index]
    if (!expected.keyword) {
      lines[localized.lineIndex] = `${localized.indentation}:::`
      continue
    }

    let localizedTitle: string | undefined
    if (expected.title) {
      localizedTitle = localized.keyword === expected.keyword ? localized.title : (localized.title ?? localized.keyword)
    }
    lines[localized.lineIndex] =
      `${localized.indentation}::: ${expected.keyword}${localizedTitle ? ` ${localizedTitle}` : ''}`
  }
  return lines.join('\n')
}

async function markdownFiles(directory: string, relative = ''): Promise<string[]> {
  const absolute = path.join(directory, relative)
  const entries = await readdir(absolute, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const child = path.posix.join(relative.split(path.sep).join('/'), entry.name)
      if (entry.isDirectory()) return markdownFiles(directory, child)
      return entry.isFile() && entry.name.endsWith('.md') ? [child] : []
    }),
  )
  return files.flat().sort()
}

async function englishRoutes(sourceRoot: string): Promise<string[]> {
  const localePaths = new Set(TRANSLATED_LOCALES.map((locale) => locale.path))
  return (await markdownFiles(sourceRoot)).filter((route) => {
    const first = route.split('/')[0]
    return first !== 'snippets' && !localePaths.has(first)
  })
}

async function routeDependencies(
  sourceRoot: string,
  sources: ReadonlyMap<string, string>,
): Promise<Map<string, Buffer>> {
  const dependencies = new Map<string, Buffer>()
  const pending = [...sources.entries()]
  const modulePattern = /\b(?:from\s+|import\s*)['"](\.{1,2}\/[^'"]+)['"]/gu

  while (pending.length > 0) {
    const [relativeSource, content] = pending.pop()!
    const sourceDirectory = path.posix.dirname(relativeSource)
    for (const match of content.matchAll(modulePattern)) {
      const dependency = path.posix.normalize(path.posix.join(sourceDirectory, match[1]))
      if (dependency === '..' || dependency.startsWith('../') || path.posix.isAbsolute(dependency)) {
        throw new Error(`${relativeSource}: relative import escapes the documentation source root: ${match[1]}`)
      }
      if (dependencies.has(dependency)) continue
      const bytes = await readFile(path.join(sourceRoot, dependency))
      dependencies.set(dependency, bytes)
      if (/\.(?:[cm]?[jt]s|vue)$/iu.test(dependency)) {
        pending.push([dependency, bytes.toString('utf8')])
      }
    }
  }

  return dependencies
}

async function assertEnglishSnapshot(
  sourceRoot: string,
  availableRoutes: readonly string[],
  sources: ReadonlyMap<string, string>,
  dependencies: ReadonlyMap<string, Buffer>,
): Promise<void> {
  const currentRoutes = await englishRoutes(sourceRoot)
  if (
    currentRoutes.length !== availableRoutes.length ||
    currentRoutes.some((route, index) => route !== availableRoutes[index])
  ) {
    throw new Error('English route inventory changed during translation; discard this run and restart')
  }
  for (const [route, content] of sources) {
    if ((await readFile(path.join(sourceRoot, route), 'utf8')) !== content) {
      throw new Error(`English source changed during translation: ${route}; discard this run and restart`)
    }
  }
  for (const [dependency, content] of dependencies) {
    if (!(await readFile(path.join(sourceRoot, dependency))).equals(content)) {
      throw new Error(
        `English source dependency changed during translation: ${dependency}; discard this run and restart`,
      )
    }
  }
}

async function replaceDirectoryAtomically(current: string, replacement: string, backup: string): Promise<void> {
  let movedCurrent = false
  try {
    await rename(current, backup)
    movedCurrent = true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }

  try {
    await rename(replacement, current)
  } catch (error) {
    if (movedCurrent) await rename(backup, current)
    throw error
  }
  if (movedCurrent) await rm(backup, { recursive: true, force: true })
}

function localizeRoute(route: string, locale: DocsLocale): string {
  const routePath = route.split(/[?#]/u, 1)[0]
  const extension = path.posix.extname(routePath).toLowerCase()
  if (/^\.{1,2}\//u.test(route) && extension && extension !== '.md') {
    return `../${route}`
  }
  if (
    !route.startsWith('/') ||
    route.startsWith('//') ||
    route.startsWith(`/${locale.path}/`) ||
    (extension && extension !== '.md')
  ) {
    return route
  }
  return `/${locale.path}${route}`
}

function localizeLinkSuffix(suffix: string, locale: DocsLocale): string {
  return suffix.replace(
    /^(\]\(\s*)([^)\s]+)([\s\S]*)$/u,
    (_match, prefix: string, target: string, rest: string) => `${prefix}${localizeRoute(target, locale)}${rest}`,
  )
}

function localizeHtmlTag(tag: string, locale: DocsLocale): string {
  return tag.replace(
    /(\bhref\s*=\s*["'])(\/(?!\/)[^"']*)(["'])/giu,
    (_match, prefix: string, target: string, suffix: string) => `${prefix}${localizeRoute(target, locale)}${suffix}`,
  )
}

/**
 * Replace code, identifiers, URLs, and Markdown delimiters with translation-safe
 * symbolic markers. HTML markers use `translate=no`; identifier markers give
 * local models a tokenizer-safe placeholder while retaining paragraph context.
 */
export function protectMarkdown(
  source: string,
  locale: DocsLocale,
  markerStyle: ProtectedMarkerStyle = 'html',
): ProtectedMarkdown {
  const internalValues = new Map<string, string>()
  let sequence = 0
  const protect = (value: string): string => {
    const token = `⟦${sequence}⟧`
    sequence += 1
    internalValues.set(token, value)
    return token
  }

  let masked = source.replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gmu, (block) =>
    protect(block),
  )
  masked = masked.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, (block) => protect(block))
  masked = masked.replace(/^( {0,3}:::[ \t]*(?:[A-Za-z][A-Za-z0-9-]*(?=[ \t]|$))?(?:[ \t]+|$))/gmu, (directive) =>
    protect(directive),
  )
  masked = masked.replace(/(`+)([\s\S]*?)\1/gu, (code) => protect(code))
  masked = masked.replace(/\$\$[\s\S]*?\$\$/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\[[\s\S]*?\\\]/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\((?:(?!\\\))[^\n])*\\\)/gu, (formula) => protect(formula))
  masked = masked.replace(/(?<!\\)\$(?!\s)(?:\\.|[^$\n])+(?<!\s)\$/gu, (formula) => protect(formula))
  masked = masked.replace(/^ {0,3}(?:<{3}|={3})\s+.*$/gmu, (line) => protect(line))
  masked = masked.replace(/^ {0,3}(?:[-*_]\s*){3,}$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*)$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\[(?!\^)[^\]\n]+\]:\s+\S+.*)$/gmu, (line) => protect(line))
  masked = masked.replace(/\[\^[^\]\n]+\]/gu, (footnote) => protect(footnote))
  masked = masked.replace(
    /(!?\[)([^\]\n]+)(\]\((?:\\.|[^)\n])+\))/gu,
    (_match, opening: string, label: string, suffix: string) =>
      `${protect(opening)}${label}${protect(localizeLinkSuffix(suffix, locale))}`,
  )
  masked = masked.replace(
    /(\[)([^\]\n]+)(\]\[[^\]\n]*\])/gu,
    (_match, opening: string, label: string, suffix: string) => `${protect(opening)}${label}${protect(suffix)}`,
  )
  masked = masked.replace(/<[^>\n]+>/gu, (tag) => protect(localizeHtmlTag(tag, locale)))
  masked = masked.replace(/\bhttps?:\/\/[^\s<>)\]]+/giu, (url) => protect(url))
  masked = masked.replace(DOMAIN_NAME_PATTERN, (domain) => protect(domain))
  masked = masked.replace(/\{#[A-Za-z_][\w:.-]*\}/gu, (anchor) => protect(anchor))
  masked = masked.replace(/&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]+);/giu, (entity) => protect(entity))
  masked = masked.replace(TECHNICAL_TERM_PATTERN, (term) => protect(term))
  masked = masked.replace(CAMEL_CASE_IDENTIFIER_PATTERN, (term) => protect(term))
  masked = masked.replace(UPPERCASE_IDENTIFIER_PATTERN, (term) => protect(term))
  masked = masked.replace(/[*_~]{1,3}/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/\|/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/^(\s*(?:#{1,6}|>|[-+*]|\d+[.)]|:::\s*[A-Za-z-]*|\[\^[^\]\n]+\]:)\s+)/gmu, (prefix) =>
    protect(prefix),
  )
  masked = masked.replace(/\n/gu, (newline) => protect(newline))

  const values = new Map<string, string>()
  let markerSequence = 0
  for (const [internalToken, value] of internalValues) {
    const token = `[PH${markerSequence.toString().padStart(6, '0')}]`
    markerSequence += 1
    values.set(token, value)
    const rendered = markerStyle === 'html' ? `<span class="notranslate">${token}</span>` : token
    masked = masked.replaceAll(internalToken, rendered)
  }

  return {
    masked,
    valueForMarker(marker: string): string | undefined {
      const token = /\[PH\d{6}\]/u.exec(marker)?.[0]
      return token ? values.get(token) : undefined
    },
    restore(translated: string): string {
      let restored = translated.replace(/\[\s*PH\s*([0-9][0-9\s,._-]*)\s*\]/giu, (candidate, encodedIndex: string) => {
        const digits = encodedIndex.replace(/\D/gu, '')
        if (!digits) return candidate
        const index = Number.parseInt(digits, 10)
        if (!Number.isSafeInteger(index)) return candidate
        const canonical = `[PH${index.toString().padStart(6, '0')}]`
        return values.has(canonical) ? canonical : candidate
      })
      for (const [token, value] of values) {
        const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
        const wrapped = new RegExp(`<span\\b[^>]*>\\s*${escapedToken}\\s*</span>`, 'gu')
        restored = restored.replace(wrapped, token)
        const occurrences = restored.split(token).length - 1
        if (occurrences !== 1) {
          const carriers = [...values.entries()]
            .filter(([otherToken, value]) => otherToken !== token && value.includes(token))
            .map(([otherToken]) => otherToken)
          const carrierDetail = carriers.length ? `; nested in ${carriers.join(', ')}` : ''
          throw new Error(`Translation changed protected marker ${token} (${occurrences} occurrences${carrierDetail})`)
        }
        const markerIndex = restored.indexOf(token)
        const previous = markerIndex > 0 ? restored[markerIndex - 1] : ''
        const next = restored[markerIndex + token.length] ?? ''
        let replacement = value
        if (/[\p{L}\p{N}]$/u.test(previous) && /^[\p{L}\p{N}]/u.test(replacement)) {
          replacement = ` ${replacement}`
        }
        if (/[\p{L}\p{N}]$/u.test(replacement) && /^[\p{L}\p{N}]/u.test(next)) {
          replacement = `${replacement} `
        }
        restored = restored.replace(token, () => replacement)
      }
      return restored
    },
  }
}

export function chunkForTranslation(content: string, maximumCharacters = MAX_REQUEST_CHARACTERS): string[] {
  if (!Number.isInteger(maximumCharacters) || maximumCharacters < 128) {
    throw new Error('Translation chunk size must be an integer of at least 128 characters')
  }
  const chunks: string[] = []
  let remaining = content
  while (remaining.length > maximumCharacters) {
    const minimumBalancedCharacters = Math.ceil(maximumCharacters / 2)
    const boundaryAtOrBefore = (limit: number): number | undefined => {
      const candidates = [
        remaining.lastIndexOf('\n\n', limit),
        remaining.lastIndexOf('\n', limit),
        remaining.lastIndexOf('. ', limit),
        remaining.lastIndexOf('; ', limit),
        remaining.lastIndexOf(': ', limit),
        remaining.lastIndexOf(', ', limit),
        remaining.lastIndexOf(' ', limit),
      ]
      const boundary = candidates.find((candidate) => candidate >= minimumBalancedCharacters)
      return boundary === undefined ? undefined : boundary + (remaining.startsWith('\n\n', boundary) ? 2 : 1)
    }

    let cut = maximumCharacters
    const preferredBoundary = boundaryAtOrBefore(cut)
    if (preferredBoundary !== undefined) cut = preferredBoundary
    if (remaining.length - cut < minimumBalancedCharacters) {
      const balancedBoundary = boundaryAtOrBefore(Math.ceil(remaining.length / 2))
      if (balancedBoundary !== undefined && remaining.length - balancedBoundary >= minimumBalancedCharacters) {
        cut = balancedBoundary
      }
    }

    const openSpan = remaining.lastIndexOf('<span', cut)
    const closeSpan = remaining.lastIndexOf('</span>', cut)
    if (openSpan > closeSpan) cut = openSpan
    for (const match of remaining.matchAll(/\[PH\d{6}\]/gu)) {
      const start = match.index
      if (start >= cut) break
      if (start + match[0].length > cut) {
        cut = start
        break
      }
    }
    if (cut <= 0) throw new Error('Unable to split translation input safely')

    chunks.push(remaining.slice(0, cut))
    remaining = remaining.slice(cut)
  }
  if (remaining) chunks.push(remaining)
  return chunks
}

function providerLanguageCode(provider: TranslationProvider, locale: DocsLocale): string {
  return provider.languageCode?.(locale) ?? GOOGLE_LANGUAGE_CODES[locale.key] ?? locale.key
}

async function translateBatch(
  provider: TranslationProvider,
  texts: readonly string[],
  targetLanguage: string,
): Promise<string[]> {
  if (texts.length === 0) return []
  try {
    return await requestTranslationBatch(provider, texts, targetLanguage)
  } catch (error) {
    if (!isMateriallyShortProviderError(error)) throw error

    // The Python bridge rejects the whole request when any NLLB hypothesis
    // trips its token-length guard. Bisect the batch to isolate that input,
    // then retry only the failed prose in sentence-sized chunks. The original
    // guard stays active for every retry and the restored unit is checked again
    // by translationCompletenessError.
    if (texts.length > 1) {
      const midpoint = Math.ceil(texts.length / 2)
      const left = await translateBatch(provider, texts.slice(0, midpoint), targetLanguage)
      const right = await translateBatch(provider, texts.slice(midpoint), targetLanguage)
      return [...left, ...right]
    }

    const [source] = texts
    const retryChunks = chunksForIncompleteRetry(
      source,
      ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage) ? 8 : 15,
    )
    if (retryChunks.length === 1 && retryChunks[0] === source) {
      const sourceContext = JSON.stringify(source.length > 180 ? `${source.slice(0, 177)}...` : source)
      throw new Error(
        `translation provider rejected an indivisible source chunk (${sourceContext}): ${
          error instanceof Error ? error.message : String(error)
        }`,
        { cause: error },
      )
    }
    const translations = await translateBatch(provider, retryChunks, targetLanguage)
    return [
      joinTranslatedChunks(retryChunks, translations, ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage)),
    ]
  }
}

async function requestTranslationBatch(
  provider: TranslationProvider,
  texts: readonly string[],
  targetLanguage: string,
): Promise<string[]> {
  if (provider.translateBatch) return provider.translateBatch(texts, targetLanguage)
  return Promise.all(texts.map((text) => provider.translate(text, targetLanguage)))
}

function isMateriallyShortProviderError(error: unknown): boolean {
  const visited = new Set<unknown>()
  let current: unknown = error
  while (current instanceof Error && !visited.has(current)) {
    if (current.message.includes('translation output is materially shorter than its source')) return true
    visited.add(current)
    current = current.cause
  }
  return false
}

interface FragmentPlan {
  pieceIndex: number
  prefix: string
  suffix: string
  firstUnit: number
  unitCount: number
}

/**
 * Translate only the natural-language text between protected markers.
 *
 * NLLB tokenization can omit or duplicate unknown placeholder tokens. Keeping
 * the generated marker spans out of the model input makes reconstruction
 * deterministic even when the model has no representation for those markers.
 */
export async function translateProtectedFragments(
  protectedMarkdown: ProtectedMarkdown,
  targetLanguage: string,
  provider: TranslationProvider,
): Promise<string> {
  const markerPattern = /(<span class="notranslate">\[PH\d{6}\]<\/span>)/gu
  const exactMarkerPattern = /^<span class="notranslate">\[PH\d{6}\]<\/span>$/u
  const pieces = protectedMarkdown.masked.split(markerPattern)
  const plans: FragmentPlan[] = []
  const units: string[] = []

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    const piece = pieces[pieceIndex]
    if (!piece || exactMarkerPattern.test(piece)) continue

    const whitespace = /^(\s*(?:[,.:;!?]\s*)?)([\s\S]*?)(\s*)$/u.exec(piece)
    if (!whitespace || !whitespace[2]) continue
    if (!/\p{L}/u.test(whitespace[2])) continue
    const chunks = chunkForTranslation(whitespace[2], 128)
    plans.push({
      pieceIndex,
      prefix: whitespace[1],
      suffix: whitespace[3],
      firstUnit: units.length,
      unitCount: chunks.length,
    })
    units.push(...chunks)
  }

  const translations = await translateBatch(provider, units, targetLanguage)
  if (translations.length !== units.length || translations.some((translation) => typeof translation !== 'string')) {
    throw new Error(`Translation provider returned ${translations.length} results for ${units.length} fragments`)
  }

  for (const plan of plans) {
    const sourceChunks = units.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    const translatedChunks = translations.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    let translated = joinTranslatedChunks(
      sourceChunks,
      translatedChunks,
      ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage),
    )
    const previousMarker = pieces[plan.pieceIndex - 1]
    const nextMarker = pieces[plan.pieceIndex + 1]
    const previousValue =
      previousMarker && exactMarkerPattern.test(previousMarker)
        ? protectedMarkdown.valueForMarker(previousMarker)
        : undefined
    const nextValue =
      nextMarker && exactMarkerPattern.test(nextMarker) ? protectedMarkdown.valueForMarker(nextMarker) : undefined

    // Fragment-only translation deliberately hides protected markers from the
    // model. Some languages then drop an English possessive, parenthesis, or
    // hyphen at that boundary. Keep restored identifiers as separate words
    // even when the translated fragment no longer supplies the punctuation.
    if (previousValue && /[\p{L}\p{N}]$/u.test(previousValue) && /^[\p{L}\p{N}]/u.test(translated) && !plan.prefix) {
      translated = ` ${translated}`
    }
    if (nextValue && /[\p{L}\p{N}]$/u.test(translated) && /^[\p{L}\p{N}]/u.test(nextValue) && !plan.suffix) {
      translated = `${translated} `
    }

    pieces[plan.pieceIndex] = plan.prefix + translated + plan.suffix
  }
  return protectedMarkdown.restore(pieces.join(''))
}

interface MarkdownTranslationUnit {
  completenessMinimumLetters?: number
  content: string
  markdownTableCell?: boolean
  translate: boolean
}

type MarkdownLineKind = 'blockquote' | 'directive' | 'footnote' | 'heading' | 'html' | 'list' | 'plain' | 'table'

function markdownLineKind(line: string): MarkdownLineKind {
  if (/^ {0,3}#{1,6}[ \t]+/u.test(line)) return 'heading'
  if (/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+/u.test(line)) return 'list'
  if (/^ {0,3}\[\^[^\]\n]+\]:[ \t]+/u.test(line)) return 'footnote'
  if (/^ {0,3}>[ \t]?/u.test(line)) return 'blockquote'
  if (/^ {0,3}\|/u.test(line)) return 'table'
  if (/^ {0,3}:::/u.test(line)) return 'directive'
  if (/^ {0,3}<[A-Za-z!/]/u.test(line)) return 'html'
  return 'plain'
}

function logicalProseUnits(lines: readonly string[]): string[] {
  const units: string[] = []
  let current = ''
  let currentKind: MarkdownLineKind | undefined

  const flush = () => {
    if (current) units.push(current)
    current = ''
    currentKind = undefined
  }

  for (const line of lines) {
    const kind = markdownLineKind(line)
    if (!current) {
      current = line
      currentKind = kind
      continue
    }

    if (kind === 'plain' && currentKind === 'plain') {
      current += ` ${line.trim()}`
      continue
    }
    if (
      kind === 'plain' &&
      (currentKind === 'list' || currentKind === 'blockquote' || currentKind === 'footnote') &&
      /^\s+/u.test(line)
    ) {
      current += ` ${line.trim()}`
      continue
    }
    if (kind === 'blockquote' && currentKind === 'blockquote') {
      current += ` ${line.replace(/^ {0,3}>[ \t]?/u, '').trim()}`
      continue
    }

    flush()
    current = line
    currentKind = kind
  }
  flush()
  return units
}

/**
 * Split Markdown into complete prose units while preserving literal blocks.
 *
 * Soft-wrapped paragraph and list continuation lines are joined before
 * translation so a local model sees complete sentences instead of isolated
 * line fragments.
 */
export function markdownTranslationUnits(source: string): MarkdownTranslationUnit[] {
  const units: MarkdownTranslationUnit[] = []
  const lines = source.split('\n')
  let prose: string[] = []

  const pushProse = (hasFollowingNewline: boolean) => {
    const logical = logicalProseUnits(prose)
    for (const [index, content] of logical.entries()) {
      units.push({ content, translate: true })
      if (index + 1 < logical.length || hasFollowingNewline) units.push({ content: '\n', translate: false })
    }
    prose = []
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const hasFollowingNewline = index + 1 < lines.length

    const fence = /^ {0,3}(`{3,}|~{3,})/u.exec(line)
    const script = /^ {0,3}<(script|style)\b/iu.exec(line)
    const displayMath = /^ {0,3}(?:\$\$|\\\[)\s*$/u.test(line)
    if (fence || script || displayMath) {
      pushProse(false)
      const literal: string[] = [line]
      if (fence) {
        for (index += 1; index < lines.length; index += 1) {
          literal.push(lines[index])
          if (new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`, 'u').test(lines[index])) break
        }
      } else if (script) {
        const close = new RegExp(`</${script[1]}>`, 'iu')
        if (!close.test(line)) {
          for (index += 1; index < lines.length; index += 1) {
            literal.push(lines[index])
            if (close.test(lines[index])) break
          }
        }
      } else if (!(line.trim() === '$$' && line.indexOf('$$') !== line.lastIndexOf('$$'))) {
        const close = displayMath && line.trim() === '$$' ? /^\s*\$\$\s*$/u : /^\s*\\\]\s*$/u
        for (index += 1; index < lines.length; index += 1) {
          literal.push(lines[index])
          if (close.test(lines[index])) break
        }
      }
      units.push({ content: literal.join('\n'), translate: false })
      if (index + 1 < lines.length) units.push({ content: '\n', translate: false })
      continue
    }

    if (line === '') {
      pushProse(true)
      if (hasFollowingNewline) units.push({ content: '\n', translate: false })
      continue
    }
    prose.push(line)
    if (!hasFollowingNewline) pushProse(false)
  }

  return units
}

interface InlineTranslationPlan {
  completenessContext: TranslationCompletenessContext
  completenessMinimumLetters: number
  protectedMarkdown: ProtectedMarkdown
  firstChunk: number
  chunkCount: number
  prefix: string
  source: string
  suffix: string
}

export interface TranslationCompletenessContext {
  markdownTableCell: boolean
}

function removeTranslatableEmphasis(source: string): string {
  return source
    .replace(/(\*\*|__|~~)(?=\S)([\s\S]*?\S)\1/gu, '$2')
    .replace(/(?<![\p{L}\p{N}])([*_])(?=\S)([\s\S]*?\S)\1(?![\p{L}\p{N}])/gu, '$2')
}

function detachBoundaryMarkers(
  masked: string,
  protectedMarkdown: ProtectedMarkdown,
): { core: string; prefix: string; suffix: string } {
  const marker = /\[PH\d{6}\]/u
  const structuralPrefix = /^\s*(?:#{1,6}|>|[-+*]|\d+[.)]|:::\s*[A-Za-z-]*|\[\^[^\]\n]+\]:)\s+$/u
  const structuralSuffix = /^\{#[A-Za-z_][\w:.-]*\}$/u
  let core = masked
  let prefix = ''
  let suffix = ''

  for (;;) {
    const leading = /^\s*(\[PH\d{6}\])\s*/u.exec(core)
    if (!leading) break
    const value = protectedMarkdown.valueForMarker(leading[1])
    if (value === undefined || (/[\p{L}\p{N}]/u.test(value) && !structuralPrefix.test(value))) break
    prefix += leading[0]
    core = core.slice(leading[0].length)
  }
  for (;;) {
    const trailing = /\s*(\[PH\d{6}\])\s*$/u.exec(core)
    if (!trailing) break
    const value = protectedMarkdown.valueForMarker(trailing[1])
    if (value === undefined || (/[\p{L}\p{N}]/u.test(value) && !structuralSuffix.test(value))) break
    suffix = trailing[0] + suffix
    core = core.slice(0, trailing.index)
  }

  if (!marker.test(core)) return { core, prefix, suffix }
  return { core, prefix, suffix }
}

function translationLetterCount(content: string): number {
  return [...content.matchAll(/[\p{L}\p{M}]/gu)].length
}

function endsWithContinuationPunctuation(content: string): boolean {
  return /[,;،؛，；](?:["')\]}»”]*)$/u.test(content.trim())
}

function translationCompletenessError(
  source: string,
  translated: string,
  locale: DocsLocale,
  minimumSourceLetters = 80,
): string | undefined {
  const sourceLetters = translationLetterCount(source)
  const translatedLetters = translationLetterCount(translated)
  const ratio = translatedLetters / sourceLetters
  const sourceSentences = sentenceCount(source, 'en')
  const translatedSentences = sentenceCount(translated, locale.lang)
  if (
    sourceLetters >= minimumSourceLetters &&
    sourceSentences >= 2 &&
    translatedSentences < sourceSentences &&
    ratio < sentenceCoverageMinimumRatio(locale.key)
  ) {
    return `output has incomplete sentence coverage (expected at least ${sourceSentences}, found ${translatedSentences}; ${ratio.toFixed(2)} of source letters)`
  }
  if (sourceLetters >= minimumSourceLetters && ratio <= translationMinimumRatio(locale.key)) {
    return `output is materially short (${ratio.toFixed(2)} of source letters)`
  }
  if (
    sourceLetters >= minimumSourceLetters &&
    /[.!?](?:["')\]}]*)$/u.test(source.trim()) &&
    endsWithContinuationPunctuation(translated)
  ) {
    return 'output ends with continuation punctuation'
  }
  return undefined
}

function joinTranslatedChunks(
  sourceChunks: readonly string[],
  translatedChunks: readonly string[],
  compactBoundaries: boolean,
): string {
  let joined = translatedChunks[0] ?? ''
  for (let index = 1; index < translatedChunks.length; index += 1) {
    const next = translatedChunks[index]
    const sourceHadWhitespace = /\s$/u.test(sourceChunks[index - 1]) || /^\s/u.test(sourceChunks[index])
    const connectiveBoundary = /\bso\s*$/iu.test(sourceChunks[index - 1])
    if (
      compactBoundaries &&
      connectiveBoundary &&
      !/[.!?。！？,，、;；:：]\s*$/u.test(joined) &&
      !/^\s*[.!?。！？,，、;；:：]/u.test(next)
    ) {
      joined += '。'
    } else if (sourceHadWhitespace && !compactBoundaries && !/\s$/u.test(joined) && !/^\s/u.test(next)) {
      joined += ' '
    }
    joined += next
  }
  return joined
}

function chunksAtClauseBoundaries(content: string, minimumClauseLetters = 15): string[] {
  const clauses: string[] = []
  let start = 0
  for (const match of content.matchAll(/[,;:،؛，；：、](?:\s+|(?=\S)|$)/gu)) {
    const end = match.index + match[0].length
    clauses.push(content.slice(start, end))
    start = end
  }
  if (start < content.length) clauses.push(content.slice(start))
  if (clauses.length < 2) return [content]

  const chunks: string[] = []
  let consumed = 0
  let pending = ''
  for (const clause of clauses) {
    pending += clause
    consumed += clause.length
    const remaining = content.slice(consumed)
    const pendingLetters = translationLetterCount(pending.replace(/\[PH\d{6}\]/gu, ''))
    const remainingLetters = translationLetterCount(remaining.replace(/\[PH\d{6}\]/gu, ''))
    if (remaining && pendingLetters >= minimumClauseLetters && remainingLetters >= minimumClauseLetters) {
      chunks.push(pending)
      pending = ''
    }
  }
  if (pending) chunks.push(pending)
  return chunks.length > 1 ? chunks : [content]
}

function chunksAtEnglishConnectiveBoundaries(content: string): string[] {
  const chunks: string[] = []
  let start = 0
  for (const match of content.matchAll(/\bso\b\s+|(?<=\s)(?:if|for|from)\s+/giu)) {
    const cut = /^(?:if|for|from)\b/iu.test(match[0]) ? match.index : match.index + match[0].length
    const pending = content.slice(start, cut)
    const remaining = content.slice(cut)
    const pendingLetters = translationLetterCount(pending.replace(/\[PH\d{6}\]/gu, ''))
    const remainingLetters = translationLetterCount(remaining.replace(/\[PH\d{6}\]/gu, ''))
    if (pendingLetters < 20 || remainingLetters < 20) continue
    chunks.push(pending)
    start = cut
  }
  if (start > 0) chunks.push(content.slice(start))
  return chunks.length > 1 ? chunks : [content]
}

export function isCompleteShortStructuralLeadIn(source: string, translated: string): boolean {
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  const hasEnoughTargetLetters =
    (sourceLetters <= 32 && translatedLetters >= 3) ||
    (sourceLetters > 32 && sourceLetters <= 48 && translatedLetters >= 7)
  return (
    sourceLetters > 0 &&
    sourceLetters <= 48 &&
    hasEnoughTargetLetters &&
    /:\s*$/u.test(sourceWithoutMarkers) &&
    /[:：]\s*$/u.test(translatedWithoutMarkers)
  )
}

function hasExactTechnicalIdentifierSet(source: string, translated: string): boolean {
  const sourceIdentifiers = technicalIdentifiers(source)
  const translatedIdentifiers = technicalIdentifiers(translated)
  return (
    sourceIdentifiers.size === translatedIdentifiers.size &&
    [...sourceIdentifiers].every(
      ([identifier, expectedCount]) => translatedIdentifiers.get(identifier) === expectedCount,
    )
  )
}

export function isCompleteCompactCjkTableLabel(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key) || !context.markdownTableCell) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  const sourceWords = sourceWithoutMarkers.match(/\p{L}+/gu) ?? []
  const sourceClauses = sourceWithoutMarkers
    .split(/[,;:،؛，；：、]/u)
    .map((clause) => translationLetterCount(clause))
    .filter((letters) => letters > 0)
  const translatedClauses = translatedWithoutMarkers
    .split(/[,;:،؛，；：、]/u)
    .map((clause) => translationLetterCount(clause))
    .filter((letters) => letters > 0)
  const hasCompleteCompactClausePair =
    sourceLetters <= 55 &&
    translatedLetters >= 10 &&
    sourceClauses.length === 2 &&
    translatedClauses.length === 2 &&
    sourceClauses.every((letters) => letters >= 20) &&
    translatedClauses.every((letters) => letters >= 4)
  const hasEnoughTargetLetters =
    (sourceLetters <= 40 &&
      (translatedLetters >= 6 ||
        (sourceLetters >= 20 && sourceLetters <= 24 && sourceWords.length === 2 && translatedLetters >= 4))) ||
    (sourceLetters >= 20 && sourceLetters <= 30 && translatedLetters >= 5) ||
    (sourceLetters > 40 && sourceLetters <= 80 && translatedLetters >= 12) ||
    hasCompleteCompactClausePair
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 80 &&
    hasEnoughTargetLetters &&
    !/[.!?]/u.test(sourceWithoutMarkers) &&
    !endsWithContinuationPunctuation(translatedWithoutMarkers) &&
    !/、(?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkTableSentence(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key) || !context.markdownTableCell) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 81 &&
    sourceLetters <= 120 &&
    translatedLetters >= 20 &&
    /[.!?](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

function isCompleteCompactCjkTableUnit(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): boolean {
  return (
    isCompleteCompactCjkTableLabel(source, translated, locale, context) ||
    isCompleteCompactCjkTableSentence(source, translated, locale, context)
  )
}

export function isCompleteCompactCjkSentence(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  const hasOneCompleteSentence =
    sentenceCount(sourceWithoutMarkers, 'en') === 1 && sentenceCount(translatedWithoutMarkers, locale.lang) === 1
  const hasCompactCoordinatedPair =
    sourceLetters <= 40 &&
    translatedLetters >= 7 &&
    /(?:,\s*)?\band\b/iu.test(sourceWithoutMarkers) &&
    /(?:および|並びに|[和与與及、,，])/u.test(translatedWithoutMarkers)
  const hasEnoughTargetLetters =
    (sourceLetters <= 40 && translatedLetters >= 11) ||
    (sourceLetters > 40 && sourceLetters <= 50 && translatedLetters >= Math.max(10, Math.ceil(sourceLetters * 0.22))) ||
    (sourceLetters > 50 && sourceLetters <= 60 && translatedLetters >= 12) ||
    (sourceLetters > 60 && sourceLetters <= 90 && translatedLetters >= Math.max(15, Math.ceil(sourceLetters * 0.22))) ||
    (sourceLetters > 90 && sourceLetters <= 120 && translatedLetters >= Math.max(20, Math.ceil(sourceLetters * 0.2))) ||
    hasCompactCoordinatedPair
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 120 &&
    hasEnoughTargetLetters &&
    hasOneCompleteSentence &&
    /[.!?](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkRetryPhrase(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 30 &&
    translatedLetters >= 5 &&
    !/[.!?,;:]/u.test(sourceWithoutMarkers) &&
    !endsWithContinuationPunctuation(translatedWithoutMarkers) &&
    !/、(?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkRetryClause(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 8 &&
    sourceLetters <= 80 &&
    translatedLetters >= Math.max(2, Math.ceil(sourceLetters * 0.15)) &&
    /[,;:](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[,，、;；:：](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkRetryListTail(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 25 &&
    sourceLetters <= 60 &&
    translatedLetters >= Math.max(8, Math.ceil(sourceLetters * 0.2)) &&
    /^\s*and\b/iu.test(sourceWithoutMarkers) &&
    /[.!?](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

function retryChunkCompletenessError(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): string | undefined {
  const markerError = retryChunkMarkerError(source, translated)
  if (markerError) return markerError
  if (isCompleteCompactCjkTableUnit(source, translated, locale, context)) return undefined
  if (isCompleteCompactCjkSentence(source, translated, locale)) return undefined
  if (isCompleteCompactCjkRetryPhrase(source, translated, locale)) return undefined
  if (isCompleteCompactCjkRetryClause(source, translated, locale)) return undefined
  if (isCompleteCompactCjkRetryListTail(source, translated, locale)) return undefined
  const sourceWithoutMarkers = source.replace(/\[PH\d{6}\]/gu, '')
  if (
    ['ja', 'zh-hans', 'zh-hant'].includes(locale.key) &&
    translationLetterCount(sourceWithoutMarkers) >= 8 &&
    translationLetterCount(sourceWithoutMarkers) < 20 &&
    /[,;:](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers)
  ) {
    return 'output has incomplete compact clause coverage'
  }
  if (isCompleteShortStructuralLeadIn(source, translated)) return undefined
  const translatedWithoutMarkers = translated.replace(/\[PH\d{6}\]/gu, '')
  return translationCompletenessError(sourceWithoutMarkers, translatedWithoutMarkers, locale, 20)
}

export function hasExactProtectedMarkerMultiset(source: string, translated: string): boolean {
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  const sortedSourceMarkers = [...sourceMarkers].sort()
  const sortedTranslatedMarkers = [...translatedMarkers].sort()
  return (
    sortedSourceMarkers.length === sortedTranslatedMarkers.length &&
    sortedSourceMarkers.every((marker, index) => marker === sortedTranslatedMarkers[index])
  )
}

function retryChunkMarkerError(source: string, translated: string): string | undefined {
  if (hasExactProtectedMarkerMultiset(source, translated)) return undefined
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  return `output changed protected markers (expected ${sourceMarkers.join(', ') || 'none'}, found ${translatedMarkers.join(', ') || 'none'})`
}

function hasOnlyMissingProtectedMarkers(source: string, translated: string): boolean {
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  if (translatedMarkers.length >= sourceMarkers.length) return false
  const remaining = new Map<string, number>()
  for (const marker of sourceMarkers) remaining.set(marker, (remaining.get(marker) ?? 0) + 1)
  for (const marker of translatedMarkers) {
    const count = remaining.get(marker) ?? 0
    if (count === 0) return false
    remaining.set(marker, count - 1)
  }
  return true
}

async function recoverRetryChunkMarkers(
  source: string,
  targetLanguage: string,
  provider: TranslationProvider,
): Promise<string> {
  const markerPattern = /(\[PH\d{6}\])/gu
  const exactMarkerPattern = /^\[PH\d{6}\]$/u
  const pieces = source.split(markerPattern)
  const plans: FragmentPlan[] = []
  const units: string[] = []

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    const piece = pieces[pieceIndex]
    if (!piece || exactMarkerPattern.test(piece)) continue

    const whitespace = /^(\s*(?:[,.:;!?]\s*)?)([\s\S]*?)(\s*)$/u.exec(piece)
    if (!whitespace || !whitespace[2] || !/\p{L}/u.test(whitespace[2])) continue
    const chunks = chunkForTranslation(whitespace[2], 128)
    plans.push({
      pieceIndex,
      prefix: whitespace[1],
      suffix: whitespace[3],
      firstUnit: units.length,
      unitCount: chunks.length,
    })
    units.push(...chunks)
  }

  const translations = await translateBatch(provider, units, targetLanguage)
  if (translations.length !== units.length || translations.some((translation) => typeof translation !== 'string')) {
    throw new Error(`Translation provider returned ${translations.length} results for ${units.length} retry fragments`)
  }

  for (const plan of plans) {
    const sourceChunks = units.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    const translatedChunks = translations.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    pieces[plan.pieceIndex] =
      plan.prefix +
      joinTranslatedChunks(
        sourceChunks,
        translatedChunks,
        ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage),
      ) +
      plan.suffix
  }
  return pieces.join('')
}

const NON_TERMINAL_ENGLISH_ABBREVIATION =
  /(?:^|[\s("'‘“])(?:mr|mrs|ms|dr|prof|sr|jr|st|mt|vs|etc|e\.g|i\.e|no|fig|eq|sec|ch|vol|inc|ltd|co|corp)\.\s*$/iu

function isCompleteNaturalLanguageSentence(segment: string): boolean {
  const withoutMarkers = segment.replace(/\[PH\d{6}\]/gu, '')
  return (
    /\p{L}/u.test(withoutMarkers) &&
    /[.!?](?:["')\]}]*)\s*$/u.test(segment) &&
    !NON_TERMINAL_ENGLISH_ABBREVIATION.test(withoutMarkers)
  )
}

function chunksForIncompleteRetry(content: string, minimumClauseLetters = 15): string[] {
  const sentences: string[] = []
  let pending = ''
  for (const { segment } of new Intl.Segmenter('en', { granularity: 'sentence' }).segment(content)) {
    pending += segment
    if (!isCompleteNaturalLanguageSentence(segment)) continue
    sentences.push(pending)
    pending = ''
  }
  if (pending) sentences.push(pending)
  if (sentences.length === 0) sentences.push(content)
  const chunks = sentences.flatMap((sentence) => chunkForTranslation(sentence, 128))
  if (chunks.length === 1 && chunks[0] === content) {
    const punctuationChunks = chunksAtClauseBoundaries(content, minimumClauseLetters)
    if (punctuationChunks.length > 1) return punctuationChunks
    return chunksAtEnglishConnectiveBoundaries(content)
  }
  return chunks
}

async function translateRetryChunksWithCoverage(
  sourceChunks: readonly string[],
  locale: DocsLocale,
  provider: TranslationProvider,
  targetLanguage: string,
  context: TranslationCompletenessContext,
): Promise<string[]> {
  const minimumClauseLetters = ['ja', 'zh-hans', 'zh-hant'].includes(locale.key) ? 8 : 15
  let translations: string[]
  try {
    translations = await requestTranslationBatch(provider, sourceChunks, targetLanguage)
  } catch (error) {
    if (!isMateriallyShortProviderError(error)) throw error
    if (sourceChunks.length > 1) {
      const midpoint = Math.ceil(sourceChunks.length / 2)
      const left = await translateRetryChunksWithCoverage(
        sourceChunks.slice(0, midpoint),
        locale,
        provider,
        targetLanguage,
        context,
      )
      const right = await translateRetryChunksWithCoverage(
        sourceChunks.slice(midpoint),
        locale,
        provider,
        targetLanguage,
        context,
      )
      return [...left, ...right]
    }

    const [source] = sourceChunks
    const retryChunks = chunksForIncompleteRetry(source, minimumClauseLetters)
    if (retryChunks.length === 1 && retryChunks[0] === source) {
      const sourceContext = JSON.stringify(source.length > 180 ? `${source.slice(0, 177)}...` : source)
      throw new Error(
        `translation provider rejected an indivisible retry chunk (${sourceContext}): ${
          error instanceof Error ? error.message : String(error)
        }`,
        { cause: error },
      )
    }
    const retryTranslations = await translateRetryChunksWithCoverage(
      retryChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    return [joinTranslatedChunks(retryChunks, retryTranslations, ['ja', 'zh-hans', 'zh-hant'].includes(locale.key))]
  }

  if (translations.length !== sourceChunks.length) {
    throw new Error(
      `Translation provider returned ${translations.length} results for ${sourceChunks.length} retry chunks`,
    )
  }

  const covered: string[] = []
  for (let index = 0; index < sourceChunks.length; index += 1) {
    const source = sourceChunks[index]
    const translated = translations[index]
    const incomplete = retryChunkCompletenessError(source, translated, locale, context)
    if (!incomplete) {
      covered.push(translated)
      continue
    }

    const markerError = retryChunkMarkerError(source, translated)
    if (markerError) {
      if (!hasOnlyMissingProtectedMarkers(source, translated)) {
        throw new Error(`semantic retry chunk ${index + 1}: ${markerError}`)
      }
      const recovered = await recoverRetryChunkMarkers(source, targetLanguage, provider)
      const recoveryError = retryChunkCompletenessError(source, recovered, locale, context)
      if (recoveryError) {
        throw new Error(`semantic retry chunk ${index + 1}: ${incomplete}; marker-fragment recovery ${recoveryError}`)
      }
      covered.push(recovered)
      continue
    }

    const retryChunks = chunksForIncompleteRetry(source, minimumClauseLetters)
    if (retryChunks.length === 1 && retryChunks[0] === source) {
      throw new Error(`semantic retry chunk ${index + 1}: ${incomplete}; no smaller safe boundary`)
    }
    const retryTranslations = await translateRetryChunksWithCoverage(
      retryChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    covered.push(
      joinTranslatedChunks(retryChunks, retryTranslations, ['ja', 'zh-hans', 'zh-hant'].includes(locale.key)),
    )
  }
  return covered
}

interface RetriedInlineUnit {
  content: string
  validatedByCjkRetryChunks: boolean
}

async function retryIncompleteInlineUnit(
  source: string,
  locale: DocsLocale,
  provider: TranslationProvider,
  context: TranslationCompletenessContext,
): Promise<RetriedInlineUnit> {
  const protectedMarkdown = protectMarkdown(source, locale, 'identifier')
  const { core, prefix, suffix } = detachBoundaryMarkers(protectedMarkdown.masked, protectedMarkdown)
  if (!/\p{L}/u.test(core)) {
    return {
      content: protectedMarkdown.restore(prefix + core + suffix),
      validatedByCjkRetryChunks: false,
    }
  }
  const sourceChunks = chunksForIncompleteRetry(core)
  const targetLanguage = providerLanguageCode(provider, locale)
  const translations = await translateRetryChunksWithCoverage(sourceChunks, locale, provider, targetLanguage, context)
  const compactBoundaries = ['ja', 'zh-hans', 'zh-hant'].includes(locale.key)
  const restoreJoined = (translatedChunks: readonly string[]): string =>
    protectedMarkdown.restore(prefix + joinTranslatedChunks(sourceChunks, translatedChunks, compactBoundaries) + suffix)
  const candidate = restoreJoined(translations)
  const validatedByCjkRetryChunks =
    compactBoundaries &&
    sourceChunks.length >= 2 &&
    sourceChunks.every((chunk, index) => {
      if (/[.!?](?:["')\]}]*)\s*$/u.test(chunk)) {
        return /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translations[index])
      }
      if (/[,;:](?:["')\]}]*)\s*$/u.test(chunk)) {
        return /[,，、;；:：](?:["')\]}»”]*)\s*$/u.test(translations[index])
      }
      return false
    })

  if (
    isCompleteCompactCjkTableUnit(source, candidate, locale, context) ||
    !translationCompletenessError(source, candidate, locale) ||
    sourceChunks.length < 2
  ) {
    return { content: candidate, validatedByCjkRetryChunks }
  }

  const recoveredTranslations = [...translations]
  let retriedClause = false
  for (let index = 0; index < sourceChunks.length; index += 1) {
    const clauseChunks = chunksAtClauseBoundaries(sourceChunks[index])
    if (clauseChunks.length < 2) continue
    const clauseTranslations = await translateRetryChunksWithCoverage(
      clauseChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    recoveredTranslations[index] = joinTranslatedChunks(clauseChunks, clauseTranslations, compactBoundaries)
    retriedClause = true
  }
  if (!retriedClause) return { content: candidate, validatedByCjkRetryChunks }

  return { content: restoreJoined(recoveredTranslations), validatedByCjkRetryChunks }
}

async function translateInlineIdentifierMarkdown(
  source: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const output: string[] = []
  const plans: InlineTranslationPlan[] = []
  const chunks: string[] = []

  const baseUnits = markdownTranslationUnits(source)
  const units = baseUnits.flatMap((unit): MarkdownTranslationUnit[] => {
    if (!unit.translate || markdownLineKind(unit.content) !== 'table') return [unit]
    const curatedRow = curatedExactTranslation(unit.content, locale)
    if (curatedRow !== undefined) return [{ content: curatedRow, translate: false }]
    return unit.content
      .split(/((?<!\\)\|)/u)
      .filter(Boolean)
      .map((content) => ({
        completenessMinimumLetters: content === '|' ? undefined : 20,
        content,
        markdownTableCell: content !== '|',
        translate: content !== '|',
      }))
  })

  for (const unit of units) {
    if (!unit.translate || !/\p{L}/u.test(unit.content)) {
      output.push(unit.content)
      continue
    }

    // NLLB is substantially more reliable when it translates complete prose
    // without paired placeholder tokens around emphasis spans. Localized prose
    // therefore normalizes emphasis to plain text while preserving code,
    // identifiers, links, and every structural Markdown token.
    const protectedMarkdown = protectMarkdown(removeTranslatableEmphasis(unit.content), locale, 'identifier')
    const { core, prefix, suffix } = detachBoundaryMarkers(protectedMarkdown.masked, protectedMarkdown)
    if (!/\p{L}/u.test(core)) {
      output.push(protectedMarkdown.restore(prefix + core + suffix))
      continue
    }
    const unitChunks = chunkForTranslation(core, 300)
    plans.push({
      completenessContext: { markdownTableCell: unit.markdownTableCell === true },
      completenessMinimumLetters: unit.completenessMinimumLetters ?? 80,
      protectedMarkdown,
      firstChunk: chunks.length,
      chunkCount: unitChunks.length,
      prefix,
      source: removeTranslatableEmphasis(unit.content),
      suffix,
    })
    chunks.push(...unitChunks)
    output.push('')
  }

  const translations = await translateBatch(provider, chunks, providerLanguageCode(provider, locale))
  if (translations.length !== chunks.length) {
    throw new Error(`Translation provider returned ${translations.length} results for ${chunks.length} prose chunks`)
  }

  let planIndex = 0
  for (let outputIndex = 0; outputIndex < output.length; outputIndex += 1) {
    if (output[outputIndex] !== '') continue
    const plan = plans[planIndex]
    planIndex += 1
    const sourceChunks = chunks.slice(plan.firstChunk, plan.firstChunk + plan.chunkCount)
    const translatedChunks = translations.slice(plan.firstChunk, plan.firstChunk + plan.chunkCount)
    const translated = joinTranslatedChunks(
      sourceChunks,
      translatedChunks,
      ['ja', 'zh-hans', 'zh-hant'].includes(locale.key),
    )
    let candidate: string
    try {
      candidate = plan.protectedMarkdown.restore(plan.prefix + translated + plan.suffix)
    } catch (error) {
      try {
        candidate = await translateProtectedFragments(
          protectMarkdown(plan.source, locale),
          providerLanguageCode(provider, locale),
          provider,
        )
      } catch (fallbackError) {
        throw new Error(
          `prose unit ${planIndex}: ${error instanceof Error ? error.message : String(error)}; fragment fallback failed: ${
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          }`,
          { cause: fallbackError },
        )
      }
    }
    candidate = curatedExactTranslation(plan.source, locale) ?? candidate
    const incomplete = isCompleteCompactCjkTableUnit(plan.source, candidate, locale, plan.completenessContext)
      ? undefined
      : translationCompletenessError(plan.source, candidate, locale, plan.completenessMinimumLetters)
    if (incomplete) {
      let validatedByCjkRetryChunks = false
      try {
        const retried = await retryIncompleteInlineUnit(plan.source, locale, provider, plan.completenessContext)
        candidate = retried.content
        validatedByCjkRetryChunks = retried.validatedByCjkRetryChunks
      } catch (error) {
        const sourceContext = JSON.stringify(plan.source.length > 180 ? `${plan.source.slice(0, 177)}...` : plan.source)
        throw new Error(
          `prose unit ${planIndex} (${sourceContext}): ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        )
      }
      const retryIncomplete = validatedByCjkRetryChunks
        ? undefined
        : isCompleteCompactCjkTableUnit(plan.source, candidate, locale, plan.completenessContext)
          ? undefined
          : translationCompletenessError(plan.source, candidate, locale, plan.completenessMinimumLetters)
      if (retryIncomplete) {
        const sourceContext = JSON.stringify(plan.source.length > 180 ? `${plan.source.slice(0, 177)}...` : plan.source)
        throw new Error(
          `prose unit ${planIndex} (${sourceContext}): ${incomplete}; sentence-level retry ${retryIncomplete}`,
        )
      }
    }
    output[outputIndex] = candidate
  }
  return output.join('')
}

function decodeTranslatedHtml(content: string): string {
  return content
    .replace(/&#(\d+);/gu, (_match, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([0-9a-f]+);/giu, (_match, hexadecimal: string) =>
      String.fromCodePoint(Number.parseInt(hexadecimal, 16)),
    )
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export class GoogleTranslationProvider implements TranslationProvider {
  readonly engine = GOOGLE_TRANSLATION_ENGINE
  readonly protectedMarkdownMode = 'fragments' as const

  languageCode(locale: DocsLocale): string {
    return GOOGLE_LANGUAGE_CODES[locale.key] ?? locale.key
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    let lastError: unknown
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const body = new URLSearchParams({
          client: 'gtx',
          sl: 'en',
          tl: targetLanguage,
          dt: 't',
          format: 'html',
          q: text,
        })
        const response = await fetch(TRANSLATE_ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body,
        })
        if (!response.ok) throw new Error(`translation service returned HTTP ${response.status}`)
        const payload = (await response.json()) as [[Array<[string]>]]
        const translated = payload[0]?.map((part) => part[0] ?? '').join('')
        if (typeof translated !== 'string') throw new Error('translation service returned an invalid payload')
        return decodeTranslatedHtml(translated)
      } catch (error) {
        lastError = error
        if (attempt + 1 < MAX_ATTEMPTS) await delay(Math.min(30_000, 750 * 2 ** attempt))
      }
    }
    throw new Error(`Translation failed after ${MAX_ATTEMPTS} attempts`, { cause: lastError })
  }

  async translateBatch(texts: readonly string[], targetLanguage: string): Promise<string[]> {
    const translations = new Array<string>(texts.length)
    await parallelMap(texts, 1, async (text, index) => {
      translations[index] = await this.translate(text, targetLanguage)
    })
    return translations
  }
}

export class NllbTranslationProvider implements TranslationProvider {
  readonly engine = NLLB_TRANSLATION_ENGINE
  readonly protectedMarkdownMode = 'inline-identifiers' as const

  private readonly python: string
  private readonly model: string
  private child: ChildProcessWithoutNullStreams | null = null
  private reader: ReadlineInterface | null = null
  private requestSequence = 0
  private readonly pending = new Map<number, PendingNllbRequest>()
  private stderrTail = ''
  private closed = false

  constructor(options: NllbProviderOptions) {
    if (!options.model.trim()) throw new Error('The NLLB provider requires a CTranslate2 model path')
    this.python = options.python?.trim() || 'python3'
    this.model = options.model
  }

  languageCode(locale: DocsLocale): string {
    const language = NLLB_LANGUAGE_CODES[locale.key]
    if (!language) throw new Error(`No NLLB language code is configured for locale ${locale.key}`)
    return language
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    const [translation] = await this.translateBatch([text], targetLanguage)
    return translation
  }

  async translateBatch(texts: readonly string[], targetLanguage: string): Promise<string[]> {
    if (texts.length === 0) return []
    if (!Object.values(NLLB_LANGUAGE_CODES).includes(targetLanguage)) {
      throw new Error(`Unsupported NLLB target language: ${targetLanguage}`)
    }
    const child = this.start()
    const id = this.requestSequence
    this.requestSequence += 1

    return new Promise<string[]>((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      const request = `${JSON.stringify({ id, target_language: targetLanguage, texts })}\n`
      try {
        child.stdin.write(request, (error) => {
          if (!error) return
          this.pending.delete(id)
          reject(new Error(`Unable to send request to the NLLB translator: ${error.message}`, { cause: error }))
        })
      } catch (error) {
        this.pending.delete(id)
        reject(
          new Error(
            `Unable to send request to the NLLB translator: ${error instanceof Error ? error.message : error}`,
            {
              cause: error,
            },
          ),
        )
      }
    })
  }

  async close(): Promise<void> {
    this.closed = true
    const child = this.child
    if (!child) return
    const exited = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) => {
      child.once('exit', (code, signal) => resolve({ code, signal }))
    })
    child.stdin.end()
    const { code, signal } = await exited
    this.child = null
    this.reader?.close()
    this.reader = null
    if (code !== 0) {
      throw new Error(
        `NLLB translator exited with ${signal ? `signal ${signal}` : `code ${code ?? 'unknown'}`}${this.stderrContext()}`,
      )
    }
  }

  private start(): ChildProcessWithoutNullStreams {
    if (this.closed) throw new Error('NLLB translation provider is closed')
    if (this.child) return this.child

    const helper = path.join(path.dirname(fileURLToPath(import.meta.url)), 'nllb_translate.py')
    const child = spawn(this.python, [helper, '--model', this.model], {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    this.child = child
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    this.reader = createInterface({ input: child.stdout })
    this.reader.on('line', (line) => this.handleResponse(line))
    child.stderr.on('data', (chunk: string) => {
      this.stderrTail = `${this.stderrTail}${chunk}`.slice(-8_192)
    })
    child.once('error', (error) => {
      this.failPending(new Error(`Unable to start the NLLB translator: ${error.message}`, { cause: error }))
      if (this.child === child) this.child = null
    })
    child.once('exit', (code, signal) => {
      if (this.child === child) this.child = null
      this.reader?.close()
      this.reader = null
      if (this.pending.size > 0) {
        this.failPending(
          new Error(
            `NLLB translator exited with ${signal ? `signal ${signal}` : `code ${code ?? 'unknown'}`}${this.stderrContext()}`,
          ),
        )
      }
    })
    return child
  }

  private handleResponse(line: string): void {
    let response: NllbResponse
    try {
      response = JSON.parse(line) as NllbResponse
    } catch (error) {
      this.failPending(new Error('NLLB translator returned malformed JSON', { cause: error }))
      return
    }
    if (typeof response.id !== 'number' || !Number.isInteger(response.id)) {
      this.failPending(new Error('NLLB translator returned a response without a valid request id'))
      return
    }
    const request = this.pending.get(response.id)
    if (!request) return
    this.pending.delete(response.id)
    if (typeof response.error === 'string') {
      request.reject(new Error(`NLLB translation failed: ${response.error}`))
      return
    }
    if (!Array.isArray(response.translations) || !response.translations.every((item) => typeof item === 'string')) {
      request.reject(new Error('NLLB translator returned an invalid translations payload'))
      return
    }
    request.resolve(response.translations)
  }

  private failPending(error: Error): void {
    for (const request of this.pending.values()) request.reject(error)
    this.pending.clear()
  }

  private stderrContext(): string {
    const detail = this.stderrTail.trim()
    return detail ? `: ${detail}` : ''
  }
}

async function translateMarkdown(source: string, locale: DocsLocale, provider: TranslationProvider): Promise<string> {
  if (!source.trim()) return source
  if (provider.protectedMarkdownMode === 'inline-identifiers') {
    return translateInlineIdentifierMarkdown(source, locale, provider)
  }
  const protectedMarkdown = protectMarkdown(source, locale, 'html')
  const targetLanguage = providerLanguageCode(provider, locale)
  if (provider.protectedMarkdownMode === 'fragments') {
    return translateProtectedFragments(protectedMarkdown, targetLanguage, provider)
  }
  const translatedChunks: string[] = []
  for (const chunk of chunkForTranslation(protectedMarkdown.masked)) {
    translatedChunks.push(await provider.translate(chunk, targetLanguage))
  }
  return protectedMarkdown.restore(translatedChunks.join(''))
}

async function translateHomeFrontmatter(
  frontmatter: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const lines = frontmatter.split(/\r?\n/u)
  const output: string[] = []
  const translatableKeys = new Set(['alt', 'details', 'tagline', 'text', 'title'])

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const field = /^(\s*(?:-\s*)?)([a-z][a-z0-9_-]*):(?:\s*(.*))?$/iu.exec(line)
    if (!field) {
      output.push(line)
      continue
    }

    const [, indentation, key, inlineValue = ''] = field
    if (key === 'link') {
      output.push(`${indentation}${key}: ${localizeRoute(inlineValue.trim(), locale)}`)
      continue
    }
    if (!translatableKeys.has(key)) {
      output.push(line)
      continue
    }

    const continuation: string[] = []
    const fieldIndent = indentation.length
    while (index + 1 < lines.length) {
      const next = lines[index + 1]
      const nextIndent = /^\s*/u.exec(next)?.[0].length ?? 0
      if (!next.trim() || nextIndent <= fieldIndent) break
      continuation.push(next.trim())
      index += 1
    }
    const value = [inlineValue.trim(), ...continuation].filter(Boolean).join(' ')
    if (!value) {
      output.push(line)
      continue
    }
    const translated = await translateMarkdown(value, locale, provider)
    output.push(`${indentation}${key}: ${JSON.stringify(translated.trim())}`)
  }
  return output.join('\n')
}

export async function translateDocument(
  english: string,
  route: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const { frontmatter, body } = splitFrontmatter(english)
  const localizedFrontmatter =
    frontmatter === null
      ? null
      : route === 'index.md'
        ? await translateHomeFrontmatter(frontmatter, locale, provider)
        : frontmatter
  const translatedBody = await translateMarkdown(addStableHeadingAnchors(body), locale, provider)
  const metadata = [
    `translation_locale: ${locale.key}`,
    `translation_source: /${route}`,
    `translation_source_hash: ${sha256(english)}`,
    `translation_status: ${TRANSLATION_STATUS}`,
    `translation_engine: ${provider.engine ?? GOOGLE_TRANSLATION_ENGINE}`,
  ]
  if (localizedFrontmatter !== null) metadata.push('', localizedFrontmatter)
  const bodySeparator = translatedBody.startsWith('\n') || !translatedBody ? '' : '\n'
  return stripTrailingWhitespaceOutsideFences(`---\n${metadata.join('\n')}\n---\n${bodySeparator}${translatedBody}`)
}

/** Synchronize stable English heading IDs into existing translated pages without retranslating prose. */
export async function synchronizeTranslationHeadingAnchors(
  options: SynchronizeHeadingAnchorOptions = {},
): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }

  const anchorsByRoute = new Map<string, string[]>()
  await Promise.all(
    routes.map(async (route) => {
      const english = await readFile(path.join(sourceRoot, route), 'utf8')
      anchorsByRoute.set(
        route,
        markdownHeadings(splitFrontmatter(english).body).map((heading) => heading.stableAnchor),
      )
    }),
  )

  const updates: Array<{ content: string; target: string }> = []
  for (const locale of locales) {
    for (const route of routes) {
      const target = path.join(sourceRoot, locale.path, route)
      const content = await readFile(target, 'utf8')
      const document = splitFrontmatter(content)
      const anchoredBody = applyStableHeadingAnchors(document.body, anchorsByRoute.get(route)!)
      const prefixLength = content.length - document.body.length
      updates.push({ target, content: content.slice(0, prefixLength) + anchoredBody })
    }
  }
  await Promise.all(updates.map(({ target, content }) => writeFile(target, content)))
}

/** Synchronize English heading IDs and container keywords without retranslating prose. */
export async function synchronizeTranslationMarkdownStructure(
  options: SynchronizeMarkdownStructureOptions = {},
): Promise<void> {
  await synchronizeTranslationHeadingAnchors(options)

  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }

  const directivesByRoute = new Map<string, MarkdownContainerDirective[]>()
  await Promise.all(
    routes.map(async (route) => {
      const english = await readFile(path.join(sourceRoot, route), 'utf8')
      directivesByRoute.set(route, markdownContainerDirectives(splitFrontmatter(english).body))
    }),
  )

  const updates: Array<{ content: string; target: string }> = []
  for (const locale of locales) {
    for (const route of routes) {
      const target = path.join(sourceRoot, locale.path, route)
      const content = await readFile(target, 'utf8')
      const document = splitFrontmatter(content)
      const synchronizedBody = applyStableContainerDirectives(document.body, directivesByRoute.get(route)!)
      const prefixLength = content.length - document.body.length
      updates.push({ target, content: content.slice(0, prefixLength) + synchronizedBody })
    }
  }
  await Promise.all(updates.map(({ target, content }) => writeFile(target, content)))
}

async function parallelMap<T>(
  values: readonly T[],
  concurrency: number,
  operation: (value: T, index: number) => Promise<void>,
): Promise<void> {
  let cursor = 0
  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor
      cursor += 1
      await operation(values[index], index)
    }
  })
  await Promise.all(workers)
}

export async function generateTranslations(options: GenerateOptions = {}): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const concurrency = options.concurrency ?? 4
  const provider = options.provider ?? new GoogleTranslationProvider()
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new Error('Translation concurrency must be an integer from 1 through 16')
  }

  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }
  const sources = new Map<string, string>()
  await Promise.all(
    routes.map(async (route) => {
      sources.set(route, await readFile(path.join(sourceRoot, route), 'utf8'))
    }),
  )
  const dependencies = await routeDependencies(sourceRoot, sources)

  const stagingRoot = await mkdtemp(path.join(path.dirname(sourceRoot), `.iroha-docs-translation-${process.pid}-`))
  try {
    for (const locale of locales) {
      const localeRoot = path.join(sourceRoot, locale.path)
      const stagedLocaleRoot = path.join(stagingRoot, locale.path)
      const backupLocaleRoot = path.join(stagingRoot, `${locale.path}-previous`)
      const scope = options.routes ? 'selected pages' : 'pages'
      console.log(`Translating ${routes.length} ${scope} to ${locale.label} (${locale.key})…`)
      await parallelMap(routes, concurrency, async (route, index) => {
        const target = path.join(stagedLocaleRoot, route)
        let translated
        try {
          translated = await translateDocument(sources.get(route)!, route, locale, provider)
        } catch (error) {
          throw new Error(`${locale.key}/${route}: ${error instanceof Error ? error.message : String(error)}`, {
            cause: error,
          })
        }
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, translated)
        if ((index + 1) % 10 === 0 || index + 1 === routes.length) {
          console.log(`[${locale.key}] ${index + 1}/${routes.length}`)
        }
      })
      for (const dependency of dependencies.keys()) {
        const target = path.join(stagedLocaleRoot, dependency)
        await mkdir(path.dirname(target), { recursive: true })
        await copyFile(path.join(sourceRoot, dependency), target)
      }
      await assertEnglishSnapshot(sourceRoot, availableRoutes, sources, dependencies)

      if (options.routes) {
        for (const route of routes) {
          const target = path.join(localeRoot, route)
          await mkdir(path.dirname(target), { recursive: true })
          await rename(path.join(stagedLocaleRoot, route), target)
        }
        for (const dependency of dependencies.keys()) {
          const target = path.join(localeRoot, dependency)
          await mkdir(path.dirname(target), { recursive: true })
          await rename(path.join(stagedLocaleRoot, dependency), target)
        }
      } else {
        await replaceDirectoryAtomically(localeRoot, stagedLocaleRoot, backupLocaleRoot)
      }
    }
    await assertEnglishSnapshot(sourceRoot, availableRoutes, sources, dependencies)
  } finally {
    await rm(stagingRoot, { recursive: true, force: true })
  }
}

interface TranslationCliOptions {
  locales: readonly DocsLocale[]
  routes?: readonly string[]
  concurrency: number
  providerName: 'google' | 'nllb'
  python?: string
  model?: string
  synchronizeAnchors: boolean
  synchronizeStructure: boolean
}

function parseCli(argv: string[]): TranslationCliOptions {
  let selectedKeys: string[] = []
  let routes: string[] | undefined
  let concurrency = 4
  let providerName: 'google' | 'nllb' = 'google'
  let python: string | undefined
  let model: string | undefined
  let synchronizeAnchors = false
  let synchronizeStructure = false
  for (const argument of argv) {
    if (argument.startsWith('--locale=')) {
      selectedKeys = argument
        .slice('--locale='.length)
        .split(',')
        .map((key) => key.trim())
        .filter(Boolean)
    } else if (argument.startsWith('--route=')) {
      routes = [
        ...(routes ?? []),
        ...argument
          .slice('--route='.length)
          .split(',')
          .map((route) => route.trim())
          .filter(Boolean),
      ]
    } else if (argument.startsWith('--concurrency=')) {
      concurrency = Number(argument.slice('--concurrency='.length))
    } else if (argument.startsWith('--provider=')) {
      const requestedProvider = argument.slice('--provider='.length)
      if (requestedProvider !== 'google' && requestedProvider !== 'nllb') {
        throw new Error(`Unknown translation provider: ${requestedProvider}`)
      }
      providerName = requestedProvider
    } else if (argument.startsWith('--python=')) {
      python = argument.slice('--python='.length)
      if (!python) throw new Error('--python requires an executable path')
    } else if (argument.startsWith('--model=')) {
      model = argument.slice('--model='.length)
      if (!model) throw new Error('--model requires a CTranslate2 model path')
    } else if (argument === '--sync-anchors') {
      synchronizeAnchors = true
    } else if (argument === '--sync-structure') {
      synchronizeStructure = true
    } else {
      throw new Error(`Unknown translation option: ${argument}`)
    }
  }
  const locales = selectedKeys.length
    ? selectedKeys.map((key) => {
        const locale = TRANSLATED_LOCALES.find((candidate) => candidate.key === key)
        if (!locale) throw new Error(`Unknown locale: ${key}`)
        return locale
      })
    : TRANSLATED_LOCALES
  if (synchronizeAnchors && synchronizeStructure) {
    throw new Error('--sync-anchors and --sync-structure are mutually exclusive')
  }
  if (!synchronizeAnchors && !synchronizeStructure && providerName === 'nllb' && !model) {
    throw new Error('--provider=nllb requires --model=<CTranslate2 model path>')
  }
  if (!synchronizeAnchors && !synchronizeStructure && providerName === 'google' && (python || model)) {
    throw new Error('--python and --model are only valid with --provider=nllb')
  }
  return {
    locales,
    routes,
    concurrency,
    providerName,
    python,
    model,
    synchronizeAnchors,
    synchronizeStructure,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { locales, routes, concurrency, providerName, python, model, synchronizeAnchors, synchronizeStructure } =
    parseCli(process.argv.slice(2))
  ;(async () => {
    if (synchronizeAnchors) {
      await synchronizeTranslationHeadingAnchors({ locales, routes })
      return
    }
    if (synchronizeStructure) {
      await synchronizeTranslationMarkdownStructure({ locales, routes })
      return
    }
    const provider: TranslationProvider =
      providerName === 'nllb' ? new NllbTranslationProvider({ python, model: model! }) : new GoogleTranslationProvider()
    try {
      await generateTranslations({ locales, routes, concurrency, provider })
    } finally {
      await provider.close?.()
    }
  })().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
