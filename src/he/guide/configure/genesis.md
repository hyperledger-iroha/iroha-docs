---
translation_locale: he
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# בראשית {#genesis}

בראשית מגדירה את מצב שרשרת הראשונית. המקור העורך הוא מוניסט JSON, ונקודה Iroha 3 צורכת קבוצה של עסקאות חתומה Norito.

::: details מוניפסט הגנזה מקובל

<<< @/snippets/genesis.json

:::

## קבצים {#files}

המאגר העליון שלח מוניסטר מקובל ב `defaults/genesis.json`. רשתות שנוצרו על ידי Kagami כותבים את המוניסטר שלהם וטראנזציה חתומה לתוך מדריך ההוצאה:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

המוצר `README.md` במגוון זה רשום את הקבצים המדויקים ואת פקודות ההתחלה עבור הפרופיל הנבחר.

## הגדרת השותפים {#peer-configuration}

עמיתים מצביעים על העסקה המותחתנת של הגנזה בנקודת `[genesis]` של `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

כל השותפים ברשת חייבים להסכים על העסקה הנחתמה של גנזה והפתח הציבורי של הגנזה.

## חתימה על בראשית {#signing-genesis}

אם תדיר את המניפסט ביד ידנית, תעודד ותחתום עליו לפני שתתחיל עם עמידים:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

עבור פרופילים NPoS או Nexus, לכלול את הטופולוגיה ואת BLS הוכחות רכוש הנדרשות על ידי הפרופיל המוצר. Kagami `localnet`, `wizard` והפקודות לייצור פרופיל מטפלות בפרטים אלה באופן אוטומטי.

## החזרת בראשית {#recommitting-genesis}

עמיתים מבצעים גנזה רק כאשר האחסון שלו ריק. כדי לבחון גנזה חדשה ברשת מקומית חד פעמית, לעצור את העמיתים, להסיר את תיווך המדינה המוצא שלהם ולהתחיל מהגנזה החדשה חתומה. אל תחליפו את הגנזה ברשת פועלת אלא אם כל מתוקן מתואם את אותה מיגרציה.
