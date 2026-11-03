---
translation_locale: he
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# תבנה ושימשו חוזה חכם {#build-and-deploy-a-smart-contract}

## התוצאה {#outcome}

בדקו והדרו חוזה Kotodama V1, הריצו מקומית את פונקציית ה־view הציבורית שלו, פרסו את ארטיפקט ה־IVM המאומת עם עמלות שהסמכות משלמת ושנבחרו במפורש, וקראו את פונקציית ה־view שנפרסה דרך Torii.

## תנאים מוקדמים {#prerequisites}

- קישוט מקור Iroha ב- commit `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust ו- Cargo.
- ה־CLI הנוכחי `iroha` ו־`musubi` (מורץ כ־`cargo run -p musubi --` בתוך עותק המקור), וכן לקוח Taira ממומן מתוך [חיבור ל־Taira](./connect-to-taira.md).
- נתיב מוחלט ב־`IROHA_CONFIG`. קישור הרשת של Musubi שומר הפניה לקובץ הלקוח הזה וחותם על הפריסה באמצעות מפתח החשבון שבו.
- סמכות על הכינוי. ה־executor דורש `CanManageAccountAlias` עבור כינוי החוזה המדויק או עבור ההיקף שמעליו: הדומיין הבעלים עבור `name::domain.dataspace`, או מרחב הנתונים עבור `name::dataspace`. חשבונות רשומים אינם זקוקים להרשאה נפרדת לרישום קוד, ומרחבי שמות מוגנים דורשים גם את תהליך הממשל של הרשת. הדוגמאות משתמשות ב־`cookbook_tuple::universal`; ב־Taira, החליפו אותו בכינוי בדומיין שבבעלותכם, או פרסו ברשת מקומית שנוצרה שה־genesis שלה מעניק את היקף הכינוי.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## צעדים {#steps}

### 1. עותק של חוזה ידוע טוב Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

לעבוד בתוך Iroha צ'אוקוט מחוברת ועתק את דגימת ההחזרה של הקמפיילר כך המקור ואת שרשרת הכלים להישאר על אותו commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

קוד המקור המלא קטן: פונקציית עזר פרטית `fn` ופונקציית `view fn` ציבורית אחת לקריאה בלבד, שמתירה במפורש את כל הקוראים:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama מיועדת למכונה הווירטואלית של Iroha ול־ABI הנוכחי שלה. היא אינה שפת מקור של WASM או EVM.

### 2. לבדוק, לבנות ולמתקן את האריפקט {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

הבניין הראשון מפרסם את הארטפקט וקובצי העזר המאומתים. השני פועל בקריאה בלבד `--verify` מצב וכישלון אם כל יצירה קיימת לא תואמת בדיוק את המקור הנוכחי. `.to` הקובץ והמניפסט שלו כוצאת מבנה בודדת אחת.

### 3. להפעיל את קוד הביט מקומו {#_3-run-the-bytecode-locally}

`compute` היא פונקציית `view fn` ציבורית לקריאה בלבד. הפעילו אותה באמצעות `debug-view`, שמריץ את ה־bytecode המהודר באופן מקומי מול נתוני בדיקה אופציונליים, בלי לשלוח עסקה או לשלם עליה.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

מספרים של Kotodama מוצגים כמחרוזות JSON, ולכן ה־tuple המפוענח הוא `["3", "5"]`.

### 4. פריסת הארטיפקט המאומת באמצעות Musubi {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` בודק חוזים, מריץ את פונקציות ה־view שלהם ומנפה בהם שגיאות, אך אינו פורס אותם, ולכן פריסות ב־Taira עוברות דרך Musubi. שירות הפריסה שלו מעלה את מקטעי ה־bytecode, רושם את המניפסט המאומת ומגיש פעולת `CommitContractDeployment` אחת. הוא מקבל הצעת עמלה לכל עסקה, דוחה הצעה שמשנה את המשלם שנבחר, את גרסת נותן החסות או את גבול הגז, ופורס את הארטיפקט שנבנה מראש רק לאחר שבניית החבילה הנעולה משחזרת את גיבובי הקוד וה־ABI שלו. ברשת מקומית שמנוהלת על ידי Kagami, `kagami contract deploy` פורס במקום זאת את `./build/tuple_return_demo.to` עם `--alias cookbook_tuple::universal --json`; הקבלה שלו נמצאת תחת `.receipt`, ו־`kagami context show` מדפיס את תצורת הלקוח שיש להשתמש בה כ־`IROHA_CONFIG`.

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

הקישור משתמש ב־`--fee-payer authority`; Musubi מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה. השוו את נכס העמלה שהוחזר לנכס שמדיניות ה־faucet הנוכחית מפרסמת. קריאות חוזה מקבלות בחירת עמלה רק באמצעות הצעת המחיר החיה בעלת הטיפוס; מטא-נתוני הטרנזקציה `gas_asset_id` אינם חלק מהחוזה בגרסה הראשונה.

### 5. קריאת פונקציית ה־view שנפרסה {#_5-read-the-deployed-view}

`contract view` מריץ את נקודת הכניסה לקריאה בלבד ב־Torii בלי עסקה ובלי עמלה. לפונקציית view אין צורת עסקה: Torii דוחה בורר של view בנתיבי הקריאה שלו.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## לאמת {#verify}

פתרו את הכינוי, אחזרו את המניפסט שעל השרשרת לפי גיבוב הקוד ש־Torii מדווח עבור פונקציית ה־view שנפרסה, והריצו את אותה פונקציית view לפי הכתובת הקנונית:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

הפריסה הושלמה רק כאשר קבלת הפריסה מדווחת שהארטיפקט המאוחסן אומת, הכינוי נפתר לכתובת שהוחזרה, המניפסט קריא תחת אותו גיבוב קוד, ושתי קריאות ה־view, המקומית ודרך Torii, מחזירות `["3", "5"]`.

## פתרון בעיות {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`, או השגיאה של ה־executor `authority is not permitted to manage contract alias`, פירושן שהחשבון אינו רשאי לקשור את הכינוי הזה. השתמשו בכינוי בדומיין שבבעלותכם, או קבלו מבעלי ההיקף הזה את ההענקה המדויקת לכינוי או את ההענקה לדומיין או למרחב הנתונים שלו; ב־localnet, העניקו אותה ב־genesis.
- דחייה של מרחב שמות מוגן פירושה שמרחב השמות של הכינוי נתון לממשל. רשימה של מזהי החשבון של המאשרים אינה ראיה לאישור; השתמשו בתהליך הממשל של הרשת (`iroha app gov deploy propose`) עבור מרחב השמות הזה, או בחרו כינוי מחוצה לו.
- אי־התאמה במניפסט או ב־ABI פירושה שה־bytecode, המניפסט וסביבת הריצה של הצומת אינם מתארים את אותו ארטיפקט. בנו מחדש ב־commit המקובע, ולאחר מכן הריצו שוב את הבנייה עם `--verify`.
- `fee quote changed ... gas bound` פירושו את התכוון הנדרש והתמחור חי לא מסכימים. תחזור לדרך במקום לשנות עסקאות חתומות.
- פריסה שנקטעה שומרת את התוכנית החתומה שלה ביומן. שחזרו אותה באמצעות `musubi deploy --resume <JOURNAL>` במקום לחתום על תוכנית חדשה.
- `is read-only and cannot be invoked as a transaction` או `is not a kotoage or lifecycle entrypoint` פירושו ש־`compute` נשלחה לפקודת קריאה. הדוגמה הזו מצהירה על `view fn`, ולכן השתמשו ב־`debug-view` באופן מקומי וב־`view` ב־Torii.
- קריאות חוזה דורשות גבול של גז טופס חיובי. החוזה של קריאת הזמנה לשחרור הראשון מסירב את הנתונים הגזים או המטא-מכסים ברמה העליונה.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [מימוש הפקודה של Kotodama V1 ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [דגימה של מקור ההחזרת כפולה ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [פקודת הפריסה של Musubi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) ו־[שירות פריסת החוזים המובנה](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) ב־commit המקובע
- [בדיקות אינטגרציה של החוזה בביצוע commit ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [חוזים חכמים](/he/blockchain/smart-contracts.md)
- [דף CLI ](/he/get-started/operate-iroha-via-cli.md)
