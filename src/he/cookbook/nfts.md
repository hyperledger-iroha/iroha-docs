---
translation_locale: he
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# NFTs {#nfts}

## התוצאה {#outcome}

ביקורת Taira NFT לדווח, ולאחר מכן לרשום, לעדכן, להעביר, ולבקש NFT על רשת מקומית שנוצרת. `name$domain.dataspace` NFT ID והקאנוניקה I105 בעל IDs.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, והזרם `iroha` CLI.
- גישה בקריאה בלבד Taira.
- עבור פעולות כתיבה: רשת מקומית שנוצרה באמצעות `kagami localnet generate --peers 4 --out-dir ./localnet` כמו ב־[שיגור Iroha](/he/get-started/launch-iroha.md), עם `./localnet/client.toml` ועם Torii בכתובת `http://127.0.0.1:8080`, וכן דומיין NFT שבבעלות החותם שלה (ראו שלב 2).

## צעדים {#steps}

### 1. לבדוק את האוסף הציבורי Taira {#_1-inspect-the-public-taira-collection}

דף ריק הוא קריאה מוצלחת: זה אומר שאין נראים NFTs בדף המבוקש.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs הם רשומות ייחודיות, לא יתרות מספריות. יש להם ID, בעלים אחד ומפת תוכן קומפקטית, ששורות האוסף של Torii מחזירות כ־`metadata` ו־`ledger nft get` מחזיר כ־`content`.

### 2. להכין הבעלים המקומיים IDs {#_2-prepare-local-owner-ids}

דוגמת הכתיבה זקוקה לדומיין שבבעלות החשבון החותם, או להענקת `CanRegisterNft` עבורו. localnet שנוצר אינו רושם עבור הלקוח שלו אף דומיין יישום, ורישום דומיין גולמי שמור ל־genesis, ולכן הגדירו את `NFT_DOMAIN` לדומיין `name.dataspace` שהחותם שלכם שולט בו. גזרו את הסמכות המוגדרת מבלי לחשוף את המפתח הפרטי שלה, ולאחר מכן בחרו חשבון רשום אחר כיעד ההעברה.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

המפריד `$` שייך לצורת הטקסט של NFT. שמרו ב־ID את הדומיין `name.dataspace` המלא.

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

ערכי המטא-נתונים הם JSON. הגדרת מפתח מכניס או מחליף את הכתיבה הזאת אחת; היא לא מחליפה את כל הקלט NFT.

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

ב־Taira, כל פעולת כתיבה משתמשת ב־`--fee-payer authority`; ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה. רישום, העברה, הסרה ועדכוני מטא-נתונים נבדקים על ידי סביבת הריצה הפעילה (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` ו־`CanModifyNftMetadata` במשטח ההרשאות המוגדר כברירת מחדל). השתמשו בדומיין שבבעלות החשבון שלכם, או בדומיין שעבורו הוא מחזיק בהענקות האלה.

:::

עבור תהליכי עבודה שבבעלות חוזה, Kotodama מספק קריאות מארח NFT מטיפוסות. להלן מקרה הבדיקה המדויק של מחזור החיים, שאותו מבחן התיעוד המקובע של IVM מהדר ומריץ:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
    }
}
```

שני ערכי I105 הקבועים הם נתוני בדיקה מפרויקט המקור; סביבת הבדיקה רושמת את היעד לפני ההרצה. אלה אינם `CURRENT_OWNER` ו־`NEW_OWNER` מהמדריך של CLI. עבור חוזה יישום, ספקו את החשבונות הקנוניים בפועל, ולאחר מכן הדרו אותו, בדקו אותו, פרסו אותו וקראו לו באמצעות [חוזים חכמים](./smart-contracts.md). אל תשלחו bytecode שלא נבדק אל Taira; ביצוע החוזה עדיין כפוף להרשאת זמן הריצה.

## לאמת {#verify}

קראו את NFT ישירות ותוודאו שהבעליו השתנה בעוד התוכן שלה נשאר מלוגן:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

ה־CLI מדפיס את רשומת ה־NFT עצמה. האינווריאנטים הקובעים הם `id`, `owned_by` ו־`content`.

## פתרון בעיות {#troubleshooting}

- `name$domain` יכול להתאים באופן מקובל למרחב נתונים אוניברסלי במספר מספקים מסוימים, אך ספר הבישול והיישום IDs צריכים להשתמש בטופס מפורסם `name$domain.dataspace`.
- רישום חוזר של אותו NFT ID השתמשו ברשת מקומית חדשה או בחרו רשת ID "לכתבה מובהקת".
- הכניסת הנתונים המטאטאיות חייבת להיות תקנה JSON על כניסה סטנדרטית. שרשרת קליפה ללא ציטוט JSON אינה ערך מטא-נתוניםטיים.
- העברה שנחתמה על ידי חשבון שאינו הבעלים הנוכחי דורשת בעלות על הדומיין של ה־NFT או הענקת `CanTransferNft` מדויקת; שינוי `--from` אינו משנה את החותם.
- העברה משנה רק את `owned_by`. עדכוני מטא-נתונים וביטול רישום נשארים בידי בעלי הדומיין או בידי חשבון שמחזיק ב־`CanModifyNftMetadata` או ב־`CanUnregisterNft` עבור אותו NFT; הבעלים החדש יכול להעביר אותו הלאה.
- Taira יכולה להחזיר אוסף NFT ריק. אל תתייחסו ל־`items: []` כהוכחה לכך שהוראות NFT אינן זמינות.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [ניסויים של אינטגרציה NFT בביצוע commit הקשורות ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT ניסויים בקריאה מארח בביצוע הקשב](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [מקרה הבדיקה המדויק של מחזור החיים של Kotodama NFT ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [בדיקות דוגמאות התיעוד של Kotodama ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/he/blockchain/nfts.md)
- [מטא-נתונים](/he/blockchain/metadata.md)
- [הוראות](/he/blockchain/instructions.md)
- [סימני רשות ](/he/reference/permissions.md)
