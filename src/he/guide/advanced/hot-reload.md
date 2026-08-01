---
translation_locale: he
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# כביסה חמה Iroha בקונtejnר Docker {#hot-reload-iroha-in-a-docker-container}

השתמש בהחזרת חם רק לחיזוק מקומי. עבור פיתוח מקומי נורמלי, העדיף לבנות מחדש את התמונה או להפעיל מחדש את סטק Docker Compose שנוצר מעבורת Kagami חדשה .

## תחליף את הדוגמנית השותפה {#replace-the-peer-binary}

לבנות בינרי דיימון תואם ללינוקס ממרחב העבודה העליון:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

העתק את זה לתוך מיכל משותף פועל, ולאחר מכן להפעיל מחדש את המכול:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

להשתמש ב- `docker ps` כדי לאשר את שם המכולה. בשבילה המיוצרת, המכולות הדוגמנות מוגדרות על ידי `./localnet/docker-compose.yml`.

## תחזיר את בראשית לרשת חד פעמית {#recommit-genesis-in-a-disposable-network}

עמיתים מבצעים גנזה רק כאשר האחסון שלו ריק. עבור רשת חד פעמית Docker, עצור את המגרר, להסיר את מצב המיוצר, לשחזר או להחליף את חבורת הגנזה חתומה, ולהתחיל מחדש:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

אל תחליפו את הגנזה ברשת שדרכו לשמור על מצבם.

## השתמשו בהקנה מותאמת {#use-custom-configuration}

הקונפיגורציה הנוכחית של הדוגמא היא TOML. לחבר או להעתיק את הקבצים המובנים `config.toml`, `genesis.signed.nrt`, וקבצים מפתח קשורים לדרכי הכביסה הנצפו על ידי התמונה, ולאחר מכן להפעיל מחדש את הדוגמא. שמרו על הקבצים שנוצרו יחד; ערבוב קבצים ממסלולים שונים Kagami יכול לגרום לכישלונות של דזריאליזציה או הסכמה.
