---
translation_locale: he
translation_source: /blockchain/metadata.md
translation_source_hash: 20e78492bf757147f2c9afed2d3b51639bc79913d3d8e4351193b6011f5469c2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מטאדאטה {#metadata}

מטאדאטה היא מפה של ערך מפתח מבוקש הקשורת לאובייקטים במספר. המפתחות הן ערכים `Name` והערכים הם עומסי תועלת JSON (`Json`).

האובייקטים הבאים יכולים להכיל מטא נתונים:

- תחומים
- חשבונות
- נכסים
- הגדרות נכסים
- NFTs
- RWAs
- תפעילים
- עסקאות

השתמשו בתנתונים מטא עבור שדות תיאוריים או אינדקסינג קטנים שייכים למצב ספריה. עומסים מועילים גדולים צריכים להיות מאוחסנים מחוץ ל- WSV ומועדגים על ידי מסלול דיג'סט, URI, או SoraFS.

לקבלת הוראות על בחירת נתונים מטאטא, נכסים NFTs, RWAs או אחסון מחוץ לרשת, ראה [הבחירות לאחסון נתונים מטטאטא ונתונים ספריים ](/he/guide/configure/metadata-and-store-assets.md).

## נסה את זה על Taira {#try-it-on-taira}

נתונים מטאטא נראים באמצעות קריאת משאבים רגילה. פקודה זו רשימה הגדרות נכסים Taira שיש להם כיום נתונים מטטא:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

השתמשו בדפוס זהה עבור דומנים וחשבות:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'

curl -fsS 'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

מתייחס לתוצאת ריקה כתוצאה תקפה. זה אומר שהדף הנוכחי של Taira אובייקטים אינו מכיל מטא נתונים, לא כי נקודת הסיום נכשלה.

## עדכון נתונים מטאטא {#updating-metadata}

הנתונים המטאטאליים משתנים עם הוראות מיוחדות Iroha:

- [`SetKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue) מדביקים או מחליפים מפתח
- [`RemoveKeyValue`](/he/blockchain/instructions.md#setkeyvalue-removekeyvalue) מסיר מפתח

לרשות המגיש את העסקה חייב להיות הרשיון הנדרש על ידי מתוקן הזמן הפעיל. עבור שטח הרשיונות המקובל, ראה [Tokens Permission ](/he/reference/permissions.md).

## אירועים {#events}

אירועי נתונים יוצרים כאשר מתנתונים משתנים. עומס השימוש של אירוע כללי הוא `MetadataChanged<Id>`:

```mermaid
classDiagram

class MetadataChanged~Id~ {
  target: Id
  key: Name
  value: Json
}

class AccountMetadataChanged
class AssetMetadataChanged
class AssetDefinitionMetadataChanged
class DomainMetadataChanged

MetadataChanged --> AccountMetadataChanged
MetadataChanged --> AssetMetadataChanged
MetadataChanged --> AssetDefinitionMetadataChanged
MetadataChanged --> DomainMetadataChanged
```

השתמשו ב- [filters של אירועים נתונים ](/he/blockchain/filters.md#data-event-filters) כדי לחתום רק על אירועי מטא נתונים עבור סוג הארגון או אובייקט ID החשוב לאינטגרציה.

## שאלות {#queries}

נתונים מטאטא חוזרים כחלק מהאובייקט שאל. לדוגמה, השתמש [`FindAccountById`](/he/reference/queries.md#accounts-and-permissions), [`FindDomainById`](/he/reference/queries.md#domains-and-peers), או [`FindAssetDefinitionById`](/he/reference/queries.md#assets-nfts-and-rwas). השתמש [`FindNfts`](/he/reference/queries.md#assets-nfts-and-rwas) או [`FindNftsByAccountId`](/he/reference/queries.md#assets-nfts-and-rwas) עבור NFTs, ו [`FindRwas`](/he/reference/queries.md#assets-nfts-and-rwas) עבור RWA הרבה. ואז לקרוא את שדה הנתונים המתאים של האובייקט. תשובות השאלות של NFT חושפות את המפה NFT `content` כמטאטא נתונים רשומים.

מפתחות הנתונים מטאטא הם חלק ממצב הספרים, אז לשמור אותם יציבים ולהימנע מקודד גרסה ספציפית יישום ל-churn לתוך שם המפתח כאשר ערך JSON יכול לשאת את הגרסה הזו באופן בולט.
