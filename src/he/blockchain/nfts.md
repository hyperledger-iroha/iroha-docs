---
translation_locale: he
translation_source: /blockchain/nfts.md
translation_source_hash: 76608347790f14eb5a2d58ac26f0e194ccc34b1cb5e8983e2d6ac390fcb60ec6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# NFTs {#nfts}

א Iroha NFT הוא אובייקט ספרים ייחודי עם בעל אחד. NFTs כאשר תיק זקוק לזהות משלו, מטא-נתונים, אירועים במחזור החיים, וסימנטיקה של העברת הבעלות, אבל לא צריך יתרה מספרי.

שלא כמו מספר. [נכס](/he/blockchain/assets.md), ע"י NFT אין לו מדויק, יכולת להכנת או כמויות לכל חשבון. NFT קיימת כאובייקט רשום אחד, והיכולת להיות בעלת היא מעקב ישירות על האובייקט.

## מבנה {#structure}

`Nft` רשום מכיל:

- `id`: רכיב של `NftId`
- `content`: מטא נתונים המתארים את NFT
- `owned_by`: החשבון שייך ל- NFT

השדה `content` הוא מפה מסוג `Metadata`. שמרו אותו קומפקטי: אחסנו בו שדות תיאוריים, הפניות יציבות, גיבובים, ‏URIs או נתיבי SoraFS. אחסנו מסמכים גדולים, מדיה או מצב יישום המשתנה תכופות מחוץ לשרשרת, ושמרו ב־NFT רק הפניה הניתנת לאימות.

## נסה את זה על Taira {#try-it-on-taira}

בדוק אם ברשת המבחן הציבורית Taira יש כיום רשומות NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nft_ids: [.items[].id]}'
```

בדוק את המסמך חי OpenAPI עבור מסלולים NFT חשופים על ידי הערך:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

מערך ריק `items` הוא תגובה בתוקף ברשת מבחן ציבורית. זה אומר שאין NFTs בדף הנוכחי, לא כי ההוראות NFT אינן זמינות.

## NFT IDs {#nft-ids}

`NftId` משתמש בנוסח הטקסט הבא:

```text
name$domain
name$domain.dataspace
```

לדוגמה, `badge$docs.universal` מזהה את ה־NFT ‏`badge` בדומיין `docs.universal`. אם מרחב הנתונים מושמט, המנתח הנוכחי משתמש במרחב הנתונים `universal`, ולכן `badge$docs` נפתר ל־`badge$docs.universal`.

השתמש בשמות יציבים עבור NFT IDs. ה- ID הוא זהות האובייקט המשמשת בהוראות, בקשות, אישורים, פילטר אירועים ותייחסויות היישום.

## מחזור החיים {#lifecycle}

שימוש NFT בתפעול מחזור החיים Iroha הוראות מיוחדות:

- [`Register`](/he/blockchain/instructions.md#un-register) יוצר את NFT עם ראשונית `content`.
- [`Unregister`](/he/blockchain/instructions.md#un-register) מסיר את NFT.
- [`Transfer`](/he/blockchain/instructions.md#transfer) שינויים `owned_by`.
- [`SetKeyValue` ו`RemoveKeyValue` ](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue) מעדכן NFT מטא נתונים.

## נסה את זה מקומו {#try-it-locally}

דוגמאות אלה מניחים שהצלחתם להפעיל רשת מקומית ויש לכם את ההסדר של הלקוח שנוצר מתוך המדריך [CLI ](/he/get-started/operate-iroha-via-cli.md): -

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

רשת מקומית שנוצרה אינה רושמת דומיין יישום עבור הלקוח שלה. הגדירו את `NFT_DOMAIN` לדומיין שבבעלות החשבון החותם, או שלחשבון יש עבורו הרשאת `CanRegisterNft`. כדי ליצור דומיין, השתמשו בתהליך ההצהרתי `app alias setup plan` ו־`app alias setup apply` המתואר ב־[דומיינים](/he/blockchain/domains.md#registration).

רשום NFT. ההרשמה קוראת את התוכן הראשוני JSON מתוך הכניסה סטנדרטית:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

לבדוק את NFT ישירות ולאחר מכן לרשום את כל NFTs עם רשומות מלאות:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

הוסף מפתח מטא נתונים ותקרא את NFT שוב:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

להסיר את מפתח הנתונים המתאים:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

אפשר גם להעביר את ה־NFT. השתמשו ב־`ledger nft get` כדי לקרוא את הבעלים הנוכחי מתוך `owned_by`, וב־`account list --all` כדי למצוא מזהה חשבון יעד.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

להסיר את הדוגמה NFT לאחר המעבר. אם העברת אותה, או להעביר אותה חזרה או לשלוח את הפקודה לא להירשם עם הגדרת החשבון של הבעלים הנוכחי.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft unregister --id "$NFT_ID"
```

## שאילתות ואירועים {#queries-and-events}

שימוש [`FindNfts`](/he/reference/queries.md#assets-nfts-and-rwas) לרשום NFTs ו [`FindNftsByAccountId`](/he/reference/queries.md#assets-nfts-and-rwas) לרשום NFTs בבעלות חשבון.

עדכונים NFT של רישום, חיסול, העברה ומטא-נתונים יוצרים אירועי נתונים NFT. השתמשו ב-filter של אירועי מידע `Nft` בעת ההרשאה לשינויים בספר הספרים או בבניית גורמים המגיבים לאירועים של מחזור החיים NFT.

## רשיונות {#permissions}

שטח הרשיונות המקובל כולל סימנים ספציפיים ל NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

בדיקות הרשיונות מבוצעות על ידי מתוקן זמן ההפעלה הפעיל, כך שרשת יכולה להגדיר אישור על ידי עדכון של המבצע. ראה [Tokens Permission](/he/reference/permissions.md) עבור רשימה הפתיחה הנוכחית של טומנים.

## בחירת NFTs {#choosing-nfts}

השתמשו ב- NFT עבור רשומות שבהן חשיבות ייחודיות וניהול חשובה:

- תעודות, תגים, רישיונות ותוכנות
- רשומות חברות או גישה
- רשומות בקשות קשורות לזהות או שייך לחשבון
- התייחסות לתקשורת, מסמכים או מניפסטים מחוץ למגוון

השתמשו בנכס מספרי לייצוג יתרות של יחידות בנות־החלפה. כאשר הנתון הוא רק מאפיין קטן של עצם קיים בספר החשבונות, השתמשו ב[מטא־נתונים](/he/blockchain/metadata.md).

ראו גם:

- [נכסים](/he/blockchain/assets.md)
- [מטא-נתונים](/he/blockchain/metadata.md)
- [הוראות](/he/blockchain/instructions.md)
- [שאילתות](/he/blockchain/queries.md)
