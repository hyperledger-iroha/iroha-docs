---
translation_locale: he
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha הוראות מיוחדות {#iroha-special-instructions}

כשדיברנו על [איך? Iroha פועלת](/he/blockchain/iroha-explained), אמרנו את זה Iroha הוראות מיוחדות הן הדרך היחידה לשנות את מדינת העולם. איזה סוג של הוראות מיוחדות יש לנו? אם קראתם את המדריכים ספציפיים לשפה אתה כבר ראית כמה הוראות: `Register<Account>` ו `Mint<Numeric>`.

הנה רשימה מלאה של הוראות מיוחדות Iroha:

|הוראות |תיאור |
| --------------------------------------------------------- | ------------------------------------------------ |
| [רשום/לא רשום ](#un-register) |תן ID לישות חדשה ב-blockchain. |
| [מנט/ברן ](#mint-burn) |נכסים מספריים מנט/שרוף או מפעילים חוזרים. |
| [SetKeyValue/RemoveKeyValue ](#setkeyvalue-removekeyvalue) |עדכון נתונים מטאטא של אובייקטים בלשנה. |
| [SetParameter](#setparameter) |להגדיר פרמטר רחב שרשרת. |
| [סיוע / ביטול ](#grant-revoke) |לתת או להסיר רשיונות ותפקידים. |
| [העברת ](#transfer) |העברה בעלות או ערך נכס. |
| [אבטחה מקומית ומנעול נכסים ](#native-escrow-and-asset-locks) |סגור נכסים מספרים בפיקוח פרוטוקול. |
| [ExecuteTrigger](#executetrigger) |תפעיל את התניעים.|
| [רישום / מנהל / שיפור ](#other-instructions) |רשום, להרחיב או לשפר את ההתנהגות של זמן ההפעלה. |

בואו נתחיל עם סיכום של Iroha הוראות מיוחדות; אילו אובייקטים כל הוראה יכולה להתקשר אליהם ומה הוראות זמינות עבור כל אובייקט.

## סיכום {#summary}

עבור כל הוראה, יש רשימה של אובייקטים שבהם ניתן להפעיל את ההוראה הזו. לדוגמה, גרסאות העברה מכסות אובייקטות ספרים גדולים וערכויות מספריות, בעוד מיטינג מכסה נכסים מספריים ומניע חוזרים.

בהוראות מסוימות נדרש תיאור יעד. לדוגמה, אם אתה מעביר נכסים, עליך תמיד לציין לאיזה חשבון אתה מעביר אותם. מצד שני, כאשר אתה רשם משהו, כל מה שאתה צריך הוא האובייקט שאתה רוצה להירשם.

|הוראות |אובייקטים |יעד |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |דומיין רגיל, נקודת כינוי של חלל נתונים, ונקודת כינוי חשבון |                      |
| [רשום/לא רשום ](#un-register) |חשבונות, הגדרות נכסים, NFTs, תפקידים, גורמים להפעיל, שווים; הסרת תחום |                      |
| [מנט/ברן ](#mint-burn) |נכסים מספריים, פעולות חוזרות.|חשבונות או גורמים .|
| [SetKeyValue/RemoveKeyValue ](#setkeyvalue-removekeyvalue) |אובייקטים שיש להם [מטא נתונים](./metadata.md): תחומים, חשבונות, הגדרות נכסים, NFTs, RWAs, גורמים |                      |
| [SetParameter](#setparameter) |פרמטרים של שרשרת |                      |
| [סיוע / ביטול ](#grant-revoke) | [תפקידים, סימני רשיון ](/he/blockchain/permissions.md) |חשבונות או תפקידים |
| [העברת ](#transfer) |תחומים, הגדרות נכסים, נכסי מספרים, NFTs |חשבונות |
| [אבטחה מקומית ומנעול נכסים ](#native-escrow-and-asset-locks) |מאבטחות נכסים מספריות, סגרות נכסים, מחויבות מאבטחות אנוניות |קונים, יעדים, או מחלוקות|
| [ExecuteTrigger](#executetrigger) |תפעילים.|                      |
| [רישום / מנהל / שיפור ](#other-instructions) |רישומים, מטענים מועילים ספציפיים למבצעים, עדכונים למבצע. |                      |

יש גם דרך אחרת להסתכל על ISI, במונחים של אובייקט הספר הגדול שהם נוגעים בו:

|מטרה.|הוראות |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|חשבון |רשום / לא רשום חשבונות, לקבלת נכסים, מעודכנת נתונים מטאטא של חשבון, היתר/ביטול רשימות תפקידים |
|תחום |להבטיח הגדרת תחום, לא להירשם תחומים, להעביר את הבעלות על תחום, לעדכן מטא נתונים של תחום.|
|הגדרה של נכסים |הגדרות של רישום/לא רישום, העברת הבעלות, מעדכנת נתונים מטא |
|נכסים |כמות מספרית של מנט/שרוף, כמות מספרת העברה |
|אבטחה |לפתוח, לקבל, לסמן את התשלום שנשלח, לשחרר, לבטל, להתווכח, לפתור, להוריד או להסתיים רישומי שימור מקורי.|
|NFT |רשום/לא רשום NFTs, העברה של הבעלות, מעודדת מטא נתונים |
|RWA |רשום הרבה, כמות העברה, אחסון/שחרור, קפוא/הקפוא, חיסול, מיזוג, מעדכנת נתונים מטאטא ותשלומים |
|תפעיל |רשום/לא רשום, חוזרים על תפעול מנט/שרוף, תפעול תפעול, מעדכן מטא-מנתונים של תפעול |
|העולם |רישום/הפסקת רישום עמיתים ותפקידים, הגדרת פרמטרים, העדכון של המפעיל |

## CLI דוגמא {#cli-examples}

הדוגמאות בעמוד זה מניחה שאתה פועל פקודות מהחלל העבודה Iroha מעלה נגד ההסדרת המקומית המקובלת של הלקוח:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

אם אינסטלתם את `iroha` בינארי, השתמשו במקום `iroha --config ./defaults/client.toml`. תחליפו את בעלי המקומות למטה עם ערכים מהרשת שלכם:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

כאשר מכוונים לציבור Taira רשת מבחן, להשתמש ב Taira קונפיגירציה של הלקוח. לפני הפעלת דוגמאות בתשלום, שמור את עוזר המזרקה [קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) כמו `taira_faucet_claim.py`, לאחר מכן תביעה טסטנט XOR מהפצצה:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

לאחר שהסכום המיועד למנקה נראה, תלוף את הנתונים המתאימים של נכסי הגז הנדרשים כדי לכתוב עסקאות:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` הוא הנתיב הרגיל של שחרור ראשוני ליצירת דומיינים SNS זה מחייב באופן הצהיר את מרחב הנתונים המדויק, הבעלים, תקופת השכירות, וביטחון הציטוט, ואז יוצר או תיקון את כל המצב הנדרש באופן אטומי. `POST /v1/aliases/setup/plan` נקודת סוף או התאמה CLI זרימת עבודה:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

כוונה ותוכנית הם ללא סודות, אבל תחיל סימנים של צעדים ומגיש עסקאות רגילות עם החשבון המוגדר. תוכנית קשורה לשרשרת שלה, סמכות, מעגל מצב חי, ומוחלף; אף פעם לא להשתמש שוב ברשת אחרת.

## (לא) רשום {#un-register}

רישום או לא רישום הם ההוראות המשמשות להעניק ID ליחידה חדשה ב-blockchain.

כל מה שניתן להירשם הוא גם `Registrable` וגם `Identifiable`, אבל לא כל מה שהוא `Identifiable` הוא `Registrable`. רוב הדברים נרשמים ישירות, אך במקרים מסוימים ייצוג ב-blockchain כולל נתונים רבים יותר. מסיבות אבטחה וביצועים, אנו משתמשים בבניינים עבור מבנים נתונים כאלה (למשל `NewAccount`), והרשמה של עמיתים יש הוראה מיוחדת להוכיח בעלות. ככלל, כל דבר שניתן לרשום יכול גם להיות לא רשום, אבל זו אינה חוק קשה ומהירה.

אתה יכול לרשום חשבונות, הגדרות נכסים, NFTs, עמיתים, תפקידים ומפעילים. שימוש בהקמת תחום `EnsureAlias`; החומרה `Register::Domain` מטען מועיל מיועד ל-genesis/bootstrap. השימוש ברישום עמיתים `RegisterPeerWithPop`, אשר יש בה הוכחה של רכוש עבור המפתח הדמיוני. [שמות של ישיבות](/he/reference/naming.md) כדי ללמוד על הגבלות שהוקמו על שמות יחידות.

סוגי RWA נוצרו באמצעות ההוראה המיוחדת `RegisterRwa`. הקוד הנוכחי אינו חושף הוראה `UnregisterRwa`; השתמש ב `RedeemRwa` כדי לפרוש את הכמות המוצגת.

::: info

ציין כי תלוי איך אתה מחליט להגדיר את [בלוק הגנזה](/he/guide/configure/genesis.md) ב `genesis.json` (במיוחד, בין אם אתה כולל או לא רישום של סימני אישור), תהליך הרישום של חשבון יכול להיות שונה מאוד. באופן כללי, ניתן לסכם את זה כך:

- ב-blockchain ציבורי, כל אחד צריך להיות מסוגל להירשם חשבון.
- בבלוקצ'יין פרטי, יכול להיות תהליך ייחודי לרשום חשבונות. בבלוקץ'ין פרטי טיפוסי, כלומר בלוקצ'ין ללא כל תהליכים ייחודיים לרשום חשבונים, אתה צריך חשבון כדי לרשום חשבון אחר.

אנחנו מתארים את ההבדלים האלה בפרטים כאשר אנו משווים [ blockchain פרטי וציבורי ](/he/guide/configure/modes.md).

:::

::: info

רישום שוויון הוא כיום הדרך היחידה להוסיף שווינים שלא היו חלק מהשוויון האמיני המקורי שהוקם לרשת.

:::

השתמשו בהנחיות ספציפיות לשפה כדי לרשום אובייקטים ב-blockchain:

|שפה |מדריך |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |השתמש [Iroha CLI](/he/get-started/operate-iroha-via-cli.md) להגדיר דומיינים ולרשום חשבונות ומשאבים. |
|Rust |השתמשו בתרגיל [Rust ](/he/guide/tutorials/rust.md). |
|Kotlin/Java |השתמש ב- [Kotlin/Java tutorial](/he/guide/tutorials/kotlin-java.md). |
|Python |השתמשו בתרגיל [Python ](/he/guide/tutorials/python.md). |
|JavaScript/TypeScript |השתמשו בהוראה [JavaScript/TypeScript ](/he/guide/tutorials/javascript.md).|

תכנן ותחיל את הגדרת הדומיין הרגילה, ולאחר מכן לא רשום את הדומיין כאשר הוא כבר לא נחוץ:

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

חשבונות רשומים או לא רשומים:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

הגדרות נכסים רשומות ולא רשומות:

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

רישום ולא רשום NFTs. רישום NFT קורא את התוכן שלו JSON מתוך הכניסה סטנדרטית:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

תפקידים להירשם וללא לרשום:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

רישום וחיסול תפעילים. הרישום של התפעיל זקוק לקוד בייט IVM או לרשימת הוראות מסורתית. דוגמה זו מבננת הוראה `Log` עם CLI ומניעה אותה לתוך הרישום של תפעיל:

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

רשום או לא רשום עמיתים. ליצור את המפתח BLS ו PoP עם `kagami` אם עדיין אין לך אותם:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## מינט/ברן {#mint-burn}

חיתוך ושרוף יכולים להצביע על נכסים מספריים ומפעילים עם מספר מוגבל של חוזרים. נכסים מסוימים עשויים להיות מכריזים כלא-חיתופים, כלומר הם יכולים להיות חיתוכים רק פעם אחת לאחר הרישום.

נכסים מופעלים על חשבון מסוים, בדרך כלל זה שהרשם את הנכס מלכתחילה. כמויות הנכסים הן לא שליליות, כך שאתה אף פעם לא יכול להיות `$-1.0` של נכס או לשרוף סכום שלילי ולקבל מנטה.

השתמשו בהנחיות ספציפיות לשפה עבור נכסי ה-mint blockchain:

- [CLI](/he/get-started/operate-iroha-via-cli.md)
- [Rust](/he/guide/tutorials/rust.md)
- [Kotlin/Java](/he/guide/tutorials/kotlin-java.md)
- [Python](/he/guide/tutorials/python.md)
- [JavaScript/TypeScript](/he/guide/tutorials/javascript.md)

הנה דוגמאות של נכסים שרפים:

- [CLI](/he/get-started/operate-iroha-via-cli.md)
- [Rust](/he/guide/tutorials/rust.md)

נכסים מספריים של מנט וברון:

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

חוזרים על תירוץ מנטה ושרוף:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## העברה {#transfer}

העברות מעבירות את הבעלות או הערך בין חשבונות. גרסאות העברה גנריות מכילות דומנים, הגדרות נכסים, נכסים מספריים ו NFTs. תנועת הכמות RWA משתמשת בהוראות המخصصות `TransferRwa` ו`ForceTransferRwa` המתוארות ב [ נכסי העולם האמיתי ](/he/blockchain/rwas.md).

כדי לעשות זאת, יש לתת חשבון [רשות להעביר נכסים](/he/reference/permissions.md). ראו דוגמה על איך להעביר נכסים עם [CLI](/he/get-started/operate-iroha-via-cli.md) או [Rust](/he/guide/tutorials/rust.md).

העברת נכסים מספרים:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

תחום העברה, הגדרה של נכס וחיינות NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## אבטחה מקומית ונעלי נכסים {#native-escrow-and-asset-locks}

הוראות אבטחת מקומית מנעילות נכסים מספריים בפיקוח פרוטוקול מנהל בספר. הם משמשים לפיצוי סגנון שוק, מנעולים נכסים גנטיים, וזרמי אבטחה מוגן אנונימיים.

השימוש בשכנות הבנקאות `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, ו `ResolveEscrowDispute`. שימוש במנעולים נכסים כלליים `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, ו `ExpireAssetLock`. הבטחון אנונימי משקף את מחזור החיים של השוק עם `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, ו `ResolveAnonymousEscrowDispute`.

אלה ISIs אין כיום פקודות של מדרגה ראשונה CLI. השתמשו בפיתוחים דפוס SDK או עומסים מועילים של הוראות סדרתיות, וראו [ נטיף נכס Escrow ](/he/blockchain/escrow.md) עבור פרטים מחזור החיים, אישורות, שאילויות, אירועים ו Rust דוגמאות .

## סיוע / ביטול {#grant-revoke}

ההוראות על היתר והביטול משמשות עבור רשיונות חשבון [ ותפקידים](permissions.md).

`Grant` משמשת כדי להעניק באופן קבוע למשתמש אישור אחד או קבוצה של רשיונות (רשימה). תפקידים ורשיונות שניתנו יכולים להימחק רק באמצעות ההוראה `Revoke`.

להעניק או לבטל תפקיד בחשבון:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

סימני אישור וביטול. פקודות אישור קוראים אובייקט אישור מהכניסה סטנדרטית:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

להעניק או לבטל רשיונות על תפקיד:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

הוראות אלה מעודכנות אובייקט [מטא נתונים](/he/blockchain/metadata.md). השתמשו ב- `SetKeyValue` כדי להוסיף או להחליף כניסה של מטא נתונים ו- `RemoveKeyValue` למחוק אחת.

פקודות מטאדאטה `set` קוראים את הערך JSON מהכניסות סטנדרטיות:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

דפוס זהה זמין עבור חשבונות, הגדרות נכסים, NFTs, RWAs, ומניעים:

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

`SetParameter` משנה פרמטרים בכל שרשרת המחשבים על ידי מודל הנתונים הפעיל והפעיל.

להגדיר פרמטר על ידי העברת אובייקט פרמטר אחד JSON בהכנסת סטנדרטית:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ההוראה הזו משמשת להפעיל [ניצולים ](./triggers.md).

ה- CLI יכול לרשום תפעילים ולהתגייס לאירועים של ביצוע תפעיל ישירות. הוא אינו מספק פקודה `execute trigger` מודבקת, כך כדי להגיש הוראה ידנית `ExecuteTrigger`. ליצור סדרה `InstructionBox` עם כלי SDK או מכשיר מבצע, ולמלא את מערך JSON המוצא דרך `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## הוראות אחרות {#other-instructions}

Iroha חושף גם הוראות רמה נמוכה יותר עבור אינטגרציה של זמן הפעלה ושל מבצעים:

- `Log`: להוציא רישום ליומן במהלך ביצועו
- `CustomInstruction`: לשאת מטענים מועילים ספציפיים למבצע JSON
- `Upgrade`: להפעיל מעדכן של מבצע

להגיש הוראה `Log` עם עוזר הפינג:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

הגיש הוראה אישית למפעיל כתיבת סדרתית `InstructionBox`. צורה של המטען מועיל היא ספציפית למפעיל, אז ליצור את ההוראה עם התאמה SDK או כלי המפעיל:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

העדכון של המפעיל מתוך קבוצה של קוד בייט IVM מסומנת:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
