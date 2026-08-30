---
translation_locale: he
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## התוצאה {#outcome}

ביקורת Taira NFT לדווח, ולאחר מכן לרשום, לעדכן, להעביר, ולבקש NFT על רשת מקומית שנוצרת. `name$domain.dataspace` NFT ID והקאנוניקה I105 בעל IDs.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, והזרם `iroha` CLI.
- גישה בקריאה בלבד Taira.
- עבור כותבים, רשת מקומית שנוצרה מ [שיגור Iroha](/he/get-started/launch-iroha.md), עם `./localnet/client.toml` ו Torii על `http://127.0.0.1:8080`.

## צעדים {#steps}

### 1. לבדוק את האוסף הציבורי Taira {#_1-inspect-the-public-taira-collection}

דף ריק הוא קריאה מוצלחת: זה אומר שאין נראים NFTs בדף המבוקש.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs הם רשומות ייחודיות, לא סכומים מספריים. יש להם ID, בעל אחד, ומפה מתא נתונים קומפקטית `content`.

### 2. להכין הבעלים המקומיים IDs {#_2-prepare-local-owner-ids}

דוגמה של כתיבה משתמשת בדומיין `wonderland.universal` שנבדק. נגזר את הסמכות המוגדרת מבלי לחשוף את המפתח הפרטי שלה, ולאחר מכן בחר חשבון רשום אחר כמוקד העברה.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

המפריד `$` שייך לפוסט הטקסט של NFT. לשמור על הגבול של תחום ה- `wonderland.universal` ופתור נתונים.

### 3. רשום את NFT עם תוכן ראשי {#_3-register-the-nft-with-initial-content}

CLI קורא את האובייקט הראשוני JSON מהכניסות סטנדרטיות. הרשות הנוכחית הופכת להיות הבעלים.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### עדכן את מפת התוכן. {#_4-update-the-content-map}

ערכי הנתונים המטאטאליים הם JSON. הגדרת מפתח מכניס או מחליף את הכתיבה הזאת אחת; היא לא מחליפה את כל הקלט NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. העברת הבעלות {#_5-transfer-ownership}

אספקת שני קאנוניקה I105 חשבון IDs. כינוי חייב להיפתר לפני השימוש בו כ `--from` או `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning גבולת היתר

על Taira, כל כתיבה צריכה גם `--metadata ./taira.tx-metadata.json` ומשלם עמלה מפורש. רישום, העברה, הסרת ותעדכונים של מטא נתונים בודקים על ידי זמן ההפעלה הפעיל . (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, ו `CanModifyNftMetadata` בשטח הרשיונות המקובלים). השתמש בדומיין המיועד לתרום שלך או לשמור על הליכה זו על Localnet.

:::

עבור זלילי עבודה בבעלות חוזה, Kotodama חושף טפסים NFT שיחות מארח. הבא הוא קישור מחזור חיים מדויק הועבר והוצא על ידי מבחן התיעוד IVM:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

שני הערכים הקבועים I105 הם ציוד ניסוי מקדימה; הרנז רשום את היעד לפני ההפעלה. הם אינם `CURRENT_OWNER` ו `NEW_OWNER` מהדרך CLI . עבור חוזה יישום, לספק את החשבונות הקנוניים האמיתיים שלו, ולאחר מכן לעסוק, לבחון, לפרסם ולהתקשר אליו באמצעות [חוזים חכמים](./smart-contracts.md). אל תגיש קוד בייט לא הושקף ל- Taira, ותזכור כי ביצוע החוזה עדיין עובר אישור זמן פועל.

## לאמת {#verify}

קראו את NFT ישירות ותוודאו שהבעליו השתנה בעוד התוכן שלה נשאר מלוגן:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

אם CLI עפת את התיעוד במעטפה יוצרת, בודקת את JSON פעם אחת ולהתחיל את ההצהרה על NFT האנרגיות הרשויות הן `id`, `owned_by`, ו `content`.

## פתרון בעיות {#troubleshooting}

- `name$domain` יכול להתאים באופן מקובל למרחב נתונים אוניברסלי במספר מספקים מסוימים, אך ספר הבישול והיישום IDs צריכים להשתמש בטופס מפורסם `name$domain.dataspace`.
- רישום חוזר של אותו NFT ID השתמשו ברשת מקומית חדשה או בחרו רשת ID "לכתבה מובהקת".
- הכניסת הנתונים המטאטאיות חייבת להיות תקנה JSON על כניסה סטנדרטית. שרשרת קליפה ללא ציטוט JSON אינה ערך נתונים מטאטאטיים.
- העברה שנחתמה על ידי חשבון אחר מאשר הבעלים הנוכחי זקוקה לרשות מדויקת; שינוי `--from` לא משנה את המחתם.
- לאחר העברה, הלקוח המקורי לא רשאי יותר לשנות או לבטל את רישום NFT. השתמשו בתחתום של הבעלים החדש או במפקד מורשה.
- Taira יכול להחזיר אספקה ריקה של NFT. אל תיייחסו ל- `items: []` כראיה לכך שאיננו זמינים הוראות NFT.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [ניסויים של אינטגרציה NFT בביצוע ההתחייבויות הקשורות ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT ניסויים בקריאה מארח בביצוע הקשב](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [בדיוק. Kotodama NFT קישור מחזור החיים ב- commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/he/blockchain/nfts.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [הוראות](/he/blockchain/instructions.md)
- [סימני רשות ](/he/reference/permissions.md)
