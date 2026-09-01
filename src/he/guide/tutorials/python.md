---
translation_locale: he
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Python {#python}

ה־Python SDK במרחב העבודה הראשי הוא `iroha-python`. הגרסה הראשונה של Iroha 3 מכוונת לממשקי Torii ו־Norito הנוכחיים. קבעו במפורש את גרסת החבילה או את תיקון המקור שבו משתמש השילוב שלכם, כדי שה־SDK והצומת יישארו באותה גרסה של פורמט התעבורה.

דוגמאות קריאה אנונימיות מתחת לציבור מטרה Taira ב `https://taira.sora.org`. מסלול יכול להיות קריא בלבד ועדיין דורש חתימת חשבון קנוניקה או חתימה של מפעיל רשת מדויק; דוגמאות מוטציות הן תבניות עסקאות ודורשות Taira סמכות, מפתח פרטי, כוונה לתשלום דמי טופס, רשת בדיקה מספקת XOR, אימות הנדרש על ידי מסלול היעד לפני שיכלו להגיש אותם.

השתמשו בדוגמאות בסדר זה:

|שלב |לרוץ נגד הציבור Taira?|מה אתה צריך?|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|אנונימי קורא קריאות.|כן.|Python חבילת ועוד גישה לרשת |
|קריאה של חשבון או מאושרת על ידי מפעילה |רק עם זהות מוכרת שלך.|בדיוק Taira `NetworkId` ומפתח החשבון המתאים או המפעיל |
|יצרנים מקומיים של חתימות והוראות |בלי קריאת רשת עד `submit()` |הרחבה המקומית ואת החומר המרכזי שלך.|
|העסקאות וקריאות שירות המוטות |רק עם חשבונך המשומך.|חשבון של הסוכנות, מפתח פרטי, מדויק Taira `NetworkId`, כוונה על תשלום מקובל, סולן נכסים על תשלום וטוגנים למסלול |
|חיבור קודקים מסגרת, קריפטו, ו GPU עוזרים |מקומי בלבד.|הרחבה המקומית; GPU עוזרים צריכים גם backend יכולת CUDA |

## להתקין {#install}

השם של הנתונים המטאטאוניים של החבילה הוא `iroha-python`. אל תחשבו כי התקנת PyPI לא מחוברת מתאימה לרשת Taira חיה. תקין גלגל או קישור מקור שנבנה מאותו תיקון מעלה מטרות האינטגרציה שלך:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

אם הפרויקט שלך צורב את חלל העבודה העליון באופן ישיר, תקין את התלות Python ובנה את ההרחבה המקומית לפני שתפעיל דוגמאות שמשתמשות `Instruction`, `TransactionDraft`, חתימה, קריפטו, SoraFS עוזרים מקומיים, GPU עוזרים, או קודקים של מסגרת Connect. השתמש בפקודה "הבנה" מ- `python/iroha_python/README.md` למעלה, ולאחר מכן בדוק אם המטען של הייצוא המקורי הוא:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

אם אפשר לייבא את `create_torii_client` אך הייבוא של `Instruction` או `generate_ed25519_keypair` נכשל, חבילת Python הטהורה זמינה אך ההרחבה המובנית אינה זמינה.

## התחלה מהירה {#quickstart}

התחילו עם נקודות סוף Taira ציבוריות, קריאה בלבד:

```python
from iroha_python import (
    create_torii_client,
)

client = create_torii_client("https://taira.sora.org")

# Public reads do not need an authority or private key.
status = client.request_json("GET", "/status", expected_status=(200,))
accounts = client.list_accounts_typed(limit=5)

print(status["build"]["version"])
for account in accounts.items:
    print(account.id)
```

## התקנה משותפת {#shared-setup}

השתמשו בהקנה זו עבור תבניות המוטות. החליפו כל מחזיקי מקומות עם סמכות Taira, מפתח פרטי, טוקן וסיכוי/חשבון IDs מההתפקיד שלכם לפני שתשלחו.

`authority` הוא החשבון אשר חותם על העסקה ו`private_key` חייב להתאים לה. העסקים קשורים ל- Taira גנזית מדויקת של `NetworkId`; שרשרת UUID היא תווית הפעל, לא זהות העסקאות. דמי תשלום משתמשים בכוונה לתשלום מודפסת ותמחור חי מדויק, ללא קשר למתנתונים של היישום. החשבון והדרישי מקומות הבאים אינם נכונים במכוון ולכן הם לא הוגשו במקרה.

המילה הקבועה למטה היא זהות הגנזיס הנוכחית Taira. תחזית רשתת מבחן יכולה לשנות אותה, אז העדשו אותה מפרופיל ההפצה הנחתם ולעולם לא להסיק אותה מהשרשרת UUID .

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    LocalSigningContext,
    NetworkId,
    ToriiClient,
    ToriiCanonicalRequestAuth,
    TransactionConfig,
    TransactionDraft,
    authority_fee_payment,
)

TORII_URL = "https://taira.sora.org"
TAIRA_NETWORK_ID = NetworkId.parse(
    "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
)
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=alice,
    signer=alice_pair.sign,
)

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

APP_METADATA = {"source": "python-docs"}
# Torii replaces the empty maxima with an exact, validated live fee quote before
# anything is signed. The payer remains the transaction authority.
BASE_FEE_PAYMENT = authority_fee_payment(charge_limits=[])

client = ToriiClient(
    TORII_URL,
    local_signing_context=LocalSigningContext(TAIRA_NETWORK_ID),
    canonical_request_auth=canonical_auth,
    auth_token=AUTH_TOKEN,
)


def submit(*instructions):
    draft = TransactionDraft(
        TransactionConfig(
            network_id=TAIRA_NETWORK_ID,
            authority=alice,
            fee_payment=BASE_FEE_PAYMENT,
            metadata=APP_METADATA,
        )
    )
    draft.extend_instructions(instructions)

    # Freeze one payload, obtain its exact fee limits, and sign that same payload.
    envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
    status = client.submit_transaction_envelope_and_wait(envelope)
    return envelope, fee_quote, status
```

קריאות `Instruction.*` רק בונות מטעני הוראות. `submit()` היא הנקודה שבה ה־SDK מקבל הצעת עמלה עדכנית, חותם על המטען המדויק שהוצע, שולח אותו אל Torii וממתין לעדכון מצב.

## דמי הסכום והגז {#fees-and-gas}

עסקאות כתיבה זקוקות ל-`FeePaymentIntent` מטיפוס מוגדר וליתרת נכס עמלה ממומנת. ב-Taira, ה-faucet הציבורי מממן testnet XOR. ה-Python SDK שולח ל-Torii את המטען הלא חתום והקבוע לקבלת הצעת עמלה מדויקת, מוודא שההצעה לא החליפה את המשלם או את המטען, וחותם על הכוונה המצוטטת. אל תכניסו בחירת עמלה למטא-נתוני העסקה.

העוזר `submit()` למעלה מתחיל עם כוונה ששילמת על ידי הרשויות אשר גבולות האשראי הם בכוונה ריקים. `quote_and_sign()` מילא אותם מהתמחור חי לפני חתימה:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=authority_fee_payment(charge_limits=[]),
        metadata={"source": "python-fee-example"},
    )
)
draft.add_instruction(
    Instruction.set_account_key_value(
        alice,
        "python_fee_example",
        "ready",
    )
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
status = client.submit_transaction_envelope_and_wait(envelope)

for limit in fee_quote["intent"]["value"]["charge_limits"]:
    print(limit["asset_definition_id"], limit["max_amount"])
```

לפני שליחת פעולות כתיבה, ודאו שבחשבון הסמכות יש יתרה מספקת של נכס העמלה. שירות המימון המדויק ומזהה הנכס (ID) תלויים ברשת; זו הצורה של Taira:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

faucet מחזירה את הקונקרט `asset_id` לשימוש בדיקת המשקל. לוודא כי ההערה החיצון דורשת `FEE_ASSET_DEFINITION`; העסקה לא מבחר את הנכס הזה באמצעות מטא-מידע.

מטא נתונים של יישומים הם אופציונליים ואין להם סיהנפקהיקה תשלום:

```python
APP_METADATA = {"source": "python-docs"}

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
```

אם אתה מחמיא את כוונתו של התשלום, מקבל תמחור עבור נכס בלתי צפוי, משנה את המשאב הפועל לאחר התמחור, או חותם עם חשבון ללא מימון, העסקאות לא צריכות להגיש.

## אנוניום Taira קורא {#anonymous-taira-reads}

קריאות אלה משתמשות בדרכים Taira שבגבול הקלטוג שלה מותר לקרוא באופן אנונימי:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.list_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_cadence_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms)
```

`/v1/time/status` וכל תמונת מצב של מפעיל `/v1/sumeragi/*` דורשת חתימה מדויקת של מפעל הרשת למרות שהם לא משתנים מצב. השתמש ב- `request_json("GET", "/status")` למצב הערך האנונימי מטען והתקנה של המפעיל למטה לדיאגנסטיקה של השעון מקומי או קונוד. מצב הפגישה Connect הוא מסלול פרוטוקול נפרד ודורש את סימן ניהול הפגישה הזאת.

## בוני הוראות {#instruction-builders}

ה־SDK חושף בונים בעלי טיפוס למשפחות ההוראות הנפוצות ביותר, וכן נתיב מילוט באמצעות JSON עבור גרסאות שעדיין אינן שיטות Python מובנות. קטעי הקוד להלן הם תבניות לעסקאות ממומנות; אין לשלוח אותן אל Taira הציבורית בלי חשבון חתימה מתאים.

מעדיפים עוזרים מקובלים כאשר הם קיימים: הם נורמליזים את הערכים של Python ומכשירים מוקדם על צורות לא חוקיות. השתמש ב- `Instruction.from_json` רק כאשר אתה צריך גרסה של הוראות שאין לה עוזר Python עדיין.

|משפחת הוראות |שטח Python |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|רישום | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` שמור לכלי genesis/bootstrap |
|לא רשום.|`unregister_trigger`; שימוש `Instruction.from_json` עבור סוגיות אחרות |
|הנפקה/ברן |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|העברה | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|מטא-נתונים ומנוהלים | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
|RWA מחזור חיים | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`                                                                                                         |
|ExecuteTrigger |`execute_trigger` |
|הורחבות ההשפעה/ההתיישבות | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`                                                                                                      |
|נעילות נכסים מובנות |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, וכן מסייעי לקוח מסוג `*_and_wait` |
|הסכום/הסירוב, SetParameter, רישום, מנהג, שיפור, ומוזוגים פחות נפוצים של רישום/לא רישום |`Instruction.from_json` או `TransactionBuilder.add_instruction_json` עם קאנוניקה `InstructionBox` JSON |

לתשלומים מותנים בסגנון escrow, ראו [escrow מובנה לנכסים](/he/blockchain/escrow.md#python-asset-locks). Python חושפת כעת עזרים מובנים לנעילות נכסים כלליות; עזרי marketplace ו־escrow אנונימי עדיין אינם שיטות Python מובנות.

### להגדיר דומיינים, ואז להירשם חשבונות ומשכרים {#set-up-domains-then-register-accounts-and-assets}

יצירת תחום דומיין רגיל עוברת דרך מתכנן התכונות המפורסמת כך שהכרזת SNS, יכולות הבעלים, אבטחת התמחור, ומצב התחום בודקים יחד. ליצור כוונה ללא סוד `AliasSetupPlanRequestV1` עם SDK או שירות האינטרנט שלך, ולאחר מכן להשתמש `iroha app alias setup plan` ו `iroha app alias setup apply`. לא להגיש `Instruction.register_domain` מטראפקציה של יישום; הבניין הזה נשאר למכשירים גנז / סטראפ.

לאחר שתוכנית הקמת הדומיין מתחייבת, רשום אובייקטים בבעלות הדומיין. ברשת משותפת כגון Taira, השתמש במרחב שמות דומיין וחשבון שועמדו לך.

```python
# The domain and its SNS lease already exist before this transaction.
submit(
    Instruction.register_account(alice, {"display_name": "Alice"}),
    Instruction.register_account(bob, {"display_name": "Bob"}),
    Instruction.register_asset_definition_numeric(
        ROSE_DEFINITION,
        owner=alice,
        scale=2,
        mintable="Infinitely",
        confidential_policy="TransparentOnly",
        metadata={"symbol": "ROS"},
    ),
)
```

`mintable` מקבל את הערכים `Infinitely`, `Once`, `Not` או `Limited(n)` שמודל הנתונים מקבל. עבור נכס מספרי ללא מגבלת דיוק, השמיטו את `scale`.

### רכוש הנפקה, שרוף והעברות {#mint-burn-and-transfer-assets}

קריאות אלה משתמשות נכס קיים ID. לרשום את ההגדרה של נכס קודם, ולאחר מכן לבנות את הנכסים הקונקרטיים ID עבור החשבון שבעלותו הנכסים.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### העברה בעלות {#transfer-ownership}

העברת הבעלים משנה מי שולט בדומיין, הגדרה של נכס או NFT. השתמש בבעלים הנוכחיים כחוקת העסקות.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### הגדרת וחיסול מטא-נתונים {#set-and-remove-metadata}

הערכים של מטא-מנתונים חייבים להיות JSON - סיריאליזציה. כאשר אתה משתמש `TransactionDraft`, הרשות ב `TransactionConfig` הופכת לחשבון היעד המקובל.

```python
# Values are encoded as JSON metadata under the target account.
submit(
    Instruction.set_account_key_value(
        alice,
        "profile",
        {"display_name": "Alice", "tier": "operator"},
    )
)

# Removing the key deletes the metadata entry from the account.
submit(Instruction.remove_account_key_value(alice, "profile"))
```

הצעת העוזר ברמה גבוהה מתבצעת על סמכות המערכה כדוגמא:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### נכסים בעולם האמיתי {#real-world-assets}

מסייעי RWA משתמשים במטענים הניתנים לסריאליזציה כ־JSON עבור מטא־נתונים ייחודיים לנכס, provenance ומדיניות controller. ‏`register_rwa` אינו מקבל `id` או `owner`: סביבת הריצה יוצרת את `RwaId`, וסמכות העסקה נעשית לבעלים הראשונים.

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Register the lot in a domain. Store business identifiers in primary_reference
# or metadata, then query the generated RWA ID after the transaction commits.
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "commodity": "copper",
            "warehouse": "DXB-01",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": True,
            "redeem_enabled": True,
        },
    }
)
```

לאחר commit של עסקאות הרישום, השתמשו `FindRwas`, `/v1/rwas`, באירוע RWA או במסלול המחקר המוגדר כדי לגלות את ה- ID שנוצר

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

פעולות שלאחר מכן משתמשות ב- `hash$domain` ID המוצר:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Transfer, hold, release, freeze, and redeem model the lot lifecycle.
draft.transfer_rwa(
    registered_rwa_id,
    quantity="10",
    destination=bob,
)
draft.hold_rwa(registered_rwa_id, quantity="5")
draft.release_rwa(registered_rwa_id, quantity="5")
draft.freeze_rwa(registered_rwa_id)
draft.unfreeze_rwa(registered_rwa_id)
draft.redeem_rwa(registered_rwa_id, quantity="1")

# RWA metadata and controls are separate from account metadata.
draft.set_rwa_key_value(registered_rwa_id, "auditor", "alice")
draft.remove_rwa_key_value(registered_rwa_id, "auditor")
draft.set_rwa_controls(
    registered_rwa_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)

# Merge consumes quantities from parent lots with the same domain and spec. The
# child lot gets a generated ID.
draft.merge_rwas(
    {
        "parents": [
            {"rwa": registered_rwa_id, "quantity": "40"},
            {
                "rwa": "fedcba9876543210fedcba9876543210"
                "fedcba9876543210fedcba9876543210$commodities.universal",
                "quantity": "60",
            },
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {"merge_reason": "same custodian and quality grade"},
    }
)

# Force transfer requires a configured controller and force_transfer_enabled.
draft.force_transfer_rwa(
    registered_rwa_id,
    quantity="1",
    destination=bob,
)
```

העברות מלאות יכולות להשתנות `owned_by` על הקבוצה הקיימת. העברת חלקית והפליגה יוצרות קבוצות ילדים שנוצרו.

### טריגרים {#triggers}

השתמשו בעוזרי הרישום של ההצלה כאשר המפעיל הוא רצף הוראות אחר:

```python
# The trigger executable is just another instruction payload.
reward = Instruction.mint_asset_numeric(ROSE_ASSET, "1")

# Time triggers run on a schedule once registered.
register_hourly = Instruction.register_time_trigger(
    "hourly_reward",
    alice,
    [reward],
    start_ms=1_800_000_000_000,
    period_ms=3_600_000,
    repeats=24,
    metadata={"purpose": "docs"},
)
submit(register_hourly)

# Precommit triggers run during the transaction pipeline.
register_precommit = Instruction.register_precommit_trigger(
    "precommit_reward",
    alice,
    [reward],
    repeats=10,
    metadata={"purpose": "pipeline test"},
)
submit(register_precommit)

# Trigger execution and repetition changes are also transactions.
submit(Instruction.execute_trigger("hourly_reward", args={"reason": "manual"}))
submit(Instruction.mint_trigger_repetitions("hourly_reward", 5))
submit(Instruction.burn_trigger_repetitions("hourly_reward", 1))
submit(Instruction.unregister_trigger("hourly_reward"))
```

Torii חושף גם REST עוזרים למלאי הטריגר:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

קריאות מא inventory של Trigger קוראים או בודקים רק רישומים של trigger. הרישום, ביצוע, שינויים חוזרים ולאירוך הם מבצעים מוטתיים.

### הוראות לאישור וההסדר {#repo-and-settlement-instructions}

עזרים ל־RWA ולהסדר דו־צדדי מוסיפים סוגי הוראות ייעודיים לתחום, בלי לחייב את המתקשר לבנות בעצמו מטעני Norito.

```python
from iroha_python import (
    RepoCashLeg,
    RepoCollateralLeg,
    RepoGovernance,
    SettlementAtomicity,
    SettlementExecutionOrder,
    SettlementLeg,
    SettlementPlan,
)

config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=APP_METADATA,
)
draft = TransactionDraft(config)

# Each repo leg describes one side of the financing agreement.
cash = RepoCashLeg(asset_definition_id="usd#wonderland", quantity="1000")
collateral = RepoCollateralLeg(
    asset_definition_id="bond#wonderland",
    quantity="1050",
    metadata={"isin": "ABC123"},
)
governance = RepoGovernance(haircut_bps=1500, margin_frequency_secs=86_400)

# Domain-specific draft methods append the corresponding instructions.
draft.repo_initiate(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    rate_bps=250,
    maturity_timestamp_ms=1_704_000_000_000,
    governance=governance,
)
draft.repo_margin_call("daily_repo")
# Unwind uses the immutable counterparties, legs, and maturity stored on-chain.
draft.repo_unwind("daily_repo")

# DVP/PVP settlement plans encode ordering and atomicity for both legs.
delivery = SettlementLeg(
    asset_definition_id="bond#wonderland",
    quantity="10",
    from_account=alice,
    to_account=bob,
    metadata={"isin": "ABC123"},
)
payment = SettlementLeg(
    asset_definition_id="usd#wonderland",
    quantity="1000",
    from_account=bob,
    to_account=alice,
)
plan = SettlementPlan(
    order=SettlementExecutionOrder.PAYMENT_THEN_DELIVERY,
    atomicity=SettlementAtomicity.ALL_OR_NOTHING,
)

draft.settlement_dvp(
    settlement_id="trade_dvp",
    delivery_leg=delivery,
    payment_leg=payment,
    plan=plan,
    metadata={"desk": "rates"},
)
draft.settlement_pvp(
    settlement_id="trade_pvp",
    primary_leg=payment,
    counter_leg=delivery,
)

envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON פתח הבריחה {#json-escape-hatch}

כאשר Python העוזר לא זמין, למזון מודל נתונים קנוני `InstructionBox` JSON ל- `Instruction.from_json`. זו הנתיב המומלץ `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, צומת/ תפקיד/NFT רישום, וריאונים שאינם מפעילים לא רשומים עד שהמשתמשים האלה נכתבים.

```python
from iroha_python import Instruction

# Copy this payload from Rust/CLI tooling or from a pinned data-model schema.
instruction_box_json = """
{
  "<InstructionVariant>": {
    "...": "..."
  }
}
"""

instruction = Instruction.from_json(instruction_box_json)
submit(instruction)
```

שמרו על הנתיב הקובץ המטופל בגבול העסקה: הוא שומר את `NetworkId` המדויק, כוונת תשלום דמיה, ואינווארינט של התמחור לפני חתימה. שימוש ישיר `TransactionBuilder` דורש את אותם ערכים ועוד אישור מפורש של תמחור חי, כך שזה לא קיצור עבור קוד היישום.

עבור הוראות נוצרות או לא ברורות, נסיעה וחזרה דרך JSON לפני שמירת נתוני בדיקה:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## זרמי עבודה של עסקאות {#transaction-workflows}

השתמש `TransactionDraft` עבור יישומים שבונים הוראות מרובות לפני חתימה. עיצוב מאפשר לך לשמור על הגדרות ברמת העסקה כגון `ttl_ms`, `nonce` ומטא-נתונים במקום אחד, ואז לחתום פעם אחת:

```python
config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata=APP_METADATA,
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition(
    ROSE_DEFINITION,
    owning_domain=None,
    balance_scope_policy="Global",
    name="Rose",
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_quantity(ROSE_ASSET, "100")
draft.transfer_asset_quantity(ROSE_ASSET, "25", bob)

# Quoting freezes the draft, validates exact fee limits, and signs that payload.
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

הפיקו מניפסט דטרמיניסטי לצורך בדיקה, ביקורת או מסירה לארנק:

```python
import json
from pathlib import Path

# Manifests are review artifacts; they are not submitted by themselves.
manifest = draft.to_manifest_dict(include_creation_time=True)
print(json.dumps(manifest, indent=2))

Path("transaction_manifest.json").write_text(
    draft.to_manifest_json(indent=2, include_creation_time=True),
    encoding="utf-8",
)
```

קישור אבטחת פרטיות של מסלול לפני חתימה כאשר מסלול המטרה דורש זאת:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_name="lane_privacy_vk",
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
```

## שאילתות {#queries}

עוזרי השאילתות המוצגים מספקים כיתות נתונים במקום מילון JSON רם. הם הדרך הקלה ביותר להתחיל, מכיוון ש- SDK נבחן את דף הדפים ושטחים רשומים נפוצים עבורך:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

השתמשו בעזרי הבקשות הגנריים כאשר לנקודת קצה של Torii עדיין אין מעטפת תוכנה מטיפוס מוגדר:

```python
from urllib.request import Request, urlopen

# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Prometheus exposition is served at `/metrics` when telemetry is `extended`
# or `full`; it is text, not a `/v1` JSON resource.
request = Request(f"{TORII_URL}/metrics", headers={"Accept": "text/plain"})
with urlopen(request, timeout=5) as response:
    metrics = response.read().decode("utf-8")
```

עוזרים למלאי חשבונות דורשים מזהה חשבון מוכר SDK זה נורמליזה, השתמש בקנוניקה I105 חשבון IDs או שם כינוי על שרשרת; אם חוקר בלוק או נקודת סיום חלקית חוזרת על ID כי SDK סירב, לפתור את זה על חשבון קנוני ID לפני שאתה קורא לעוזרים האלה:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## אירועים {#events}

עזרי ההזרמה מפענחים מטעני JSON כברירת מחדל. העבירו `with_metadata=True` כאשר דרושים שם אירוע SSE, מזהה, רמז לניסיון חוזר והמטען הגולמי. ההזנה הקנונית `/v1/events/sse` משדרת בזמן אמת בלבד: היא אינה פולטת replay IDs ואינה שומרת יומן הפעלה חוזרת, ולכן העזרים אינם חושפים סמן או ארגומנט לחידוש. חיבור מחדש מתחיל מינוי חדש ועלול להשאיר פער; השתמשו ב־`/v1/blocks/stream` מגובה ידוע כאשר נדרשת היסטוריה מלאה של ספר החשבונות. הדוגמאות ממתינות לאירועים חיים, ולכן הריצו אותן מול צומת שבו הזרם מופעל ופעיל.

```python
from iroha_python import DataEventFilter, SseStreamError

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

try:
    for event in client.stream_events(filter=proof_filter, with_metadata=True):
        print(event.id, event.event, event.data)
        break
except SseStreamError as error:
    print(error.code, error.dropped_messages, error.replay_available)

for event in client.stream_trigger_events(trigger_id="hourly_reward"):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## מפתחות וכתובת {#keys-and-addresses}

SDK חושף עוזרי חתימה מקומיים עבור כל אלגוריתם לחתימה שהוקמו לתוך הרחבת המולדת. עוזרים אלה לא מתקשרים ל- Taira, אך הם דורשים את הרחבת ההולדת:

```python
from iroha_python import (
    ED25519_ALGORITHM,
    derive_confidential_keyset_from_hex,
    derive_keypair_from_seed,
    hash_blake2b_32,
    verify,
)
from iroha_python.address import AccountAddress

# Key derivation and signing are local; no network call is made here.
ed_pair = derive_keypair_from_seed(b"alice", ED25519_ALGORITHM)
signature = ed_pair.sign(b"payload")
assert verify(ED25519_ALGORITHM, ed_pair.public_key, b"payload", signature)

# Canonical AccountId/I105 identity is derived only from the controller key.
# This constructor currently requires `domain`; canonical identity ignores it
# and AccountAddress.from_account emits a domainless address.
address = AccountAddress.from_account(domain="wonderland", public_key=ed_pair.public_key)
print(address.canonical_hex())
print(address.to_i105(0x02F1))

# Confidential key helpers derive local viewing/spending material.
confidential = derive_confidential_keyset_from_hex("01" * 32)
print(confidential.as_hex())
print(hash_blake2b_32(b"payload").hex())
```

השתמש `supported_crypto_algorithms()` כדי לראות מה עולה על הגלגל שלך. העוזרים הכלליים משתמשים בתוויות אלגוריתם קנוני ופועלים עבור Ed25519, secp256k1, ML-DSA, GOST, BLS, ו SM2 כאשר האלגוריתמים אלה מתואמים ב:

```python
from iroha_python import (
    CryptoKeyPair,
    derive_keypair_from_seed,
    load_keypair,
    parse_private_key_multihash,
    parse_public_key_multihash,
    private_key_multihash,
    public_key_multihash,
    sign,
    supported_crypto_algorithms,
    verify,
)

message = b"iroha multi-algorithm signing"

# Iterate the algorithms compiled into the installed native extension.
for algorithm in supported_crypto_algorithms():
    keypair = derive_keypair_from_seed(f"docs:{algorithm}".encode(), algorithm)
    signature = keypair.sign(message)

    # Both the object method and the generic helper verify the same signature.
    assert keypair.verify(message, signature)
    assert verify(algorithm, keypair.public_key, message, signature)

    # Loading a private key should reconstruct the same public key.
    loaded = load_keypair(keypair.private_key, algorithm)
    assert loaded.public_key == keypair.public_key
    assert sign(algorithm, loaded.private_key, message) != b""

    # Prefixed multihashes carry the algorithm label with the key bytes.
    public_multihash = public_key_multihash(
        algorithm,
        keypair.public_key,
        prefixed=True,
    )
    private_multihash = private_key_multihash(
        algorithm,
        keypair.private_key,
        prefixed=True,
    )

    public_algorithm, public_key = parse_public_key_multihash(public_multihash)
    private_algorithm, private_key = parse_private_key_multihash(private_multihash)
    restored = CryptoKeyPair.from_private_key_multihash(private_multihash)

    # Round-trip checks catch mismatched algorithm labels or key encodings.
    assert public_algorithm == algorithm
    assert public_key == keypair.public_key
    assert private_algorithm == algorithm
    assert private_key == keypair.private_key
    assert restored == keypair
```

### סינית SM קריפטוגרפיה {#chinese-sm-cryptography}

Python SDK חושף גם עוזרים גנריים של SM2 וגם עוזרי נוחות ספציפיים ל- SM2. השתמשו בפרסומת יכולת הערך כדי לבחור את מזהה ההבדל של SM2 הנחוש על ידי הרשת המטרה:

```python
from iroha_python import (
    SM2_ALGORITHM,
    SM2_DEFAULT_DISTINGUISHED_ID,
    derive_keypair_from_seed,
    derive_sm2_keypair_from_seed,
    sign,
    sign_sm2,
    verify,
    verify_sm2,
)

capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Use the node's default SM2 distinguishing ID when the node advertises one.
distid = sm.sm2_distid_default if sm else SM2_DEFAULT_DISTINGUISHED_ID

# The SM2-specific helper accepts the distinguishing ID explicitly.
pair = derive_sm2_keypair_from_seed(bytes.fromhex("11" * 32), distid=distid)
message = b"iroha-sm2-example"
signature = pair.sign(message)

assert pair.verify(message, signature)
assert verify_sm2(pair.public_key, message, signature, distid=distid)
assert sign_sm2(pair.private_key, message, distid=distid) != b""

# The generic API works when you only need the canonical `sm2` label.
generic_pair = derive_keypair_from_seed(bytes.fromhex("22" * 32), SM2_ALGORITHM)
generic_signature = sign(SM2_ALGORITHM, generic_pair.private_key, message)
assert verify(SM2_ALGORITHM, generic_pair.public_key, message, generic_signature)

print(pair.public_key_sec1_hex)
print(pair.public_key_multihash)
```

`crypto.sm.enabled` אומר לך אם הערך מקבל אלגוריתמים של משפחת SM במדיניותו הנוכחית. אותה פרסומת כוללת את מדיניות ההש SM ומצב האיקסלרציה, אשר שימושי בעת החלטה אם להפעיל זרמים ספציפיים של SM2:

```python
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

התייחסו למטען היכולת המאומת כמקור הסמכות עבור הצומת שנפרס. אל תשלחו עסקה חתומה ב־SM2 אלא אם `crypto.sm.enabled` הוא true ומדיניות החתימה המפורסמת מתירה זאת.

### GOST ומפתחות לאחר הקוואנטום {#gost-and-post-quantum-keys}

השתמש בקריפטו גנרית. API עבור GOST R 34.10-2012 קבוצות פרמטרים ו ML-DSA (`ml-dsa`) חתימות לאחר קוואנטום. האובייקט זהה של זוג מפתחות מטפל בחתימה, בדיקת, ויצוא מולטי-האש:

```python
from iroha_python import (
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM,
    ML_DSA_ALGORITHM,
    derive_keypair_from_seed,
    verify,
)
from iroha_python.address import AccountAddress

CHAIN_DISCRIMINANT = 0x02F1
message = b"iroha gost and post-quantum example"

# Crypto helpers use canonical labels; account addresses use compact aliases.
# Every `domain=` argument below is ignored when the canonical AccountId/I105
# address is encoded.
GOST_ADDRESS_ALIASES = {
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM: "gost-256-a",
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM: "gost-256-b",
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM: "gost-256-c",
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM: "gost-512-a",
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM: "gost-512-b",
}

# Derive and verify one local keypair for every GOST parameter set.
for crypto_algorithm, address_algorithm in GOST_ADDRESS_ALIASES.items():
    keypair = derive_keypair_from_seed(
        f"docs:{crypto_algorithm}".encode(),
        crypto_algorithm,
    )
    signature = keypair.sign(message)

    assert verify(crypto_algorithm, keypair.public_key, message, signature)

    address = AccountAddress.from_account(
        domain="wonderland",
        public_key=keypair.public_key,
        # Account addresses use compact curve aliases for GOST parameter sets.
        algorithm=address_algorithm,
    )
    print(crypto_algorithm)
    print(address.canonical_hex())
    print(address.to_i105(CHAIN_DISCRIMINANT))
    print(keypair.prefixed_public_key_multihash)

# ML-DSA follows the same generic signing and address flow.
mldsa_keypair = derive_keypair_from_seed(b"docs:ml-dsa", ML_DSA_ALGORITHM)
mldsa_signature = mldsa_keypair.sign(message)
assert verify(ML_DSA_ALGORITHM, mldsa_keypair.public_key, message, mldsa_signature)
post_quantum_address = AccountAddress.from_account(
    domain="wonderland",
    public_key=mldsa_keypair.public_key,
    algorithm="ml-dsa",
)
print(post_quantum_address.canonical_hex())
print(post_quantum_address.to_i105(CHAIN_DISCRIMINANT))
print(mldsa_keypair.prefixed_public_key_multihash)
```

שער GOST ותנועות לאחר הקוונטים על מודעת היכולת המותגנת של הערך:

```python
capabilities = client.get_node_capabilities_typed(
    canonical_auth=canonical_auth,
)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.allowed_signing if sm else ())

GOST_ALGORITHMS = {
    "gost3410-2012-256-paramset-a",
    "gost3410-2012-256-paramset-b",
    "gost3410-2012-256-paramset-c",
    "gost3410-2012-512-paramset-a",
    "gost3410-2012-512-paramset-b",
}

# Local support is not enough; submit only when the node advertises support.
supports_gost = bool(allowed & GOST_ALGORITHMS)
supports_post_quantum = "ml-dsa" in allowed
supports_sm2 = "sm2" in allowed and bool(sm and sm.enabled)

print(supports_gost, supports_post_quantum, supports_sm2)
```

אם הערך לא מפרסם את האלגוריתם שאתה צריך, השתמש במפתח רק עבור זרימות עבודה מקומיות או מקומיות. אל תשלח עסקאות חתומות עם האלגוריתם הזה לערך הזה. במהלך הבדיקה הציבורית Taira, GOST ו ML-DSA היו זמינים כעוזרי קריפטו של SDK בספריה Python העליונה, אך לא הודיעו על ידי הערך לחתום עסקים .

## יצירת לקוחות מודעים להגדרת {#config-aware-client-creation}

השתמש `resolve_torii_client_config` כאשר היישום שלך קורא את ההגדרות של הערך מתוך קובץ, אך עדיין זקוק ל-overrides הספציפיים לסביבה או למבחן:

```python
import json
from iroha_python import create_torii_client, resolve_torii_client_config

with open("iroha_config.json", "r", encoding="utf-8") as handle:
    raw_config = json.load(handle)

# Override only the fields that vary by environment.
resolved = resolve_torii_client_config(
    config=raw_config,
    overrides={"timeout_ms": 2_000, "max_retries": 5},
)

# Pass the resolved config into the same client constructor used elsewhere.
client = create_torii_client(
    raw_config.get("torii", {}).get("address", TORII_URL),
    resolved_config=resolved,
)
```

## מוכנות Kagemusha {#kagemusha-readiness}

Python SDK יכולה לבקש את נתיב המוכנות הנוכחי של JSON באמצעות עזר הבקשות הכללי שלה ל־Torii:

```python
ASSET_DEFINITION_ID = "<canonical_asset_definition_id>"

readiness = client.request_json(
    "GET",
    "/v1/offline/readiness",
    params={"asset_definition_id": ASSET_DEFINITION_ID},
    headers={"Accept": "application/json"},
    expected_status=(200,),
)
print(readiness["ready"])
print(readiness["blockers"])
```

Python אינה מספקת בונים בעלי טיפוס מוגדר לחבילות Kagemusha של top-up או redemption. השתמשו בארנק בעל טיפוסים ב־Swift או ב־JVM כדי לבנות את מטעני V4 הקנוניים, ולאחר מכן שלחו אותם ועקבו אחריהם באמצעות לקוח Kagemusha התומך ב־Torii.

## חתימות {#subscriptions}

קריאת ההרשמה והבניית הדו"ח מורשתים מהלקוח המשותף Torii המשמש על ידי `iroha_python.ToriiClient`. כל מוטציה מובנת עם חתימת חשבון קאנוניקה מחויבת לגוף ומחזרת דו"ח של עסקאות לא חתומה. Torii אף פעם לא מקבל מפתח פרטי ולא מספק את הדו"ה עבורך .

```python
# The plan defines billing cadence, retry policy, and usage pricing.
usage_plan = {
    "provider": alice,
    "billing": {
        "cadence": {
            "kind": "monthly_calendar",
            "detail": {"anchor_day": 1, "anchor_time_ms": 0},
        },
        "bill_for": {"period": "previous_period", "value": None},
        "retry_backoff_ms": 86_400_000,
        "max_failures": 3,
        "grace_ms": 604_800_000,
    },
    "pricing": {
        "kind": "usage",
        "detail": {
            "unit_price": "0.024",
            "unit_key": "compute_ms",
            "asset_definition": "usd#wonderland",
        },
    },
}

# The provider authorizes preparation of a plan-registration draft.
plan_draft = client.create_subscription_plan(
    authority=alice,
    plan_id="compute#wonderland",
    plan=usage_plan,
    canonical_auth=canonical_auth,
)

bob_canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=bob,
    signer=bob_pair.sign,
)

# The subscriber authorizes preparation of a subscription-creation draft.
subscription_draft = client.create_subscription(
    authority=bob,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
    canonical_auth=bob_canonical_auth,
)

# Usage and charge-now operations also return unsigned transaction drafts.
usage_draft = client.record_subscription_usage(
    "sub-001",
    authority=alice,
    unit_key="compute_ms",
    delta="3600000",
    canonical_auth=canonical_auth,
)
charge_draft = client.charge_subscription_now(
    "sub-001",
    authority=alice,
    canonical_auth=canonical_auth,
)

for draft in (plan_draft, subscription_draft, usage_draft, charge_draft):
    assert draft.submitted is False
    print(draft.transaction_payload_b64, draft.signing_message_b64)
```

העבירו כל מטען מדויק ואת הודעת החתימה לארנק המקומי של החשבון המתאים, אמתו שם את הפעולה המבוקשת, הרכיבו את העסקה החתומה ושלחו אותה דרך שרשרת עיבוד העיבוד הרגיל של העסקאות. Python SDK מוודא שהודעת החתימה היא הגיבוב הקנוני של המטען שהוחזר, אך הארנק עדיין אחראי לפענוח העסקה ולאישורה לפני החתימה.

## חיבור {#connect}

לבנות ולחקור קישור URIs מקומית. זהות קישור מחייבת את SID ל- `NetworkId` המדויק, מפתח ציבורי של האפליקציה, ו- nonce:

```python
from iroha_python.connect import create_connect_session_preview, parse_connect_uri

# Generate consistent SID, key, nonce, and URI values as one bundle.
preview = create_connect_session_preview(
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
parsed = parse_connect_uri(preview.wallet_uri)

assert parsed.sid == preview.sid_base64url
assert parsed.network_id.literal == TAIRA_NETWORK_ID.literal
assert parsed.app_public_key == preview.app_key_pair.public_key
```

רשום את הצפייה המדויקת רק כאשר הערך היעד חושף Connect. יצירת הפגישה מחזירה ארבעה סימנים ספציפיים לתפקיד. נתיב מצב של כל פגישה דורש את הסימן לניהול; מצב הנתון הוא נתיב מבעל.

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    bootstrap_connect_preview_session,
    decode_connect_frame,
    encode_connect_frame,
)

bootstrap = bootstrap_connect_preview_session(
    client,
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
info = bootstrap.session
tokens = bootstrap.tokens
assert info is not None and tokens is not None

session_status = client.request_json(
    "GET",
    "/v1/connect/status",
    params={"sid": info.sid},
    headers={"Authorization": f"Bearer {tokens.management}"},
    expected_status=(200,),
)
print(info.app_uri, session_status)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=bootstrap.preview.app_key_pair.public_key,
        network_id=TAIRA_NETWORK_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and also travels as a frame.
close_frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=2,
    control=ConnectControlClose(
        role="App", code=4100, reason="finished", retryable=False
    ),
)
close_payload = encode_connect_frame(close_frame)
```

לחבר הודעות לאחר אישור עם הפגישה של מצב:

```python
from iroha_python import (
    ConnectDirection,
    ConnectSession,
    ConnectSessionKeys,
    ConnectSignRequestRawPayload,
)

# Derive symmetric session keys from both parties' keys and the session ID.
keys = ConnectSessionKeys.derive(
    local_private_key=bytes.fromhex("11" * 32),
    peer_public_key=bytes.fromhex("22" * 32),
    sid=bytes.fromhex("33" * 32),
)
session = ConnectSession(
    sid=bytes.fromhex("33" * 32),
    keys=keys,
)
# Encrypt application payloads after the session is approved.
encrypted = session.encrypt_app_to_wallet(
    ConnectSignRequestRawPayload(domain_tag="SIGN", payload=b"hash")
)
state = session.snapshot_state().to_dict()
print(encrypted.sequence, state)
```

## הממשל, זמן ההפעלה ומרחבי מנהלים {#governance-runtime-and-admin-surfaces}

קריאת הניהול היא אימות חשבון. באמצעות סמכות [התקנה משותפת](#shared-setup), קבל כל קריאה של עוזר Taira זה מוצא מדויק מהגניזה. `NetworkId`:

```python
# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces(canonical_auth=canonical_auth)
referendum = client.get_governance_referendum_typed(
    "ref-1", canonical_auth=canonical_auth
)
tally = client.get_governance_tally_typed("ref-1", canonical_auth=canonical_auth)
locks = client.get_governance_locks_typed("ref-1", canonical_auth=canonical_auth)
unlock_stats = client.get_governance_unlock_stats_typed(
    canonical_auth=canonical_auth
)

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Account-authenticated runtime reads use the same canonical request proof.
abi = client.get_runtime_abi_active_typed(canonical_auth=canonical_auth)
# The ABI hash itself is a public read.
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed(canonical_auth=canonical_auth)
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

print(abi, abi_hash, runtime_metrics)
print(capabilities.abi_version)
```

ליצור קלינט נפרד לקריאת המפעיל. טעון את מפתח המפעיל רשום בזמן הפעלת ולחבר אותו ל- Taira המדויק של `NetworkId`; סימני הדובר ו- `x-api-token` לא מחליפים את החתימה הזו:

```python
import os

from iroha_python import Ed25519KeyPair, NetworkId, OperatorSigningContext

operator_pair = Ed25519KeyPair.from_private_key(
    bytes.fromhex(os.environ["IROHA_OPERATOR_PRIVATE_KEY_HEX"])
)
operator_client = create_torii_client(
    TORII_URL,
    operator_signing_context=OperatorSigningContext(
        TAIRA_NETWORK_ID,
        operator_pair,
    ),
)
```

מסלולים לשיפור זמן הפעלה הם בונים של הוראות מאושרים על ידי המפעיל. הצעה מוצלחת, פעולת או ביטול תשובות `tx_instructions`; זה לא מייצג את ההתקדמות. תשלח את החבילה דרך העסקה הנחתם הרגיל ודרך הממשל. Python שיטות `propose_runtime_upgrade`, `activate_runtime_upgrade`, ו `cancel_runtime_upgrade` כיום יוצרים בקשות פשוטות במקום ליישם את `OperatorSigningContext`, כך שהטוריאליון הזה לא מציג אותם כזרם מבצע עבודה.

## מצב, הסכמה וטלמטריה של הרשת {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time-status endpoints use the operator client configured above.
sumeragi = operator_client.get_sumeragi_status_typed()
diagnostics = operator_client.get_sumeragi_diagnostics_typed()
print(sumeragi.last_committed_height, diagnostics.tx_queue_saturated)

time_now = client.get_time_now()
time_status = operator_client.get_time_status()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)

# Connect aggregate status is operator-authenticated. Individual sessions use
# `/v1/connect/status?sid=...` with their management bearer token instead.
connect_status = operator_client.get_connect_status_typed()
if connect_status is not None:
    print(connect_status.enabled, connect_status.sessions_active)
```

## SoraFS, UAID, ו Kaigi עוזרים {#sorafs-uaid-and-kaigi-helpers}

עוזרים אלה זמינים כאשר הערך היעד חושף את נקודות הסיום המתאימות Nexus/SORA. להתייחס לרשימות ריקות כגובה תקנה: הציבורי Taira עשוי להפעיל את הנתיב ללא נתונים למניפסט הדגימה או UAID.

```python
# SoraFS status queries are reads scoped by manifest and status.
por_status = client.get_sorafs_por_status(manifest_hex="ab" * 32, status="verified")
print(len(por_status))

# UAID helpers inspect wallet/data-space bindings for one identifier.
uaid = "aabb" * 16
bindings = client.get_uaid_bindings_typed(uaid)
manifests = client.list_space_directory_manifests_typed(
    uaid,
    dataspace=11,
    status="active",
)
print(len(bindings.dataspaces), len(manifests.manifests))

# Kaigi relay health is an operator snapshot, even though it is read-only.
health = operator_client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC ו GPU עוזרים {#norito-rpc-and-gpu-helpers}

השתמש `NoritoRpcClient` כאשר יש לך כבר בייטים Norito ואתה צריך להתקשר לנקודת קץ בינארית Torii. לדוגמה נדרש מעטפה חתומה מדפסת עסקאות קודמת.

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call(
        "/v1/pipeline/transactions",
        envelope.signed_transaction_versioned,
    )
    print(len(response_bytes))
```

CUDA עוזרים להחזיר `None` כאשר ההסגר לא זמין, כך יישומים יכולים לחזור ליישום skalar:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## הכיסוי הנוכחי {#current-coverage}

ה- Python SDK כולל כבר עוזרים ל:

- Torii זרמי הגשת, מצב, בקשה וניהול
- בונים של הוראות טפוטים למרחבים משותפים ISI ומרחבים ספציפיים לתחום.
- תהליכי עבודה לחיבור עסקאות, מניפסטים, חתימות וחותמים
- זרימות אירועים חיות ופילטרים מקובלים; זרימות בלוק commit מספקות היסטוריה מלאה.
- גישה כללית למצב המוכנות של Kagemusha ומסייעי מנוי של Torii; בונים בעלי טיפוס ל־top-up ולארכיון redemption אינם חשופים
- כתובת החשבון, עוזרים לחתימה של אלגוריתם כולו, נסיעות הלוך ושוב רבות, SM2, GOST, ML-DSA, BLS, וניהול מפתח סודי.
- חיבור URIs, פגישות, מסדרים, עוזרים לחשוף ומנהל רישום
- מעטפות תוכנה לנקודות הקצה של ממשל, שדרוג runtime,‏ Sumeragi, ניהול צומת, SoraFS,‏ UAID ו-Kaigi, כאשר הצומת מספק תכונות אלה

## ראשי תיקון מקדימה {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

הקבצים האלה הם מקור האמת עבור פני השטח Python בפינוי החלל העבודה המופק.
