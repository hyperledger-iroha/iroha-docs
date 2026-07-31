---
translation_locale: he
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha הוראות מיוחדות {#iroha-special-instructions}

כשדיברנו על [איך? Iroha עובדת](/he/blockchain/iroha-explained), אנחנו
אמר שזה Iroha הוראות מיוחדות הן הדרך היחידה לשנות את העולם.
אז, איזה סוג של הוראות מיוחדות יש לנו?
מדריכים ספציפיים לשפה בהוראה זו, כבר ראיתם כמה
הוראות: `Register<Account>` ו `Mint<Numeric>`.

הנה רשימה מלאה של Iroha הוראות מיוחדות:

| הוראות                                               | תיאור                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [רשום/לא רשום](#un-register)                       | תגידי ID לאחידה חדשה ב-blockchain.    |
| [מנט/ברן](#mint-burn)                                   | נכסים מספרים של מנט/שרוף או חוזרים מפעילים. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | עדכון נתונים מטאטא של אובייקטים בבלוקצ'ין.               |
| [SetParameter](#setparameter)                             | להגדיר פרמטר לכל שרשרת.                      |
| [סיוע / ביטול](#grant-revoke)                             | לתת או להסיר רשיונות ותפקידים.            |
| [העברה](#transfer)                                     | העברה בעלות או ערך נכס.               |
| [סגרות אבטחה וביטוי נכסים](#native-escrow-and-asset-locks) | סגור נכסים מספרים בפיקוח של פרוטוקול.     |
| [ExecuteTrigger](#executetrigger)                         | תפעיל את ההצלה.                                |
| [רישום/הגדרות/התקדמות](#other-instructions)                 | רשום, להרחיב או לשפר את התנהגותו בזמן ההפעלה.        |

בואו נתחיל עם סיכום של Iroha הוראות מיוחדות; אילו מטרות כל אחת
הוראות ניתן לבקש ואיזה הוראות זמינות לכל אחד
אובייקט.

## סיכום {#summary}

עבור כל הוראה, יש רשימה של אובייקטים בהם ההוראה
ניתן להפעיל על. לדוגמה, וריאציות העברה מכסות אובייקטים של ספריה
וכספי המספרים, בעוד שחיסול מכסה נכסים מספריים ומניע
חוזרים.

בהוראות מסוימות נדרש תיאור יעד.
אתה מעביר נכסים, אתה תמיד צריך לציין לאיזה חשבון אתה
מצד שני, כשאתה רשם משהו
כל מה שאתה צריך הוא את האובייקט שרוצה לרשום.

| הוראות                                               | חפצים                                                                                                 | יעד          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | דומיין רגיל, יישומים של חלל נתונים ושינויים של חשבונות                                                 |                      |
| [רשום/לא רשום](#un-register)                       | חשבונות, הגדרות נכסים, NFTs, תפקידים, מפעילים, שווים; הסרת תחום                                |                      |
| [מנט/ברן](#mint-burn)                                   | נכסים מספריים, חוזרים מפעילים                                                                     | חשבונות או גורמים |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | חפצים שיש להם [נתונים מטא](./metadata.md): תחומים, חשבונות, הגדרות נכסים, NFTs, RWAs, תפעילים |                      |
| [SetParameter](#setparameter)                             | פרמטרים של שרשרת                                                                                        |                      |
| [סיוע / ביטול](#grant-revoke)                             | [תפקידים, סימני אישור](/he/blockchain/permissions.md)                                                  | חשבונות או תפקידים    |
| [העברה](#transfer)                                     | תחומים, הגדרות נכסים, נכסים מספריים, NFTs                                                        | חשבונות             |
| [סגרות אבטחה וביטוי נכסים](#native-escrow-and-asset-locks) | סכומים של נכסים מספרים, נעולות נכסים, מחויבות בסכום אנונימית                                    | קונים, יעדים או מחלוקות |
| [ExecuteTrigger](#executetrigger)                         | תפעילים                                                                                                |                      |
| [רישום/הגדרות/התקדמות](#other-instructions)                 | רישומים, עומסים מועילים ספציפיים למבצעים, עדכונים למבצעי                                                     |                      |

יש גם דרך אחרת להסתכל ISI, במונחים של אובייקט ההדף
הם נוגעים:

| מטרה           | הוראות                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| חשבון          | רישום/הפסקת הרישום של חשבונות, נכסים מקבלים, מתנתונים מעודכנים של חשבון, היתרות ושינויים בתפקידים    |
| תחום           | לוודא הקמת תחום, ביטול רישום תחומים, העברת הבעלות על תחום, עדכון מטא נתונים של תחום                    |
| הגדרה של נכסים | הגדרות של רישום/לא רישום, השתלטות על העברה, מעדכנת מטא נתונים                                         |
| נכסים            | כמות מספרית של מנט/שריפה, כמות מספרת העברה                                                        |
| סכום שכר           | לפתוח, לקבל, לסמן את התשלום שנשלח, לשחרר, לבטל, להתווכח, לפתור, להוריד או להסתיים רישומי שימור מקורי |
| NFT              | רשום/לא רשום NFTs, העברת הבעלות, מעדכן מטא נתונים                                                |
| RWA              | רשום הרבה, כמות העברה, אחסון/שחרור, קפוא/הקפוא, חיסול, מיזוג, מעדכנת נתונים מטאטא ופיקוח |
| מפיץ          | רשום/לא רשום, חוזרים על תפעול מנט/שרוף, תפעול תפעול, מעודכנת נתונים מטאטא                 |
| העולם            | רישום/הפסקת רישום עמיתים ותפקידים, הגדרת פרמטרים, העדכון של המפעיל                                    |

## CLI דוגמאות {#cli-examples}

הדוגמאות בדף זה מניחים שאתה פועל פקודות מהזרם העליון
Iroha חלל עבודה מול הגדרת הלקוח המקומי המקובלת:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

אם אתה מתקין את `iroha` בינרי, שימוש
`iroha --config ./defaults/client.toml` תחליף את בעלי המקומות
למטה עם ערכי רשתך:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

כאשר מכוונים לציבור Taira רשת מבחן, השתמש Taira הגדרת הלקוח.
לפני שתפעיל דוגמאות משלמות, שמור את עוזר המנקה
[קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
כמו `taira_faucet_claim.py`, אז תביעה טסטנט XOR מהפלט:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

לאחר שהסכום המיועד למנקה נראה, תוסף את הסכום הגז הנדרש
נתונים מטאטאליים כדי לכתוב עסקאות:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` הוא הנתיב הרגיל של שחרור ראשוני ליצירת תחומים
הנתונים SNS הוא מחייב באופן הצהיר את מרחב הנתונים המדויק, בעל,
אז יוצר או תיקון את כל המצב הנדרש אטומטית.
השתמשו באותנטיקה `POST /v1/aliases/setup/plan` נקודת הסיום או התאמה
CLI זרימת עבודה:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

כוונה ותוכנית הם ללא סודות, אבל ליישם סימנים של צעדים ומגיש
עסקה רגילה עם החשבון המוגדר.
שרשרת, סמכות, מעגל של מדינה חי, ומקבילות; לעולם לא להשתמש אחד על השני
רשת.

## (לא) רשום {#un-register}

רישום או לא רישום הם ההוראות המשמשות ID ל-
יחידה חדשה ב-blockchain.

כל מה שניתן להירשם הוא שניהם `Registrable` ו `Identifiable`,
אבל לא כל מה ש `Identifiable` הוא `Registrable`. רוב הדברים הם
רשום ישירות, אבל במקרים מסוימים ייצוג ב blockchain
יש הרבה יותר נתונים. מסיבות אבטחה וביצועים, אנו משתמשים
בונים של מבנים נתונים כאלה (למשל: `NewAccount`), ו- peer
הרישום יש הוראה מיוחדת להוכיח כי הוא בעל.
כל דבר שניתן להירשם יכול להיות גם לא רשום, אבל זה לא
חוק קשה ומהיר.

אתה יכול לרשום חשבונות, הגדרות נכסים, NFTs, עמיתים, תפקידים ו
תפעילים. השימוש בהקמת תחום `EnsureAlias`; החומרי `Register::Domain` מטען מועיל
הוא מוגבל ל-genesis/bootstrap.
`RegisterPeerWithPop`, יש בו הוכחה של רכוש למפתח הדמיון.
[שמות של ישיבות](/he/reference/naming.md) כדי ללמוד על המגבלות
לשים שם של יחידות.

RWA הרבה יוצרים באמצעות הקדמון `RegisterRwa` ההוראה.
הקוד הנוכחי לא חושף `UnregisterRwa` הוראות; שימוש
`RedeemRwa` כדי לפרוש את הכמות המוצגת.

::: info

שימו לב כי תלוי איך אתה מחליט להגדיר את
[בלוק הגנזה](/he/guide/configure/genesis.md) ב `genesis.json`
(במיוחד, בין אם אתה כולל או לא רישום הרשות
התהליך של רישום חשבון יכול להיות שונה מאוד.
גנרל, אנחנו יכולים לסכם את זה ככה:

- ב- _ציבורי_ ב-blockchain, כל אחד צריך להיות מסוגל לרשום חשבון.
- ב- _פרטי_ ב-blockchain, יכול להיות תהליך ייחודי להירשם
  חשבונות. _טיפוסי_ blockchain פרטי, כלומר blockchain ללא
  כל תהליכים ייחודיים לרשום חשבונות, אתה צריך חשבון
  רשום חשבון אחר.

אנחנו מדברים על ההבדלים האלה בפרטים כאשר
[השוואה של בלוקשיינים פרטיים וציבוריים](/he/guide/configure/modes.md).

:::

::: info

רישום עמית הוא כרגע הדרך היחידה להוסיף עמיתים שלא היו
חלק מהחבר האמיני המקורי שהוקם לרשת.

:::

Refer לאחד מדריכי השפה ספציפיים להוביל אותך
תהליך הרישום של אובייקטים ב-blockchain:

| שפה              | מדריך                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | השתמש ב [Iroha CLI](/he/get-started/operate-iroha-via-cli.md) להקים תחומים ולרשום חשבונות ומשאבים. |
| Rust                  | השתמש ב [Rust הוראות](/he/guide/tutorials/rust.md).                                                      |
| Kotlinג'אווה           | השתמש ב [Kotlin/טוריאלי ג'אווה](/he/guide/tutorials/kotlin-java.md).                                        |
| Python                | השתמש ב [Python הוראות](/he/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | השתמש ב [JavaScript/TypeScript הוראות](/he/guide/tutorials/javascript.md).                               |

תכנן ותתחיל את הגדרת הדומיין הרגילה, ואז לא רשום את הדומיין כאשר הוא אינו
נדרש זמן רב יותר:

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

חשבונות רשומים ובלתי רשומים:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

הגדרות נכסים להירשם ולא להירשם:

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

רישום וחיסום NFTs. NFT רישום קורא את התוכן שלו JSON מ
כניסה סטנדרטית:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

תפקידי רישום וחיסום:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

רישום ומסיר רישום תפעילים.
הוספת IVM בייטקוד או רשימה של הוראות סדרתית. דוגמה זו בונה
א `Log` הוראות עם CLI ומניע את זה לרשימת ההדק:

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

להירשם וללא להירשם עמיתים BLS מפתח ו PoP עם `kagami`
אם אין לך אותם כבר:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## מנט/ברן {#mint-burn}

ממתק ושרוף יכולים להתייחס לאספקי מספרים ומפעילים עם מוגבל
מספר חוזרים. נכסים מסוימים יכולים להיות מכריזים כבלתי נזורים, כלומר
כי הם יכולים להידפוק רק פעם אחת לאחר הרישום.

נכסים מופעלים על חשבון מסוים, בדרך כלל זה שהרשם
סכומים של נכסים הם לא שליליים, כך שאתה יכול
אף פעם לא `$-1.0` של נכס או לשרוף סכום שלילי ולקבל מנטה.

פנה לאחד מדריכים ספציפיים לשפה כדי להוביל אותך
תהליך גיוס נכסים ב-blockchain:

- [CLI](/he/get-started/operate-iroha-via-cli.md)
- [Rust](/he/guide/tutorials/rust.md)
- [Kotlinג'אווה](/he/guide/tutorials/kotlin-java.md)
- [Python](/he/guide/tutorials/python.md)
- [JavaScript/TypeScript](/he/guide/tutorials/javascript.md)

הנה דוגמאות של נכסים שרופים:

- [CLI](/he/get-started/operate-iroha-via-cli.md)
- [Rust](/he/guide/tutorials/rust.md)

נכסים מספרים של מטבעות ומשרפים:

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

העברות מעבירות בעלות או ערך בין חשבונות.
וריאנטים מכילים תחומים, הגדרות נכסים, נכסים מספריים, NFTs. RWA
תנועת כמות משתמשת `TransferRwa` ו `ForceTransferRwa`
הוראות המתוארות ב: [נכסים בעולם האמיתי](/he/blockchain/rwas.md).

כדי לעשות זאת, יש לתת חשבון
[רשות להעביר נכסים](/he/reference/permissions.md). קראו
דוגמה על איך להעביר נכסים עם
[CLI](/he/get-started/operate-iroha-via-cli.md) או
[Rust](/he/guide/tutorials/rust.md).

העברת נכסים מספרים:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

תחום העברה, הגדרה של נכס, NFT בעלות:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## אבטחה מקומית ונעלי נכסים {#native-escrow-and-asset-locks}

הוראות אבטחה מקומית לחגור נכסים מספריים בפרוטוקול המנהל בספר
הם משמשים לפתרון בסגנון שוק, נכס גנרי
מנעולים, וזרמי אבטחה מוגן אנונימיים.

השימוש בשכנות הבטיחות `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, ו `ResolveEscrowDispute`. שימוש במנעולים נכסים גנטיים
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, ו
`ExpireAssetLock`. הסוכנות הבטוחית אנונימית משקפת את מחזור החיים של השוק
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, ו
`ResolveAnonymousEscrowDispute`.

אלה ISIs אין להם כרגע מדרגה ראשונה CLI פקודות. SDK
בונים או מטענים שימושיים של הוראות סדרתיות, וראו
[אסיטום נטיב](/he/blockchain/escrow.md) לפרטים על מחזור החיים,
הזכויות, שאלות, אירועים ו Rust דוגמאות.

## סיוע / ביטול {#grant-revoke}

הוראות הסכום והביטול משמשות לחישוב
[רשיונות ותפקידים](permissions.md).

`Grant` הוא משמש כדי להעניק באופן קבוע למשתמש או רשות אחת, או
קבוצה של רשיונות ("רול").
הוצא באמצעות `Revoke` ההוראות הללו צריכות להיות
יש להשתמש בזהירות.

להעניק ולבטל תפקיד בחשבון:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

תורם וביטול סימני אישור. פקודות אישור קוראים אישור
אובייקט מהכניסה סטנדרטית:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

להעניק ולבטל רשיונות על תפקיד:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

ההוראות האלה מעודכנים אובייקט [נתונים מטא](/he/blockchain/metadata.md). שימוש
`SetKeyValue` להוסיף או להחליף כתיבת מטא נתונים, `RemoveKeyValue` ל
למחוק אחד.

נתונים מטאטא `set` פקודות לקרוא את JSON ערך מהכניסה סטנדרטית:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

אותו דפוס זמין לחשבונות, הגדרות נכסים, NFTs, RWAs,
ומניעים:

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

`SetParameter` שינויים בפרמטרים בכל שרשרת שנחשפו על ידי הנתונים הפעילים
מודל ומבצע.

להגדיר פרמטר על ידי העברת פרמטר אחד JSON אובייקט על סטנדרט
הכניסות:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ההוראה הזו משמשת כדי לבצע [תפעילים](./triggers.md).

ה- CLI יכול לרשום תפעילים ולהתממן לאירועים של ביצוע תפעיל
ישירות. `execute trigger` פקודה, כך
להגיש מדריך `ExecuteTrigger` הוראות, ליצור סדרה
`InstructionBox` עם SDK או כלים מבצעים ומעבירים את JSON
מסלול דרך `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## הוראות אחרות {#other-instructions}

Iroha גם חושף הוראות רמה נמוכה יותר עבור זמן הפעלה והפעיל
שילוב:

- `Log`: להוציא רישום ליומן במהלך ביצוע
- `CustomInstruction`: להעביר ספציפי למבצע JSON מטענים מועילים
- `Upgrade`: להפעיל עדכון של מבצע

להגיש `Log` הוראות עם עוזר פינג:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

להגיש הוראה למפעיל אישית כסיריאלי `InstructionBox`. ה-
צורת המטען הפועל היא ספציפית למבצע, אז ליצור את ההוראה עם
התאמה SDK או כלים של מבצע:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

העדכון של המפעיל מ- IVM תיק קוד בייט:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
