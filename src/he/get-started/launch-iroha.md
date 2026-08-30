---
translation_locale: he
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# שיגור Iroha 3 {#launch-iroha-3}

דף זה מעביר את זרימת הרשת המקומית הנוכחית עבור Iroha 3 באמצעות נכסי החלל העבודה המקובלים מהמחסן העליון.

## 1. ליצור רשת מקומית מרוב עמיתים {#_1-generate-a-local-multi-peer-network}

לייצר רשת מקומית של ארבעה משותפים מתוך הקוד הנוכחי Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

תיווך ההוצא מכיל קונפיגציות עמיתות מתאימות, `genesis.json`, `genesis.signed.nrt`, `client.toml` וסריפטים של עוזר.

עבור בדיקת עשן מקומית, תתחילו את העמיתים המובילים ישירות:

```bash
./localnet/start.sh
```

עבור רצף קונטרייזד, ליצור Compose מאותו תיק של localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

הסטק המוצא בד default חושף:

- דלתות P2P `1337` ל- `1340`
- דלתות Torii HTTP `8080` ל `8083`
- קונפיגציה של לקוח מוכנה ב `./localnet/client.toml`

## 2. בדוק אם הרשת פועלת {#_2-verify-that-the-network-is-up}

בדוק את נקודת הסיום של המצב על הדירוג הראשון:

```bash
curl http://127.0.0.1:8080/status
```

בדיקות הבריאות המקובלות משתמשות גם:

```bash
curl http://127.0.0.1:8080/status/blocks
```

אתה יכול לכוון מיד את CLI לקונפיגציה של הלקוח המוספת:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus פרופיל {#_3-nexus-profile}

האספקה שולחת גם פרופיל קונפיגציה של SORA Nexus תחת `defaults/nexus/`.

כדי להפעיל עמיתי ילידי עם הפרופיל Nexus:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

להשתמש ב- `defaults/nexus/client.toml` עבור גישה ל- CLI לפרופיל זה.

## 4. לעצור את הרשת המקומית. {#_4-stop-the-local-network}

עבור רשת מקומית שנוצרת במקור:

```bash
./localnet/stop.sh
```

עבור סטק המוצר Compose:

```bash
docker compose -f ./docker-compose.yml down
```

לאחר שהרשת פועלת, המשך עם [פעיל Iroha 3 באמצעות CLI](/he/get-started/operate-iroha-via-cli.md).
