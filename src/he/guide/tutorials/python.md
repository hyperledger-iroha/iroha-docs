---
translation_locale: he
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

ה- Python SDK במרחב העבודה העליון הוא `iroha-python`. הראשון. Iroha 3
מטרות השחרור Torii ו Norito על פני השטח. תקע את גרסת החבילה
או תיקון המקור שימש באינטגרציה שלך SDK והנקודה להישאר על
אותו תיקון בקבוצת אלקטרוני.

הדוגמאות הנמצאות בהמשך הן רק קריאה. Taira ב
`https://taira.sora.org`. דוגמאות מוטציות הן תבניות עסקאות: הם
דורשים Taira סמכות, מפתח פרטי, מטא-נתונים על גז וכל מפעיל
סימנים הנדרשים על ידי מסלול היעד לפני שיכלו להגיש אותם.

השתמשו בדוגמאות בסדר זה:

| שלב | רוץ נגד הציבור Taira? | מה שאתה צריך |
| --- | --- | --- |
| שיחות לקוחות קריאה בלבד | כן. | Python חבילה ועוד גישה לרשת |
| יצרני חתימות ומוראות מקומיים | אין שיחת רשת עד `submit()` | הרחבה המקומית ואת החומר המרכזי שלך |
| עסקי מוטציה וקריאות שירות | רק עם חשבון משומך שלך | חשבון רשויות, מפתח פרטי, שרשרת ID, נתונים מטאטא של עמלות, סולן נכסים של עמלות וטוגנים של מסלול |
| חיבור קודקים מסגרת, קריפטו, ו GPU עוזרים | רק מקומי | הרחבה המקומית; GPU עוזרים צריכים גם CUDA-הסוג היכול לסדר האחורי |

## תקין {#install}

השם של הנתונים המטאטאוניים של החבילה הוא `iroha-python`. אל תחשבו על חוסר סימנים. PyPI
ההתקנה מתאימה ל- Live Taira רשת. להתקין גלגל או מקורות בדיקת
נבנתה מאותו תיקון ראשוני מטרות האינטגרציה שלך:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

אם הפרויקט שלך צורב את המרחב העליון של העבודה ישירות, תקין Python
תלות ולבניית ההרחבה המקומית לפני פעלת דוגמאות
`Instruction`, `TransactionDraft`, חתימה, קריפטו, SoraFS עוזרים ילידים, GPU
עוזרים, או קודקים תמונות Connect.
`python/iroha_python/README.md`, לאחר מכן לבדוק כי המטען של היצוא המקומי:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

אם `create_torii_client` יבוא אבל `Instruction` או
`generate_ed25519_keypair` כישלונות, הטהורים Python החבילה זמינה אך
ההרחבה המקומית לא.

## התחלה מהירה {#quickstart}

תתחיל עם ציבור, רק קריאה Taira נקודות סוף:

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

השתמשו בהקנה זו עבור תבניות המוטות. החליפו כל מחזיק מקום
Taira סמכות, מפתח פרטי, טוקן, נכס/חשבון IDs מההתגייסות שלך
לפני שהשתתף.

`authority` הוא החשבון המחתם על העסקה. `private_key` חייב להתאים
החשבון הזה, `CHAIN_ID` חייב להתאים לרשת היעד, ו `TX_METADATA` חייב
לכלול את שדות המחיר הנצפים על ידי הרשת.
אי תוקף בכוונה, כך שהם לא הוגשו במקרה.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    TransactionConfig,
    TransactionDraft,
    create_torii_client,
)

TORII_URL = "https://taira.sora.org"
CHAIN_ID = "fc56984b-2be7-431d-840e-21514d1883f0"
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

TX_METADATA = {
    # Public Taira fee asset. Use the configured XOR asset on your network.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

client = create_torii_client(TORII_URL, auth_token=AUTH_TOKEN)


def submit(*instructions):
    # This is the network boundary: build, sign, submit, and wait for status.
    return client.build_and_submit_transaction(
        chain_id=CHAIN_ID,
        authority=alice,
        private_key=alice_pair.private_key,
        instructions=list(instructions),
        metadata=TX_METADATA,
        wait=True,
    )
```

`Instruction.*` קורות רק לבנות מטענים מועילים של הוראות. `submit()` האם זה
נקודה שבה SDK חותם על העסקה, שולח אותה ל Torii, ומחכה
מצב.

## דמי הסכום והגז {#fees-and-gas}

כתיבת עסקאות זקוקה לתנתונים מטאטא של דמי דמי ודמי אסיטום מימון. Taira,
נכס העלות מימון על ידי המזרקה הציבורית ואת הנתונים המטאטאניים של העסקאות חייבים
כולל `gas_asset_id`. על Minamoto, דמי ההכנסה משולבים בפועל. XOR ואת הנכסים
ID מגיע מההסדר של הרשת.

הנתונים המטאטאליים של דמי עמלה נחשבים לעסקה, לא להוראות בודדות.
`submit()` עוזר מעל קישורים `TX_METADATA` לכל עסקאות שהיא יוצרת:

```python
TX_METADATA = {
    # Taira expects the fee asset definition in transaction metadata.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

envelope, status = client.build_and_submit_transaction(
    chain_id=CHAIN_ID,
    authority=alice,
    private_key=alice_pair.private_key,
    # Fee metadata is attached to the transaction, not the instruction.
    instructions=[
        Instruction.set_account_key_value(
            alice,
            "python_fee_example",
            "ready",
        )
    ],
    metadata=TX_METADATA,
    wait=True,
)
```

לפני שישלחו הודעות, ודא שהחשבון של הסמכות יש מספיק כסף.
נכס. המזרקה המדויקת ואת נכס ID הם ספציפיים לרשת; זה Taira
צורה:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"
TX_METADATA = {"gas_asset_id": FEE_ASSET_DEFINITION}

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

המברח מחזיר את הקונקרט `asset_id` כדי להשתמש בבדיקת המשקל.
`gas_asset_id` שדה הנתונים המטאטא משתמשים בהגדרה של נכס תשלום ID.

לשמור על מטא-מידע של היישום נפרד מהמטא-מידי תשלום על ידי מיזוג המפות
כאשר אתה מבצע עסקאות:

```python
APP_METADATA = {"source": "python-docs"}
# Merge app metadata with required fee metadata before building the draft.
metadata = {**TX_METADATA, **APP_METADATA}

draft = TransactionDraft(
    TransactionConfig(
        chain_id=CHAIN_ID,
        authority=alice,
        metadata=metadata,
    )
)
```

אם אתה מחמיץ נתונים מטאטא של דמי, להשתמש נכס דמי לא נכון, או לחתום עם
חשבון, רשת אמיתית צריכה לסרב את העסקה גם אם ההוראה
מטען מועיל הוא אחרת תקף.

## Taira-תקריאות מבוקשות בקריאה בלבד {#taira-checked-read-only-calls}

השיחות האלה חזרו בהצלחה נגד הציבור Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.query_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
sumeragi = client.get_sumeragi_status_typed()
connect = client.get_connect_status_typed()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_time_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms, len(time_status.samples), sumeragi.leader_index)
print(connect.enabled, connect.sessions_active)
```

מסלולים כגון `/v1/status`, רשימת הנתונים הציבורית, Sumeragi RBC ניסוי דגימות, קשר
תמונות של מנהל, וניהול רישום אפליקציה Connect לא היו ציבוריים
זמין ב Taira במהלך הבדיקה. `request_json("GET", "/status")` עבור
המטען הפועל של מצב הערך הציבורי על Taira.

## הוראות לבניינים {#instruction-builders}

ה- SDK מגלים בונים טפסים למשפחות ההוראות הנפוצות ביותר
JSON כפתור בריחה עבור סוגי שאינם מסוג ראשון Python שיטות עדיין.
החתיכות הבאות הן תבניות עסקאות מוטותיות ולא היו
הוצגו לציבור Taira בלי חשבון חתימה.

הם מעדיפים עוזרים כתיבים כשהם קיימים: הם נורמליזים Python ערכים וכישלון
מוקדם על צורות לא חוקיות. `Instruction.from_json` רק כאשר אתה צריך
סוגי הוראות שאין בהם Python עוזר עדיין.

| משפחת ההוראה | Python פני השטח |
| --- | --- |
| רישום | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` מיועד למכשירים גנזיס/תקנה |
| לא רשום | `unregister_trigger`; שימוש `Instruction.from_json` עבור גרסאות אחרות |
| מנט/ברן | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
| העברה | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
| מטאדאטה ופיקוח | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA מחזור החיים | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger | `execute_trigger` |
| ההרחבה של ה-repo/ההתיישבות | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
| סגרות נכסים מקומיים | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, בנוסף לקוח `*_and_wait` עוזרים |
| גרנט/רוחב, SetParameter, רישום, קוסטום, שיפור, וריאונים פחות נפוצים של רישום/לא רישום | `Instruction.from_json` או `TransactionBuilder.add_instruction_json` עם קאנוניקה `InstructionBox` JSON |

עבור תשלומים תנאי בסגנון מאבטחה, ראה
[אסיטום נטיב](/he/blockchain/escrow.md#python-asset-locks). Python
כיום פוגעים בעוזרים מדרגה ראשונה עבור סגרות נכסים גנריות;
עוזרים לאמונים לא מסוג ראשון. Python שיטות עדיין.

### הגדרת דומנים, ואז רשום חשבונות ומשאבים {#set-up-domains-then-register-accounts-and-assets}

יצירת תחום רגיל עוברת דרך מתכנן התכונות הצהריים כך שה SNS
הסכם השכרה, יכולות הבעלים, אבטחת הציטוט, ומצב הדומיין בודקים יחד.
ליצור סוד חופשי `AliasSetupPlanRequestV1` כוונה שלך SDK או
שירות סיבוב, לאחר מכן להשתמש `iroha app alias setup plan` ו
`iroha app alias setup apply`. אל תתני `Instruction.register_domain`
מתוך עסקאות יישום; הבניין הזה נשאר עבור genesis/bootstrap
כלי עבודה.

לאחר שתכנון הקמת הדומיין מתחייב, רשום אובייקטים בבעלות הדומיין.
רשת כגון Taira, השתמשו בשטח שמות של דומיין וחשבון שועמדו לכם.

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

`mintable` מקבל `Infinitely`, `Once`, `Not`, או `Limited(n)` ערכים מקובלים
על ידי מודל המידע. `scale` עבור נכס מספר ללא מחוייבות.

### רכוש מנט, שרוף ושינוי {#mint-burn-and-transfer-assets}

שיחות אלה משתמשות נכס קיים ID. רשום את הגדרה של נכס קודם, ואז
בניית נכס בטון ID עבור החשבון שהיצרן של הנכס.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### העברה בעלות {#transfer-ownership}

העברת הבעלות משנה מי שולט בדומיין, הגדרה של נכס או NFT.
השתמשו בבעלים הנוכחיים כאל סמכות העסקה.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### הגדרת וחיסול נתונים מטאטא {#set-and-remove-metadata}

הערכים של מטא נתונים חייבים להיות: JSON-אפשר לסדר את זה. `TransactionDraft`, ה-
סמכות ב `TransactionConfig` הופך לחשבון המטרה המוגדר.

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

הצעת העוזר ברמה גבוהה מתמקדת במערכת ההסכמים כדוגמא:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### נכסים בעולם האמיתי {#real-world-assets}

RWA עוזרים משתמשים JSON-חומרי תועלת שניתן לסדר עבור מטא נתונים ספציפיים לנכסים,
מוצא, מדיניות המפקח. `register_rwa` לא מקבלת `id` או
`owner`: זמן ההפעלה מייצר את `RwaId`, והרשויות העסקות
הופך להיות הבעלים הראשוני.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

לאחר ההתחייבות של עסקאות הרישום, שימוש `FindRwas`, `/v1/rwas`, דה RWA
אירוע, או מסלול המחקרי המוקם כדי לגלות את ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

פעולות שלאחר מכן משתמשות `hash$domain` ID:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

העברות מלאות יכולות להשתנות `owned_by` על המגרש הקיימים.
מיזוגים יוצרים הרבה ילדים שנוצרו.

### תפעילים {#triggers}

השתמשו בעוזרי הרישום של ההדק כאשר הנתון ניתן לבצע הוא הוראה אחרת
רצף:

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

Torii גם מגלה REST עוזרים למלאי המניע:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

שיחות רכישת התניע רק לקרוא או לבדוק רשומות התניע.
ביצוע, שינויים חוזרים, ולאישור הם מבצעים מוטנטים.

### ההוראות להשלכת הסכום וההסדר {#repo-and-settlement-instructions}

עוזרים למתיישבים דו-צדדיים ומציגי ההסדרים מוסיפים הוראות ספציפיות לתחום
תוצרות ללא עבודת יד Norito מטענים מועילים:

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
    chain_id=CHAIN_ID,
    authority=alice,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=TX_METADATA,
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
draft.repo_unwind(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    settlement_timestamp_ms=1_704_086_400_000,
)

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

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON פתח הבריחה {#json-escape-hatch}

כאשר Python העוזר עדיין לא זמין, למזון מודל נתונים קנוני
`InstructionBox` JSON ל `Instruction.from_json` או ישירות לתוך
`TransactionBuilder.add_instruction_json`. זהו הנתיב המומלץ
`Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, עמיתים/פעם/NFT
רישום, וריאונים לא מפיצים לא רשומים עד שהמשתמשים האלה
כתוב.

```python
from iroha_python import Instruction, TransactionBuilder

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

# Use TransactionBuilder when you need lower-level control than TransactionDraft.
builder = TransactionBuilder(CHAIN_ID, alice)
builder.set_metadata(TX_METADATA)
builder.add_instruction_json(instruction_box_json)
envelope = builder.sign(alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

עבור הוראות מובנות או לא ברורות, נסיעה חזרה דרך JSON לפני אחסון
ציוד:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## זרמי עבודה של עסקאות {#transaction-workflows}

שימוש `TransactionDraft` עבור יישומים שמבנים הוראות מרובות לפני
חתימה. הצעת חוק מאפשרת לך לשמור על הגדרות ברמת העסקה כגון `ttl_ms`,
`nonce`, ונתונים מטאטא במקום אחד, ואז תחתום פעם אחת:

```python
config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata={**TX_METADATA, "source": "python-docs"},
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition_numeric(
    ROSE_DEFINITION,
    owner=alice,
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_numeric(ROSE_ASSET, "100")
draft.transfer_asset_numeric(ROSE_ASSET, "25", destination=bob)

# Signing freezes the draft into an envelope ready for Torii.
envelope = draft.sign_with_keypair(alice_pair)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

להוצאת מסמך דטרמיניסטי לשיקון, בדיקה או העברת הארנק:

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

קישור אבטחת פרטיות של מסלול לפני חתימה כאשר מסלול היעד דורש זאת:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), None, bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_bytes=b"...verifying key bytes...",
)
envelope = draft.sign_with_keypair(alice_pair)
```

## שאלות {#queries}

עוזרי שאילת המבטא מסיימים כיתות נתונים במקום רוט JSON מילונים. הם
הם הדרך הקלה ביותר להתחיל כי SDK Parses pagination ושותף
שדות רשום עבורך:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

השתמשו באוזני בקשה גנריים כאשר Torii נקודת הסיום עדיין אין טופס
כפתור:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

עוזרים לרישום חשבונות דורשים מזהה חשבון SDK אני...
תשתמש בקנוניקה. I105 חשבון IDs או כינויים על שרשרת; אם חסידה
המחקור או נקודת הסיום החומרה חוזרת ID כי SDK דחפים, לפתור אותו ל
חשבון קנוני ID לפני שתקרא לעוזרים האלה:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## אירועים {#events}

עזרות זרימה לפענח JSON מטענים מועילים לפי ההגדרה. `with_metadata=True`
כאשר אתה צריך את SSE שם האירוע, תעודת זהות, נתיב ניסיון מחדש, וטען נוח רם. זרמים זוגיים
עם `EventCursor` כדי לשמור על ID האירוע האחרון. הדוגמאות האלה מחכות לחיים
אירועים, אז להפעיל אותם נגד קשר שבו זרם האירוע המתאים הוא
פעיל.

```python
from iroha_python import DataEventFilter, EventCursor

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

# Persist the latest SSE id so a reconnect can resume from the same point.
cursor = EventCursor()
for event in client.stream_events(
    filter=proof_filter,
    cursor=cursor,
    resume=True,
    with_metadata=True,
):
    print(event.id, event.event, event.data)
    break

for event in client.stream_trigger_events(trigger_id="hourly_reward", resume=True):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## מפתחות וכתובת {#keys-and-addresses}

ה- SDK חושף עוזרי חתימה מקומיים עבור כל אלגוריתם לחתום הוקמו
הם לא קוראים Taira, אבל הם דורשים
ההרחבה המקומית:

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

שימוש `supported_crypto_algorithms()` כדי לראות מה גלגל שלך תומך.
עוזרים גנטיים משתמשים בתוויות אלגוריתם קנוני ופועלים עבור Ed25519,
secp256k1, ML-DSA, GOST, BLS, ו SM2 כאשר האלגוריתמים הללו מתואמים ב:

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

### סינים SM קריפטוגרפיה {#chinese-sm-cryptography}

ה- Python SDK מגלה את שני הגנרלים SM2 עוזרים ו SM2-נוחות ספציפית
השתמשו בפרסומת יכולת הערך כדי לבחור את SM2 ההבדל
זיהוי צפוי ברשת היעד:

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

capabilities = client.get_node_capabilities_typed()
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

`crypto.sm.enabled` אומר לך אם הערך מקבל SM- אלגוריתמים משפחתיים
המודעת זו כוללת את SM מדיניות חישוב ומהיר
מצב, אשר שימושי בעת ההחלטה אם לאפשר SM2- זרמים ספציפיים:

```python
capabilities = client.get_node_capabilities_typed()

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

ציבורי Taira חשפו את SM פרסום יכולת במהלך הבדיקה, אבל SM חתימה
האלגוריתמים של החתימה המפורסמים שלה היו `ed25519`,
`secp256k1`, ו `bls_normal`, אז אל תתכנעו SM2-המעשים הנחתמים
הפעלת, אלא אם כן עומס השימוש בתאפשרות משתנה.

### GOST מפתחות פוסט-קואנטיים {#gost-and-post-quantum-keys}

השתמש בקריפטו גנרית API עבור GOST R 34.10-2012 קבוצות פרמטרים ו ML-DSA
(`ml-dsa`) חתימות פוסט קוואנטיות. אותו אובייקט זוג מפתחות מטפל בחתימה,
אימות, ויצוא רב-הכש:

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

שער GOST והפלילים לאחר הקוונטים על אלגוריתמים לחתימה המפרסמים של הערך.
השתמשו במשאב הפועל של היכולות החומריות עבור שמות אלגוריתם מתאימים לעתיד:

```python
capabilities = client.request_json(
    "GET",
    "/v1/node/capabilities",
    expected_status=(200,),
)
crypto = capabilities.get("crypto", {})
sm = crypto.get("sm", {})
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.get("allowed_signing", []))

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
supports_sm2 = "sm2" in allowed and bool(sm.get("enabled", False))

print(supports_gost, supports_post_quantum, supports_sm2)
```

אם הערך לא מפרסם את האלגוריתם שאתה צריך, להשתמש במפתח רק עבור מקומי
או זרמי עבודה מקוונים. אל תשלחו עסקאות חתומות עם האלגוריתם הזה
זה קשר. במהלך הציבור Taira צ'ק, GOST ו ML-DSA היו זמינים כ SDK
עוזרי קריפטו במעלה הזרם Python הספרייה, אך לא הועידה בהודעות
קשר לחתימה על עסקאות.

## יצירת לקוחות מודעים {#config-aware-client-creation}

שימוש `resolve_torii_client_config` כאשר היישום שלך קורא את הגדרות הערך
מתוך תיק, אך עדיין זקוק ל-overrides ספציפיים לסביבה או למבחן:

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

## הכנות של קגמושה {#kagemusha-readiness}

ה- Python SDK יכול לשאול את הזרם JSON מסלול הכנות דרך המוצר הגנטי שלו
Torii עוזר בקשה:

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

Python לא חושף בונה ארכיונים של קגמושה עם טופס או חידוש.
השתמשו בטייפ Swift או JVM ארנק לבניית הקאנוניקה V4 ארכיונים, אז
להגיש ולסקר אותם באמצעות Kagemusha תומך Torii לקוח.

## מחברות {#subscriptions}

עוזרי ההפקה משתנים שיחות שירות מורשת מהמשתמשים המשותפים. Torii
הלקוח המשמש על ידי `iroha_python.ToriiClient`. שימוש IDs וכספים הקיימים על
רשת שאתה מטרה.

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

# The provider signs plan creation.
client.create_subscription_plan(
    authority=alice,
    private_key=alice_pair.private_key_hex,
    plan_id="compute#wonderland",
    plan=usage_plan,
)

# The subscriber signs subscription creation.
client.create_subscription(
    authority=bob,
    private_key=bob_pair.private_key_hex,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
)

# Usage is recorded by the provider and then charged on demand.
client.record_subscription_usage(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
    unit_key="compute_ms",
    delta="3600000",
)
client.charge_subscription_now(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
)
```

## חיבור {#connect}

לבנות ולחקור קישור URIs, ולקרוא את מצב ה"Connect" הציבורי
Taira:

```python
from iroha_python.connect import ConnectUri, build_connect_uri, parse_connect_uri

# Connect URIs are what an app hands to a wallet to start a session.
uri = build_connect_uri(
    ConnectUri(
        sid="base64url-session-id",
        chain_id=CHAIN_ID,
        node="taira.sora.org",
    )
)
parsed = parse_connect_uri(uri)
# Status tells you whether the node currently exposes Connect.
status = client.get_connect_status_typed()

assert parsed.chain_id == CHAIN_ID
print(status.enabled, status.sessions_active)
```

קודקים של מסגרת, תוצרת מפתח הפגישה, ויצירת פגישה דורשים את האתגר
הרחבה והדרך של הפגישה "Connect":

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    decode_connect_frame,
    encode_connect_frame,
    generate_connect_keypair,
)

# The app keypair is separate from the account key used for transactions.
connect_pair = generate_connect_keypair()
info = client.create_connect_session_info(
    {"role": "app", "sid": connect_pair.public_key.hex()}
)
print(info.app_uri, info.wallet_token, info.expires_at)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bytes.fromhex("01" * 32),
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=connect_pair.public_key,
        chain_id=CHAIN_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and carries a reason code.
client.send_connect_control_frame(
    "base64url-session-id",
    ConnectControlClose(role="App", code=4100, reason="finished", retryable=False),
)
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

## ממשל, זמן הפעלה ושטח המנהל {#governance-runtime-and-admin-surfaces}

שיחות אלה רק לקרוא חזרו בהצלחה נגד הציבור Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces()
referendum = client.get_governance_referendum_typed("ref-1")
tally = client.get_governance_tally_typed("ref-1")
locks = client.get_governance_locks_typed("ref-1")
unlock_stats = client.get_governance_unlock_stats_typed()

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Runtime reads expose the active ABI and any pending upgrade records.
abi = client.get_runtime_abi_active_typed()
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed()
upgrades = client.list_runtime_upgrades_typed()
capabilities = client.get_node_capabilities_typed()

print(abi, abi_hash, runtime_metrics)
print(upgrades.total, capabilities.abi_version)
```

עוזרים לשדרוג זמן הפועלים מקבלים את הצורה של המניפסט המשמש על ידי עדכון זמן הפועל
API. הם פעולות של המפעיל, אז השתמש בהם רק נגד קשר שבו
חשבון וטוגנים מורשים:

```python
admin = create_torii_client(
    TORII_URL,
    auth_token="admin-token",
api_token="torii-token",
)

# Propose creates the upgrade instructions; activation/cancel are operator actions.
upgrade = admin.propose_runtime_upgrade(
    {
        "name": "Refresh runtime provenance",
        "description": "Schedules a no-ABI-change runtime rollout.",
        "abi_version": 1,
        "abi_hash": "00" * 32,
        "added_syscalls": [],
        "added_pointer_types": [],
        "start_height": 1_500_000,
        "end_height": 1_500_256,
    }
)
print(upgrade["tx_instructions"])

admin.activate_runtime_upgrade("deadbeef" * 4)
admin.cancel_runtime_upgrade("feedface" * 4)
```

## מצב, הסכמה וטלמטריה ברשת {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time endpoints expose consensus and clock diagnostics.
sumeragi = client.get_sumeragi_status_typed()
print(sumeragi.highest_qc.height, sumeragi.tx_queue.saturated)

time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)
```

## SoraFS, UAID, ו Kaigi עוזרים {#sorafs-uaid-and-kaigi-helpers}

עוזרים אלה זמינים כאשר הערך המטרה חושף את
Nexus/SORA נקודות קץ. להתייחס לרשימות ריקות כגובה תקנה: ציבורית Taira יולי
יש את הנתיב מופעל ללא נתונים למניפסט הדגימה, או UAID.

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

# Kaigi health summarizes relay availability when the route is enabled.
health = client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC ו GPU עוזרים {#norito-rpc-and-gpu-helpers}

שימוש `NoritoRpcClient` כאשר כבר יש לך Norito בייטים וצריכים להתקשר
בינארי Torii דוגמה דורשת מעטפה חתומה
תבנית עסקאות:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA עוזרים חוזרים `None` כאשר האחורי לא זמין, כך יישומים
ניתן לחזור למשימות סקאליות:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## כיסוי הנוכחי {#current-coverage}

ה- Python SDK כבר כולל עוזרים ל:

- Torii זרימות של הגשת, מצב, בקשה וניהול
- בונה הוראות טפוטים עבור משותפים ISI וארגזים ספציפיים לתחום
- סרטים של עסקאות, מוניסטים, חתימות ומעטפת עסקה חתומה
  זרימות עבודה
- אירועים זרימים, פילטרים וקרסורים שניתן להמשיך
- גישה קגמושה גנרית ו Torii עוזרים לחתום; מקובל
  הבניינים של תוספת וחיסכון אינם חשופים
- כתובת חשבון, עוזרים לחתימה של אלגוריתם כולו, נסיעות הלוך ושוב מרובות, SM2,
  GOST, ML-DSA, BLS, וניהול מפתח סודי
- חיבור URIs, פגישות, מסדרים, עוזרים לחסום ומנהל רישום
- ממשל, שיפור זמני הפעלה, Sumeragi, מנהל הערך, SoraFS, UAID, ו Kaigi
  כפות נקודות סוף שבהן העמוד חושף את המאפיינים הללו

## מקורות קדם {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

הקבצים האלה הם מקור האמת Python פני השטח במקביל
תיקון שטח עבודה.
