---
translation_locale: he
translation_source: /blockchain/data-model.md
translation_source_hash: 147562d2286bf11e60a941969e6d52bffc1534c3cfc04d440e0bcf78598a1ca7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מודל נתונים {#data-model}

Iroha חנויות ספריה המדינה `World`. השימוש במודל הנתונים הראשון שלו
זהויות וארגונים קנוניים הבאים:

- דומנים הם מיומנים במרחב נתונים, למשל `payments.universal`
- החשבונות הם קנוניים וחסרי תחום; החשבון ID הוא נגזר מה
  מנהל החשבון
- הגדרות נכסים יכולות לשמור על תחזית דומיין/שם, אבל הקאנוניקה שלהם
  כתובת טקסטלית היא מזהה Base58 לא ברור.
- נכסים הם סולאנים שנחזיקו בחשבונות להגדיר נכס מסוים
- NFTs הם רשומות בבעלות יחידה עם רשימת דומיין IDs ונתונים מטא
  תוכן
- RWAs הם נוצרו...ID סרפים המייצגים נכסים מחוץ לשאשרת עם קרן
  בעל, כמות, מקור, מטא-מידע, מחזיקים, קפואים ותיקום חיים
  בדיקות

```mermaid
classDiagram

class World
class Domain {
  id: DomainId
  logo: Option<SorafsUri>
  metadata: Metadata
  owned_by: AccountId
}
class Account {
  id: AccountId
  metadata: Metadata
  label: Option<AccountAlias>
  uaid: Option<UniversalAccountId>
  opaque_ids: Vec<OpaqueAccountId>
}
class AccountController {
  key
  multisig policy
}
class AssetDefinition {
  id: AssetDefinitionId
  spec
  mintable
  metadata
}
class Asset {
  id: AssetId
  value
}
class Nft {
  id: NftId
  content: Metadata
  owned_by: AccountId
}
class Rwa {
  id: RwaId
  owned_by: AccountId
  quantity
  spec
  primary_reference
  status
  metadata
  parents
  controls
  is_frozen
  held_quantity
}

World *-- Domain : registers
World *-- Account : registers
World *-- AssetDefinition : registers
World *-- Asset : stores balances
World *-- Nft : registers
World *-- Rwa : registers lots
Account --> AccountController : authorized by
Domain --> Account : owned_by
AssetDefinition --> Domain : optional projection
Asset --> AssetDefinition : definition
Asset --> Account : held by
Nft --> Domain : scoped by
Nft --> Account : owned_by
Rwa --> Account : owned_by
```

## דוגמה {#example}

ב- Iroha 3 רשת, `wonderland.universal` הוא תחום בתוך
`universal` את החשבונות הקנוניים בדוגמה זו נשלטו
על ידי המפתחות או מדיניות שלהם ומוסווגים כלא דומיין I105 חשבון IDs. ניתן לקרוא.
תוויות כגון `alice@wonderland.universal` הם כינויים נפרדים קשורים אלה
IDs. הגדרת נכס מתוכננת עדיין ניתן לבנות מתוך תחום ו
שם כגון `rose` ב `wonderland.universal`, בעוד הנכס הקנוני
כתובת הגדרה המשמשת על הקבל היא כתובת Base58 המוצא.

```mermaid
classDiagram

class domain_wonderland {
  id = "wonderland.universal"
}
class account_alice {
  id = "AccountId(controller=alice_key)"
  label = "alice"
}
class account_rabbit {
  id = "AccountId(controller=rabbit_key)"
  label = "rabbit"
}
class asset_rose {
  name projection = "rose"
  domain projection = "wonderland.universal"
}

domain_wonderland --> account_alice : owned_by
asset_rose --> domain_wonderland : projected under
account_alice --> asset_rose : holds balance
account_rabbit --> asset_rose : may receive balance
```

## פרופילים {#aliases}

הכינויים הם שמות פונים לבני אדם שכבות מעל מזהים של ספר הספר הקנוני.
הם שימושיים API, CLI, ארנק, וגבולות המחקרים, אבל קאנוני
IDs נשארו מזהים יציבים שנחזקו בשדות ספריה קפדניים.

| מטרה         | מטרה קאנוניקה                                    | פרופיל מילולית                                          | מודל תמיכה                                                                 |
| -------------- | --------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| חשבון המשתמש   | ללא תחום `AccountId` קוד כ- I105 כתובת   | `name@domain.dataspace` או `name@dataspace`            | `AccountAlias`; הכינוי העיקרי הוא `Account.label`, פרופילים נוספים הם חיבורים  |
| הגדרה של נכסים | קאנוניקה `AssetDefinitionId` כתובת Base58     | `name#domain.dataspace` או `name#dataspace`            | `AssetDefinitionAlias` קשור להגדרה של נכס                           |
| חוזה       | קאנוניקה Bech32m `ContractAddress`                 | `name::domain.dataspace` או `name::dataspace`          | `ContractAlias` מחויבת לכתובת חוזית משמשת                          |
| שם הדומיין    | `DomainId` ב `domain.dataspace` טופס               | `domain.dataspace`                                    | SNS `domain` רישום חלל שמות                                                 |
| שם חלקי נתונים | מספר `DataSpaceId` מהפעיל Nexus קטלוג | שם כינוי של חלקי נתונים כגון `universal`, `paynet`, או `zk` | SNS `dataspace` רשום חלל שמות ועוד קטלוג חלל נתונים פעיל            |

כינוי חשבונות הם שמות החשבונות המופנים בפני המשתמש. הם שורדים חשבון
ריקיוינג בגלל כי השלט הזה מצביע על החשבון הפעיל ID דרך המדינה העולמית
אינדיקסים ורישומים של רכיבי חשבונות. `SetPrimaryAccountAlias` עבור
התווית העיקרית של החשבון, `SetAccountAliasBinding` עבור תוספות שאינן יסודיות
שם כינוי, ו `FindAccountByAlias` או `FindAliasesByAccountId` עבור קריאה.
כינוי חשבונות בדרך כלל דורש פעיל SNS רכישת מחירי שכר
עם `AcquireAccountAliasLease` וחדש עם `RenewAccountAliasLease`.

פרופיל נכסים נקבעות בשם נכסים, לא סולדות חשבונות בודדים.
כינוי וכינוי חוזי הם חיבורים ישירים
מטרה קנוניקה קיימת. `SetAssetDefinitionAlias`;
סגמנט השם המזוין חייב להתאים את שם ההצגה של הגדרת הנכסים או
שם ההגדרה המתוכננת. `SetContractAlias`;
חלל הנתונים בעלת התכלית תואם את החלל הנתוני המפורסם בכתובת החוזה.
שני הקשרים יכולים לשאת `lease_expiry_ms`; לאחר סיום תקופה הם מפסיקים לפתור.
כאשר חלון החסד עובר ונחלק מפריטים של מדינות העולם.

תחומים אינם בעלי תחום נפרד `DomainAlias` אובייקט. מזהד תחום הוא
כבר שם מוסמך למרחב נתונים כגון: `payments.universal`. SNS עקבות
בעלות השכרה של שמות דומנים `domain` חלל שמות ולחלל נתונים
פרופיל ב- `dataspace` חלל שמות. `universal` שם-תג שפת הנתונים
חייב להישאר מוגדר.

## מסמכים קשורים {#related-docs}

| נושא                                  | לאן ללכת?                                 |
| -------------------------------------- | ------------------------------------------- |
| תחומים                                | [תחומים](/he/blockchain/domains.md)           |
| חשבונות                               | [חשבונות](/he/blockchain/accounts.md)         |
| נכסים                                 | [נכסים](/he/blockchain/assets.md)             |
| NFTs                                   | [NFTs](/he/blockchain/nfts.md)                 |
| נכסים בעולם האמיתי                      | [נכסים בעולם האמיתי](/he/blockchain/rwas.md)    |
| נתונים מטאטא                               | [נתונים מטאטא](/he/blockchain/metadata.md)         |
| הוראות רישום והעברה | [הוראות](/he/blockchain/instructions.md) |
| פתרונות זמן ההופעה                    | [רשיונות](/he/blockchain/permissions.md)   |
| כללי הכינוי                           | [כללי הכינוי](/he/reference/naming.md)        |
