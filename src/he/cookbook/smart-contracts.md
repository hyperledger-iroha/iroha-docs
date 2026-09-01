---
translation_locale: he
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תבנה ושימשו חוזה חכם {#build-and-deploy-a-smart-contract}

## התוצאה {#outcome}

בודקים ומסיימים חוזה Kotodama V1, מבצעים את נקודת כניסה הציבורית שלו מקומית, להפעיל את המוצר IVM המאובטח, לחקות את נקודת הכניסה המוצבת; ולהגיש אותו בתשלום מוסמך מפורסם של הסוכנות.

## תנאים מוקדמים {#prerequisites}

- קישוט מקור Iroha ב- commit `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust ו- Cargo.
- הלקוח הנוכחי `iroha` CLI ועוד לקוח מיומן Taira מ [חבר ל Taira ](./connect-to-taira.md).
- מסלולים מוחלטים ב `IROHA_CONFIG` ו `IROHA_PRIVATE_KEY_FILE`. הקובץ המפתח חייב להיות קובץ רגיל בעל רישום אחד עם מצב `0600`; העוזר להגדיר במכוון אין טענת מפתח פרטי פנימית.
- אישור מפעיל Taira. רישום קוד החוזה דורש `CanRegisterSmartContractCode`, ופיצוצים מוגנים עשויים דורשים מיתוי של ממשל וחקיקה. אם Taira לא העניק גישה כזו, לבצע את הפיצוץ ברשת מקומית שנוצרה אשר הגנזיה מעניקה את הרשות.

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## צעדים {#steps}

### 1. עותק של חוזה ידוע טוב Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

לעבוד בתוך Iroha צ'אוקוט מחוברת ועתק את דגימת ההחזרה של הקמפיילר כך המקור ואת שרשרת הכלים להישאר על אותו commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

המקור המושלם הוא קטן ומשתמש בסינטקס הנוכחי `seiyaku`/`kotoage`:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama מיועדת למכונה הווירטואלית של Iroha ול־ABI הנוכחי שלה. היא אינה שפת מקור של WASM או EVM.

### 2. לבדוק, לבנות ולמתקן את האריפקט {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

הבניין הראשון מפרסם את הארטפקט וקובצי העזר המאומתים. השני פועל בקריאה בלבד `--verify` מצב וכישלון אם כל יצירה קיימת לא תואמת בדיוק את המקור הנוכחי. `.to` הקובץ והמניפסט שלו כוצאת מבנה בודדת אחת.

### 3. להפעיל את קוד הביט מקומו {#_3-run-the-bytecode-locally}

`compute` היא נקודת כניסה ציבורית של `kotoage`. הפעילו אותה באמצעות `debug-call`, שפועל על נתוני בדיקה מקומיים בלי לשלוח עסקה או לשלם עליה.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

מספרים של Kotodama מוצגים כמחרוזות JSON, ולכן ה־tuple המפוענח הוא `["3", "5"]`.

### 4. המשיכה באמצעות עוזר native {#_4-deploy-through-the-native-helper}

העוזר מעלה חתיכות קוד בייט, רשום את המניפסט הנחתם ומגיש מבצע אחד `CommitContractDeployment`. הוא מציין על כל עסקאות ומסרב על תמחור שמשנה את משלם או מחויבת הגז שנבחר.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

בקשת `charge_limits` ריקה אינה מזהה נכס שהועתק: כלי העזר מקבל את הצעת המחיר החיה המדויקת לפני החתימה. השוו את נכס העמלה שהוחזר לתגובה הנוכחית של ה-faucet. קריאות חוזה מקבלות בחירת עמלה רק באמצעות הצעת המחיר החיה המוקלדת; מטא-נתוני הטרנזקציה `gas_asset_id` אינם חלק מהחוזה בגרסה הראשונה.

### 5. סימול ולהתקשר לנקודת כניסה המוצבת. {#_5-simulate-and-call-the-deployed-entrypoint}

הסימולציה מפעילה את נקודת הכניסה הציבורית ב Torii ללא הגשת. הקריאה הבאה היא עסקנה ולכן בחרת במפורש את משלמת עמלות הרשויות. שתי הפקודות מחייבות את גבול הדלק 1,500,000.

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## לאמת {#verify}

לפתור את הכינוי, להביא את המניסט על שרשרת באמצעות האש הקוד החזר, ולדמון את אותה נקודת כניסה ציבורית על ידי כתובת קנוניקה:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

השימוש מושלם רק כאשר האליס מתגבר על כתובת החזרת, המניפסט ניתן לקרוא תחת אותו קוד חישוב, סימולציות מקומיות ו Torii חוזרים `["3", "5"]`, והזמנה הנשלחת מגיעה `Applied`.

## פתרון בעיות {#troubleshooting}

- כישלונות `CanRegisterSmartContractCode` דורשים תורם למפעיל Taira או שינוי גנז / סטראפ ב-localnet. חשבון נורמלי לא יכול לתת את הזכות זו לאחר העובדה.
- דחייה מצד הממשל או מצד נתיב מוגן פירושה שהפריסה זקוקה לייחוס המדויק של המאשרים שאותה רשת דורשת. יש לתאם את רשימת המאשרים; אין להמציא מזהי חשבון (account IDs).
- אי־התאמה בין מניפסט ל־ABI פירושה שה־bytecode, המניפסט וסביבת הריצה של הצומת אינם מתארים את אותו ארטיפקט. השתמשו ב־`--verify`.
- `fee quote changed ... gas bound` פירושו את התכוון הנדרש והתמחור חי לא מסכימים. תחזור לדרך במקום לשנות עסקאות חתומות.
- העוזר להגדיר דוחה מפתחות קבועות, אופנים של קבצים מפתח מורשים, סימלינקים ומפחידים קבצים מקושרים לפני הגשת רשת.
- טעות בנקודת כניסה תצפית בלבד פירושה `compute` נשלח דרך משפחת הפקודות הלא נכונה. הדגימה זו מכריז על `kotoage`, אז השתמשו בסימולציה של קריאה או העברה.
- קריאות חוזה דורשות גבול של גז טופס חיובי. החוזה של קריאת הזמנה לשחרור הראשון מסירב את הנתונים הגזים או המטא-מכסים ברמה העליונה.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [Kotodama V1 יישום פקודה בקימת קישור](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [דגימה של מקור ההחזרת כפולה ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [עוזר הפעלת native ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [בדיקות אינטגרציה של החוזה בביצוע commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [חוזים חכמים](/he/blockchain/smart-contracts.md)
- [דף CLI ](/he/get-started/operate-iroha-via-cli.md)
