---
translation_locale: he
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

א Iroha NFT הוא אובייקט ספרים ייחודי עם בעל אחד. NFTs כאשר תיק זקוק לזהות משלו, נתונים מטאטא, אירועים במחזור החיים, וסימנטיקה של העברת הבעלות, אבל לא צריך איזון מספרי.

שלא כמו מספר. [נכס](/he/blockchain/assets.md), ע"י NFT אין לו מדויק, יכולת להכנת או כמויות לכל חשבון. NFT קיימת כאובייקט רשום אחד, והיכולת להיות בעלת היא מעקב ישירות על האובייקט.

## מבנה {#structure}

`Nft` רשום מכיל:

- `id`: רכיב של `NftId`
- `content`: מטא נתונים המתארים את NFT
- `owned_by`: החשבון שייך ל- NFT

שדה `content` הוא מפה של `Metadata`. שמור אותו קומפקטי: שמור שם את השדות המתארים, התייחסויות יציבות, האשיזים, URIs או SoraFS דרכים. שמור מסמכים גדולים, מדיה או מצב היישום עם צ'ורן גבוה מחוץ למשרשרת ותשמור רק על התייחסות אפשרית לאמת על NFT.

## נסה את זה על Taira {#try-it-on-taira}

בדוק אם ברשת המבחן הציבורית Taira יש כיום רשומות NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
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

לדוגמה, `badge$docs.universal` מזהה את `badge` NFT בשטח הנתונים של `docs.universal`. אם חלל הנתונים נמנע, המבחן הנוכחי משתמש בחלל הנתנים של `universal`, כך ש`badge$docs` מתברר ל- `badge$docs.universal`

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
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

הרשת המקומית שנוצרה כבר מערכת את `wonderland.universal` ואת החוזה של SNS שלה. כדי להשתמש בתחום אחר, ליצור אותו קודם עם זרם העבודה ההצהירתי `app alias setup plan` ו `app alias setup apply` המתואר ב [Domains](/he/blockchain/domains.md#registration).

רשום NFT. ההרשמה קוראת את התוכן הראשוני JSON מתוך הכניסה סטנדרטית:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

לבדוק את NFT ישירות ולאחר מכן לרשום את כל NFTs עם רשומות מלאות:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

הוסף מפתח מטא נתונים ותקרא את NFT שוב:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

להסיר את מפתח הנתונים המתאים:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

בחופש להעביר את NFT. שימוש `ledger nft get` לקרוא את הבעלים הנוכחי `owned_by`, ושימוש `ledger account list all` כדי למצוא חשבון יעד ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

להסיר את הדוגמה NFT לאחר המעבר. אם העברת אותה, או להעביר אותה חזרה או לשלוח את הפקודה לא להירשם עם הגדרת החשבון של הבעלים הנוכחי.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## שאלות ואירועים {#queries-and-events}

שימוש [`FindNfts`](/he/reference/queries.md#assets-nfts-and-rwas) לרשום NFTs ו [`FindNftsByAccountId`](/he/reference/queries.md#assets-nfts-and-rwas) לרשום NFTs בבעלות חשבון.

עדכונים NFT של רישום, חיסול, העברה ונתונים מטאטא יוצרים אירועי נתונים NFT. השתמשו ב-filter של אירועי מידע `Nft` בעת ההרשאה לשינויים בספר הספרים או בבניית גורמים המגיבים לאירועים של מחזור החיים NFT.

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

השתמשו נכס מספר עבור סכומים פונגיביים, ושימשו מטא נתונים פשוטים [](/he/blockchain/metadata.md) כאשר הנתונים הם רק תכונה קומפקטת של אובייקט ספר גדול קיים.

ראו גם:

- [נכסים](/he/blockchain/assets.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [הוראות](/he/blockchain/instructions.md)
- [שאלות](/he/blockchain/queries.md)
