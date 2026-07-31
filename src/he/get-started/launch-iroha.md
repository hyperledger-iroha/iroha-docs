---
translation_locale: he
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# שיגור Iroha 3 {#launch-iroha-3}

עמוד זה עובר דרך הזרימה הנוכחית של הרשת המקומית Iroha 3 באמצעות
נכסים מקובלים של חלל עבודה מהרישוי העליון.

## 1. לייצר רשת מקומית מרוב עמיתים {#_1-generate-a-local-multi-peer-network}

יצר רשת מקומית ארבעה שווים Kagami קוד:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

תיווך ההוצא מכיל קונפיגציות עמיתות מתאימות, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, ומספרי סיוע.

בדיקת עשן מקומית, תתחילו את הדוגמאות המוצרות ישירות:

```bash
./localnet/start.sh
```

עבור רצף קונטינרי, ליצור Compose מאותו תיק localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

הסטק המובנה לפי דפוס חושף:

- עמיתים P2P סחורים `1337` ל `1340`
- Torii HTTP סחורים `8080` ל `8083`
- קונפיגציה מוכנה של לקוח ב `./localnet/client.toml`

## 2. בדוק אם הרשת פועלת {#_2-verify-that-the-network-is-up}

בדוק את נקודת הסיום של המצב על השותף הראשון:

```bash
curl http://127.0.0.1:8080/status
```

בדיקות הבריאות המקובלות משתמשות גם:

```bash
curl http://127.0.0.1:8080/status/blocks
```

אתה יכול מיד להצביע על CLI בקיצוי הלקוח המוסכם:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus פרופיל {#_3-nexus-profile}

האספקה גם שולחת SORA Nexus-פרופיל הקונפיגציה המכוון
`defaults/nexus/`.

כדי לנהל עמיתי ילידי עם Nexus פרופיל:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

שימוש `defaults/nexus/client.toml` עבור CLI גישה לפרופיל הזה.

## 4. עצור את הרשת המקומית {#_4-stop-the-local-network}

עבור רשת מקומית שנוצרת במקור:

```bash
./localnet/stop.sh
```

עבור סטק המוצר Compose:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

לאחר שהרשת פועלת, המשך
[פעל Iroha 3 דרך CLI](/he/get-started/operate-iroha-via-cli.md).
