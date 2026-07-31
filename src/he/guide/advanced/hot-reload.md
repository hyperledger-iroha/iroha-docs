---
translation_locale: he
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# חומצה מחודשת Iroha ב- Docker ספינה {#hot-reload-iroha-in-a-docker-container}

השתמשו בהחמץ חם רק לתיקון מקומי. עבור פיתוח מקומי נורמלי, מעדיפים
לבנות מחדש את התמונה או להפעיל מחדש את התמונות שנוצרו Docker Compose ערימה מ
טרי Kagami חבילה.

## תחליף את הדוגמנית השותפת {#replace-the-peer-binary}

לבנות בינרי דיימון תואם ללינוקס ממרחב העבודה העליון:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

העתק אותו לתוך מיכל עמיתי פועל, ואז להפעיל מחדש את המיכל:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

שימוש `docker ps` כדי לאשר את שם המכולה.
מיכלים מוגדרים על ידי: `./localnet/docker-compose.yml`.

## תחזור על בראשית ברשת חד פעמית {#recommit-genesis-in-a-disposable-network}

עמיתים מבצעים גנזה רק כאשר האחסון שלו ריק. Docker
רשת, עצר את הרכבת, להסיר את המצב המובנה, לשחזר או להחליף את
חבורת גנזה חתומה, ולהתחל מחדש:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

אל תחליפו את הגנזה על רשת ששלמתה יש לשמור.

## השתמשו בהקנה מותאמת {#use-custom-configuration}

ההשפעה הנוכחית של השותפים היא TOML. קשור או העתק את המוצר
`config.toml`, `genesis.signed.nrt`, וקבצים מפתח קשורים לקונtejnר
נתיבים צפויים על ידי התמונה, ואז להפעיל מחדש את הדירוג. לשמור את הקבצים שנוצרו
יחד; מיזוג קבצים שונים Kagami רכיבים יכולים לייצר דיזריאליזציה או
כשל הסכמה.
