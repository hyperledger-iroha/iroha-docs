---
translation_locale: uz
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Yuqoridagi ish maydonida Python SDK `iroha-python` hisoblanadi. Birinchi Iroha 3 chiqarilishi joriy Torii va Norito yuzalarni aniqlaydi. Integratsiyangizda ishlatiladigan paket versiyasini yoki manbali qayta ko'rib chiqishni pin qiling, shunda SDK va nod bir xil simli formatdagi qayta ko'rishda qoladi.

Quyidagi faqat o'qish mumkin bo'lgan misollarni Taira raqami `https://taira.sora.org` da jamoatchilik bilan taqqoslashdi. Mutatsiya qiluvchi misollar tranzaksiya namunalari hisoblanadi: ular taqdim etilishidan oldin haqiqiy Taira hokimiyati, xususiy kalit, gaz metadotlar va maqsadli yo'nalishda talab etiladigan operator tokenlarini talab qiladi.

Misollarni quyidagi tartibda qoʻllang:

|Sahna |Jamoatga qarshi kurashish Taira?|Sizga nima kerak ?|
| --- | --- | --- |
|Faqat oʻqish uchun mijoz qoʻngʻiroqlari |Ha , shunday .|Python paket va tarmoqga kirish |
|Mahalliy imzolash va koʻrsatma quruvchilar |`submit()` gacha tarmoq qo'ng'iroqlari yo'q. |Asosiy kengaytma va sizning asosiy materialingiz |
|Transaksiyalarni mutatsiya qilish va xizmatga qoʻngʻiroq qilish |Faqat oʻzingizning mablagʻingiz bilan hisoblang .|Ma'muriyat hisobvarag'i, xususiy kalit, zanjir ID, to'lov metadati, to'lov aktivlari salmoni va yo'nalish tokenlari |
|Frame kodeklari, kripto va GPU yordamchilari bilan bog'laning |Faqat mahalliy |Asosiy kengaytma; GPU yordamchilari ham CUDA qobiliyatiga ega bo'lgan orqa tomoniga muhtoj |

## Oʻrnatish {#install}

To'plamning metadata nomi `iroha-python`. O'rnatilmagan PyPI o'rnatish jonli Taira tarmog'iga mos keladi deb taxmin qilmang. Integratsiya maqsadlaringiz boʻyicha oʻsha yuqori tomondan qayta koʻrib chiqilgan toʻgʻrilik yoki manba checkoutni oʻrnating:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Agar sizning loyihangiz dastlabki ish maydonini to'g'ridan-to'g'ri iste'mol qilsa, Python bog'liqligi va nativ kengaytmani yaratishdan oldin ishlaydigan misollardan foydalaning `Instruction`, `TransactionDraft`, imzolash, kripto, SoraFS mahalliy yordamchilar, GPU yordamchilar yoki Connect ramka kodeklari. Buyrug'dan foydalaning `python/iroha_python/README.md`, so'ngra mahalliy eksport yuklanganligini tekshirish:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Agar `create_torii_client` import qilinsa, lekin `Instruction` yoki `generate_ed25519_keypair` muvaffaqiyatsiz tugasa, sof Python paket mavjud bo'ladi, ammo mahalliy kengaytma yo'q.

## Tez ishga tushirish {#quickstart}

Umumiy, faqat o'qish uchun Taira oxirgi nuqtalardan boshlang:

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

## Qo'shma tizim {#shared-setup}

O'zgaruvchan namunalar uchun ushbu sozlamalardan foydalaning. Jo'natishdan oldin har bir joy egasini Taira vakolat, xususiy kalit, token va aktiv/hisob IDs bilan almashtiring.

`authority` - bu bitimni imzolaydigan hisob raqamidir. `private_key` ushbu hisob raqamiga mos bo'lishi kerak, `CHAIN_ID` maqsadli tarmoq bilan bog'liq bo'lishi lozim va `TX_METADATA` tarmoq tomonidan kutilayotgan to'lov maydonlarini o'z ichiga olishi kerak. Quyida keltirilgan joy egalari qasddan haqiqiy emas, shuning uchun ular tasodifan taqdim etilmagan.

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

`Instruction.*` faqat konstruksiya yo'l-yo'riq yuklarini chaqiradi. `submit()` - bu SDK tranzaksiyani imzolagan, Torii raqamiga yuboradigan va statusni kutadigan nuqta.

## To'lovlar va gaz {#fees-and-gas}

Transaksiyalarni yozish uchun to'lov metadatalari va mablag' bilan ta'minlangan to'lov aktivlarining balansini talab qiladi. Taira da to'lov varaqi ommaviy kran tomonidan moliyalashtiriladi va tranzaksiya metadatalarida `gas_asset_id` o'z ichiga olishi kerak. Minamoto da to'lovi haqiqiy XOR bilan to'lanadi va aktiv ID ushbu tarmoqning konfiguratsiyasidan kelib chiqadi.

To'lov metadatalari alohida ko'rsatmalarga emas, balki operatsiyaga tegishli. Yuqoridagi `submit()` yordamchisi o'zi tuzgan har bir bitimga `TX_METADATA` ni biriktirib qo'yadi:

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

Yozuvlarni jo'natishdan oldin, ma'muriyat hisob raqamiga to'g'ri to'lov aktivlari egaligiga ishonch hosil qiling ID tarmoqga oid; bu Taira shakli:

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

Favlat `asset_id` balans tekshiruvi uchun ishlatilishi kerak bo'lgan betonni qaytarib beradi. `gas_asset_id` metadata maydonida to'lov aktivlari ta'rifi ID qo'llaniladi.

Transaksiyani tuzishda xaritalarni birlashtirish orqali ilova metadatalarini to'lov metadatalaridan ajratib turing:

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

Agar siz to'lov metadatalarini qoldirsangiz, noto'g'ri to'lov aktividan foydalangan bo'lsangiz yoki mablag' bilan ta'minlanmagan hisobda imzolagan bo'lsangiz, haqiqiy tarmoq bu operatsiyani rad qilishi kerak, hatto ko'rsatma yuklari boshqacha tarzda amal qilsa ham.

## Taira - Tekshirilgan faqat o'qish uchun qo'ng'iroqlar {#taira-checked-read-only-calls}

Ushbu qo'ng'iroqlar jamoatchilikka Taira qarshi muvaffaqiyatli qaytarildi:

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

`/v1/status`, ommaviy tengdoshlar inventariyasi, Sumeragi RBC namuna olish, nod admin o'chirgichlari va Connect ilova ro'yxatini boshqarish kabi yo'nalishlar tekshiruv davomida Taira orqali jamoatchilik uchun mavjud emas edi. `request_json("GET", "/status")`-dan Taira-da ommaviy node holati yuklanishi uchun foydalaning.

## Qurilish yoʻl-yoʻriqlari {#instruction-builders}

SDK eng keng tarqalgan ko'rsatma oilalari uchun o'rnatilgan quruvchilarni va hali birinchi darajadagi Python usullar bo'lmagan variantlar uchun JSON qochish qutisini ochib beradi. Quyidagi kesimlar mutatsiya qiluvchi muomala namunalari va imzolash hisobidan tashqari jamoatchilikka Taira taqdim etilmagan.

Yozilgan yordamchilar mavjud bo'lganda afzalroq: ular Python qiymatlarini normallashtiradi va haqiqiy bo'lmagan shakllarda erta muvaffaqiyatsizlikka uchraydi. `Instruction.from_json` ni faqat Python yordamchisi bo'lmagan ko'rsatma variantiga muhtoj bo'lganingizda foydalaning.

|Ta'lim oilasi |Python yuzasi |
| --- | --- |
|Ro ' yxatga olish | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap asbob-uskunalari uchun ajratilgan |
|Roʻyxatdan oʻtish |`unregister_trigger`; boshqa variantlar uchun `Instruction.from_json` ni ishlatish |
|Mint/Burn |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Oʻtkazish | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Metadotlar va nazoratlar |`set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA hayot davri | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Repo/tashkilotning kengaytirilishi |`repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Asosiy aktivni qulflash |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock` va mijozning `*_and_wait` yordamchilari |
|Grant/Revoque, SetParameter, Log, Custom, Upgrade va kamroq keng tarqalgan ro'yxatga olish / ro'yxatdan o'tish variantlari |`Instruction.from_json` yoki `TransactionBuilder.add_instruction_json` bilan kanonik `InstructionBox` JSON |

Garov usulidagi shartli to'lovlar uchun [Native Asset Escrow](/uz/blockchain/escrow.md#python-asset-locks)-ni ko'ring. Python hozirda umumiy aktivlarni qulflash uchun birinchi darajali yordamchilarni kashf etadi; bozor va anonim garov yordamchilari hali birinchi darajadagi Python usullari emas.

### Domenlarni o'rnatish, keyin hisob va aktivlarni ro'yxatdan o'tkazish {#set-up-domains-then-register-accounts-and-assets}

Oddiy domen yaratish SNS ijara shartnomasi, egalik qilish qobiliyatlari, taklif himoyachisi va domen holati birgalikda tekshirilishi uchun deklarativ alias rejalashtiruvchidan o'tadi. SDK yoki onboarding xizmati bilan sirsiz `AliasSetupPlanRequestV1` niyatini yarating, so'ngra `iroha app alias setup plan` va `iroha app alias setup apply`dan foydalaning. `Instruction.register_domain` so'rov tranzaksiyasidan taqdim etilmaydi; bu quruvchi genesis/bootstrap asboblari uchun qoladi.

Domenni o'rnatish rejasi amalga oshgandan so'ng, domen egalikidagi ob'ektlarni ro'yxatdan o'tkazing. Taira kabi umumiy tarmoqda sizga berilgan domen va hisob nomlar maydonidan foydalaning.

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

`mintable` qabul qiladi `Infinitely`, `Once`, `Not`, yoki `Limited(n)` ma'lumotlar modeli tomonidan qabul qilingan qiymatlar. `scale` cheklanmagan raqamli aktiv uchun.

### Minta, yonish va o'tkazish aktivlari {#mint-burn-and-transfer-assets}

Ushbu qo'ng'iroqlar mavjud aktivdan ID foydalanadi. Avval aktivning ta'rifini ro'yxatga oling, so'ngra aniq aktivni ID aktiv egasi hisobvarag'iga yarating.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Oʻtkazilgan mulkdorlik {#transfer-ownership}

O'z mulkdorligini o'tkazishni o'zgartirish kim domeni nazorat qiladi, aktivni belgilash yoki NFT. Amalga oshirish uchun amaldagi mulkdordan foydalaning.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Metadatalarni oʻrnatish va olib tashlash {#set-and-remove-metadata}

Metadata qiymatlari JSON-serializatsiya qilinishi kerak. Agar siz `TransactionDraft` dan foydalanayotgan bo'lsangiz, `TransactionConfig`dagi vakolat andoza maqsadli hisob raqamiga aylanadi.

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

Yuqori darajadagi yordamchi loyihasi ko'rsatkich bo'yicha tranzaksiya organini aniqlaydi:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Haqiqiy dunyodagi aktivlar {#real-world-assets}

RWA yordamchilari aktivga mos metadotlar, kelib chiqishi va nazoratchi siyosati uchun JSON-serializatsiya qilinadigan foydali yuklardan foydalanadilar. `register_rwa` `id` yoki `owner` ni qabul qilmaydi: ish vaqti `RwaId` ni hosil qiladi va bitim hokimiyati boshlang'ich ega bo'ladi.

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

Ro'yxatdan o'tkazuvchi tranzaksiya majburiyatlarini bajargandan so'ng, `FindRwas`, `/v1/rwas`, RWA hodisasi yoki hosil qilingan ID ni kashf etish uchun belgilangan qidiruvchi yo'lini ishlating:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Keyingi operatsiyalarda hosil bo'lgan `hash$domain` ID:

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

To'liq transferlar mavjud lotda `owned_by` o'zgarishi mumkin. Qarshi transferlar va qo'shilishlar hosil bo'lgan bola lotlari yaratadi.

### Ishtirokchilar {#triggers}

Ishlab chiqarilishi mumkin boʻlgan dastur boshqa koʻrsatmalarning ketma-ketligi boʻlganda trigger roʻyxatdan oʻtkazish yordamchilaridan foydalaning:

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

Torii shuningdek, trigger inventari uchun REST yordamchilarini aniqlaydi:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Trigger inventoriya qo'ng'iroqlari faqat o'qib yoki tekshirib turadi. Ro'yxatga olish, bajarish, takrorlash o'zgarishlari va ro'yxatdan chiqarmaslik mutatsiya qiluvchi operatsiyalardir.

### Repo va to'lov yo'l-yo'riqlari {#repo-and-settlement-instructions}

Repo va ikki tomonlama qaror qabul qilish yordamchilari Norito qo'ldan-qo'yilgan yuklarsiz domenga mos ko'rsatmalar variantlarini qo'shadilar:

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

### JSON Qutish qutisi {#json-escape-hatch}

Agar a Python yordamchi hali mavjud emas, kanonik ma'lumotlar modelini o'tkazish `InstructionBox` JSON oʻz ichiga `Instruction.from_json` yoki to'g'ridan-to'g'ri `TransactionBuilder.add_instruction_json`. Bu tavsiya etilgan yo'l `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, tengdosh/ro'l NFT ro'yxatdan o'tish va trigger bo'lmagan variantlarni ro'yxatga olishdan to'xtatish, bu yordamchilarga yozilmaguncha.

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

Yaratilgan yoki shaffof bo'lmagan yo'l-yo'riqlarni saqlashdan oldin JSON orqali qaytarib ketish:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Transaksiya ish oqimlari {#transaction-workflows}

Imzolashdan oldin bir nechta ko'rsatmalarni yaratadigan dasturlar uchun `TransactionDraft` dan foydalaning. Loyiha sizga `ttl_ms`, `nonce` va metadata kabi tranzaksiya darajasidagi moslamalarni bitta joyda saqlashga imkon beradi, so'ngra bir marta imzolaning:

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

Tekshiruv, audit yoki hamyon uzatish uchun deterministik manifestni eksport qilish:

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

Yo'nalish yo'nalishi uni talab qilganda imzolashdan oldin yo'nalishning maxfiyligini tasdiqlovchi hujjatni qo'shing:

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

## Savollar {#queries}

Tiplangan so'rov yordamchilari xom JSON lug'atlari o'rniga ma'lumotlar sinflarini qaytarib beradi. Ular boshlashning eng oson usulidir, chunki SDK sahifalash va umumiy yozuv maydonlarini tahlil qiladi:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii oxirgi nuqtada hali qadoqlama yozilmagan bo'lsa, umumiy so'rov yordamchilaridan foydalaning:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Hisobot inventariyasi yordamchilari tomonidan qabul qilingan hisob identifikatorini olishlari kerak SDK normallashtiruvchi. Kanonikadan foydalaning I105 hisob IDs yoki zanjirda bo'lgan aliaslar; agar blok qidiruvchisi yoki xom oxirgi nuqta ID ko'rsatilgan SDK rad etadi, uni kanonik hisobga kiritadi. ID Ular yordamchilarni chaqirishdan oldin:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## O'zgarishlar {#events}

Streaming yordamchilari JSON fayl yuklarini andoza ravishda dekodlashadi. SSE hodisa nomi, id, qayta urinib ko'rish va xom fayl yukini kerak bo'lganda `with_metadata=True` ni o'tkazib yuboring. So'nggi voqea identifikatorini saqlab qolish uchun `EventCursor` bilan to'plangan oqimlarni qo'shing. Ushbu misollar jonli hodisalarni kutadi, shuning uchun ularni tegishli hodisa oqimi faollashtirilgan va faol bo'lgan nodga qarshi yuriting.

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

## Shrift va manzillar {#keys-and-addresses}

SDK mahalliy imzolash yordamchilarini mahalliy kengaytmaga qo'shilgan har bir imzo algoritmi uchun ochib beradi. Ushbu yordamchilar Taira ni chaqirmaydilar, lekin ular asl kengaytmani talab qiladilar:

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

`supported_crypto_algorithms()` dan foydalanib, velosipedingiz nimalarni qo'llab-quvvatlayotganini ko'ring. Umumiy yordamchilar kanonik algoritm etiketlaridan foydalanishadi va ushbu algoritmlar quyidagilarga moslashganda Ed25519, secp256k1, ML-DSA, GOST, BLS va SM2 uchun ishlaydi:

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

### Xitoycha SM kriptografiya {#chinese-sm-cryptography}

O ' zbekiston Respublikasining Python SDK ikkalasi ham umumiy bo'ladi SM2 yordamchilar va SM2-ma'lum qulaylik yordamchilari. SM2 maqsadli tarmoq tomonidan kutilayotgan farqlovchi identifikator:

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

`crypto.sm.enabled` sizga nod o'z joriy siyosatida SM oilali algoritmlarni qabul qilyaptimi yoki yo'qmi xabar beradi. Xuddi shu reklamaga SM hash siyosati va tezlashtirish holati kiradi, bu SM2-mahsus oqimlarni qo'llab-quvvatlashni hal qilishda foydali bo'ladi:

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

Jamoat Taira tekshiruv davomida SM qobiliyati e'lonini namoyish etdi, ammo u erda SM imzolanishini o'chirib tashladi. Uning reklama qilingan imzo algoritmlari `ed25519`, `secp256k1` va `bls_normal` edi. Shunday qilib, SM2 bilan imzolangan tranzaksiyalarni ushbu joylashtirishga o'zgartirmagan holda taqdim etmanglar.

### GOST va kvantdan keyingi kalitlar {#gost-and-post-quantum-keys}

GOST R 34.10-2012 parametrlar to'plamlari va ML-DSA (`ml-dsa`) kvantdan keyingi imzolar uchun umumiy kripto API dan foydalaning. Oʻz navbatida . Shunga o'xshash kalit juftligi ob'ekti imzolash, tasdiqlash va ko'p hashli eksportni boshqaradi:

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

Gate GOST va kvantdan keyingi oqimlar nodning reklama qilingan imzolash algoritmlarida. Oldinga mos keladigan algoritm nomlari uchun xom imkoniyatlardan foydalaning:

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

Agar nod sizga kerakli algoritmni reklama qilmasa, kalitdan faqat mahalliy yoki oflayn ish oqimlari uchun foydalaning. Ushbu algoritm bilan imzolangan tranzaksiyalarni ushbu nodga yubormang. Umumiy Taira tekshiruvi davomida GOST va ML-DSA SDK kriptografiya yordamchilari sifatida yuqori tomondagi Python kutubxonasida mavjud edi, ammo ular tranzaksiya imzolash uchun nod tomonidan e'lon qilinmagan.

## Xizmatchilarni yaratishga ishonch hosil qiling {#config-aware-client-creation}

`resolve_torii_client_config` dasturingiz fayldan nod sozlamalarini o'qigan bo'lsa, ammo hali ham muhit yoki sinovga oid ustunlarga muhtoj bo'lganda ishlatilsin:

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

## Kagemusha tayyorgarligi {#kagemusha-readiness}

Python SDK o'zining umumiy Torii so'rov yordamchisi orqali joriy JSON tayyorgarlik yo'nalishini so'rash mumkin:

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

Python tegmalashtirilgan Kagemusha top-up yoki redemption arxiv quruvchilarini oshkor qilmaydi. Kanonik V4 arxivlarini qurish uchun Swift yoki JVM tugmachasidan foydalaning, so'ngra ularni qo'llab-quvvatlanadigan Kagemusha Torii mijozi orqali taqdim eting va so'rov qiling.

## Abonnementlar {#subscriptions}

Abonnement yordamchilari oʻzaro aloqadan meros qilib olingan xizmat qoʻngʻiroqlarini mutatsiya qilishadi . Torii foydalanuvchi tomonidan `iroha_python.ToriiClient`. Foydalanish IDs va maqsadingiz bo'lgan tarmoqda mavjud bo'lgan aktivlar.

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

## Ulanish {#connect}

Connect URIs ni yarating va tahlil qiling, Taira tomonidan ochiqlashtirilgan ommaviy Connect statusini o'qing:

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

Ramka kodeklari, sessiya kalitini olish va sessiya yaratish natijali kengaytmani va Connect sessiya yo'nalishini o'z ichiga oladi:

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

Ruxsatdan keyingi xabarlarni holatli seans bilan kodlash:

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

## Boshqaruv, ishlaydigan vaqt va admin yuzalari {#governance-runtime-and-admin-surfaces}

Ushbu faqat o'qiladigan qo'ng'iroqlar Taira jamoatchilikka qarshi muvaffaqiyatli qaytarildi:

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

Ish vaqti yangilanishi yordamchilari ish vaqti yangilanishida ishlatiladigan manifest shaklini qabul qiladi API. Ular operator harakatlari, shuning uchun ularni faqat hisobingiz va tokeningiz ruxsat etilgan nodga qarshi ishlating:

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

## Status, konsensus va tarmoq telemetriyasi {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID va Kaigi yordamchilar {#sorafs-uaid-and-kaigi-helpers}

Ushbu yordamchilar maqsadli nod tegishli Nexus/SORA oxirgi nuqtalarini ochib berganda mavjud. Bo'sh ro'yxatlarni to'g'ri javob sifatida ko'rib chiqish: ommaviy Taira yo'nalishi namuna manifesti yoki UAID uchun ma'lumotlarsiz qo'llanilishi mumkin.

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

## Norito RPC va GPU yordamchilar {#norito-rpc-and-gpu-helpers}

Norito baytlarga ega bo'lganingizda va ikkilamchi Torii oxirgi nuqtani chaqirishingiz kerak bo'lganda `NoritoRpcClient` dan foydalaning. Misol uchun oldingi tranzaksiya namunasidan imzolangan zarba kerak:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA yordamchilari `None` ni qaytarib berish kerak bo'lganda, orqa tomoni mavjud emas, shuning uchun dasturlar skalar implementatsiyalarga qaytishi mumkin:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Joriy qamrov {#current-coverage}

Python SDK allaqachon quyidagilar uchun yordamchilarni o'z ichiga oladi:

- Torii taqdimot, holat, so'rov va boshqaruv oqimlari
- umumiy ISI va domenga oid kengaytmalar uchun bosma ko'rsatkichlar ishlab chiqaruvchilar
- Transaksiya loyihalari, manifestlari, imzolash va imzolangan tranzaksiya zarfining ish oqimlari
- O'tkazilishi mumkin bo'lgan hodisalar, filtrlar va kursorlar
- umumiy Kagemusha tayyorligi kirish va Torii obuna yordamchilari; to'ldirish va to'lov qurilmalarini yozish bilan ta'minlanuvchi qurilmalar ochiq emas
- hisob manzili, barcha algoritmlarni imzolash yordamchilari, SM2, GOST, ML-DSA va BLS ko'p hashli qaytarib olishlar va maxfiy kalitlarni boshqarish
- URIs, seanslar, ramkalar, shifrlash yordamchilari va ro'yxat boshqaruvchisi bilan bog'lanish
- boshqaruv, ishga tushirish vaqti yangilanishi, Sumeragi, nod-admin, SoraFS, UAID va Kaigi oxirgi nuqtani o'z ichiga olgan qoplamalar, bunda nod ushbu xususiyatlarni ochib beradi

## Yuqori yo'nalishdagi ma'lumot {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Ushbu fayllar o'rnatilgan ish maydonini qayta ko'rib chiqishdagi Python yuzasi uchun haqiqat manbai hisoblanadi.
