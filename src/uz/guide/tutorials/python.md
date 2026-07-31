---
translation_locale: uz
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

O ' zbekiston Respublikasi Python SDK yuqori tomondagi ish joyida `iroha-python`. Birinchi Iroha 3
tashlash maqsadlari joriy Torii va Norito Yuzlar.
yoki integratsiyangizda ishlatilgan manbalarni qayta koʻrib chiqish SDK va nodlar davom etadi
bir xil simli formatdagi qayta ko'rib chiqish.

Quyidagi faqat o'qishga mo'ljallangan misollarni jamoatchilik bilan taqqoslash Taira bilan
`https://taira.sora.org`. Mutatsiya qilish misollari - muomala namunalari: ular
real talab Taira vakolat, xususiy kalit, gaz metadatalari va har qanday operator
maqsadli yo'nalish tomonidan talab etiladigan tokenlar ular taqdim etilishdan oldin.

Misollarni quyidagi tartibda qoʻllash:

| Sahna | Jamoatga qarshi kurashish Taira? | Sizga nima kerak |
| --- | --- | --- |
| Faqat oʻqish uchun mijoz qoʻngʻiroqlari | Ha , shunday . | Python paket va tarmoqga kirish |
| Mahalliy imzolash va ko'rsatma ishlab chiqaruvchilari | To ' g'ri , to ' g ' ridan oldin hech qanday aloqa `submit()` | Asosiy kengaytma va sizning asosiy materialingiz |
| Transaksiyalarni mutatsiya qilish va xizmatga qo'ng'iroq qilish | Faqat oʻzingizning mablagʻingiz bilan | Ma'muriyat hisobvarag'i, xususiy kalit, zanjir ID, To'lov metadatalari, to'lov aktivlari salmoni va yo'nalish tokenlari |
| Frame kodeklarini, kripto va GPU yordamchilar | Faqat mahalliy | Asosiy kengaytma; GPU yordamchilar ham CUDA- qobiliyatli orqa tomoni |

## Oʻrnatish {#install}

Toʻplam metadata nomi: `iroha-python`. O'zingizga o'rinli bo ' lmang . PyPI
oʻrnatish jonli bilan mos keladi Taira tarmog'ini o'rnating.
sizning integratsiya maqsadlaringizning oʻxshash ilgʻor qayta koʻrib chiqilishiga asoslangan:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Agar sizning loyihangiz dastlabki ish joyini to'g'ridan-to'g'ri iste'mol qilsa, Python
o'rnatish va nativ kengaytmani yaratishdan oldin foydalanadigan misollarni ishga tushirish
`Instruction`, `TransactionDraft`, imzolash, kripto, SoraFS mahalliy yordamchilar, GPU
yordamchilar yoki Connect ramka kodeklari. Buyrug'dan foydalaning
`python/iroha_python/README.md`, so'ngra mahalliy eksport yuklanganligini tekshirish:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Agar `create_torii_client` import qilish `Instruction` yoki
`generate_ed25519_keypair` To'g'ri yo'q Python paket mavjud, ammo
nativ kengaytmasi emas.

## Tez ishga tushirish {#quickstart}

O'qish uchun faqat ommaviy bo'lgan dasturdan boshlash Taira yakuniy nuqtalar:

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

O'zgaruvchan namunalar uchun ushbu moslamadan foydalaning.
Taira vakolat, xususiy kalit, token va aktiv/hisob IDs joylashtirganingizdan
taqdim etishdan oldin.

`authority` bitimni imzolaydigan hisob raqamidir. `private_key` moslashishi kerak
ushbu hisob raqami, `CHAIN_ID` maqsadli tarmoqga mos kelishi kerak va `TX_METADATA` to'g'ri
tarmoq tomonidan kutilayotgan to'lov maydonlarini o'z ichiga oladi.
qasddan haqiqiy emas, shuning uchun ular tasodifan taqdim etilmaydi.

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

`Instruction.*` qo'ng'iroqlar faqat qurilish yo'l-yo'riq yuklamalari. `submit()` bu
quyidagi nuqtada: SDK tranzaksiyani imzolaydi, uni Torii, va bir
holati.

## To'lovlar va gaz {#fees-and-gas}

Transaksiyalarni yozish uchun to'lov metadatalari va mablag' bilan ta'minlangan to'lov aktivlarining balansini talab qilish kerak. Taira,
to'lov aktivlari davlat faucet tomonidan moliyalashtiriladi va bitim metadatalari
kiritiladi `gas_asset_id`. O ' z ichiga Minamoto, to'lovlar real pul bilan to'lanadi XOR va aktiv
ID u tarmoqning konfiguratsiyasidan kelib chiqadi.

To'lov meta ma'lumotlari har qanday topshiriqlarga emas, balki amalga tegishli.
`submit()` qoʻriqchi `TX_METADATA` amalga oshiradigan har bir bitim uchun:

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

Yozuvlarni yuborishdan oldin, soliq to'lovining yetarli miqdorida hisob raqamiga ega ekanligiga ishonch hosil qiling
To'g'ri kran va aktiv. ID tarmoqga xos bo'lgan; Taira
shakli:

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

Faxt betonni qaytaradi . `asset_id` balansni tekshirish uchun foydalanish.
`gas_asset_id` Metadata maydoni to'lov aktivlari ta'rifini ishlatadi ID.

Mappinglarni birlashtirib, ariza metadatalarini to'lov metadatalaridan ajratib turish
bitim tuzganda:

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

Agar siz to'lov metadatalarini qoldirsangiz, noto'g'ri to'lov aktividan foydalaning yoki mablag' bilan ta'minlanmagan
hisobda, haqiqiy tarmog'i tranzaksiya rad qilish kerak bo'lsa ham, agar yo'l-yo'riq
boshqa holatlarda foydali yuklar to'g'ri keladi.

## Taira- Tekshirilgan faqat o'qish uchun qo'ng'iroqlar {#taira-checked-read-only-calls}

Ushbu qoʻngʻiroqlar jamoatchilikka qarshi muvaffaqiyatli qaytdi Taira:

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

Misol uchun `/v1/status`, umumiy tengdoshlar inventariyasi, Sumeragi RBC namuna olish, nod
admin oʻchirgichlari va Connect ilovalar reyestrini boshqarish ommaviy emas edi
O ' zbekiston Respublikasi Taira tekshiruvi davomida. `request_json("GET", "/status")` uchun
davlat nodasi statusini yuklash Taira.

## Qurilish yoʻl-yoʻriqlari {#instruction-builders}

O ' zbekiston Respublikasi SDK eng keng tarqalgan ta'lim oilalari uchun tiplangan quruvchilarni ochib beradi va
JSON birinchi sinf bo'lmagan variantlar uchun qochish qutisi Python usullari hali.
Quyidagi parchalar muomala namunalarini oʻzgartirib yuboradi .
jamoatchilikka taqdim etilgan Taira imzo hisobidan mahrum bo'lgan.

Ular mavjud boʻlganda tiplangan yordamchilarni afzal koʻrishadi: ular normallashtiradilar Python qiymati va muvaffaqiyatsizlik
Toʻgʻri boʻlmagan shakllardan foydalanish `Instruction.from_json` faqat sizga kerak bo ' lgan
ko'rsatma variantida Python yordamchi hali.

| Ta'lim oilasi | Python yuzasi |
| --- | --- |
| Ro'yxatga olish | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap asbob-uskunalari uchun ajratilgan |
| Ro'yxatdan chiqarish | `unregister_trigger`; foydalanish `Instruction.from_json` boshqa variantlar uchun |
| Minta/burn | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
| Oʻtkazish | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
| Metadotlar va nazoratlar | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA hayot davri | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger | `execute_trigger` |
| Repo/tashkilotning kengaytirilishi | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
| Asosiy aktivni qulflash | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, qoʻshimcha mijoz `*_and_wait` yordamchilar |
| Grant/Revoq, SetParameter, Ro'yxatdan o'tish, moslash, yangilash va kamroq keng tarqalgan ro'yxatga olish/ro'yxatdan chiqarish variantlari | `Instruction.from_json` yoki `TransactionBuilder.add_instruction_json` kanonik bilan `InstructionBox` JSON |

Garov usulidagi shartli to'lovlar uchun ko'rish
[Asosiy aktivlar eskorovi](/uz/blockchain/escrow.md#python-asset-locks). Python
hozirda umumiy aktivlar qulflari uchun birinchi darajali yordamchilarni; bozor va
Anonim depozit yordamchilari birinchi darajali emaslar Python usullari hali.

### Domenlarni o'rnating, keyin hisob va aktivlarni ro'yxatga oling {#set-up-domains-then-register-accounts-and-assets}

Oddiy domen yaratish deklarativ alias rejalashtiruvchi orqali o'tadi SNS
ijara shartnomasi, egalik qilish qobiliyatlari, narxlarni himoya qilish va domen holati birgalikda tekshiriladi.
Sirsiz yaratish `AliasSetupPlanRequestV1` maqsadingiz bilan SDK yoki
ulanish xizmati, so'ngra foydalanish `iroha app alias setup plan` va
`iroha app alias setup apply`. Taqdim qilmang `Instruction.register_domain`
ilova tranzaksiyasidan; bu quruvchi genesis/bootstrap uchun qoladi
asbob-uskunalar.

Domenni o'rnatish rejasi amalga oshgandan so'ng, domen egalikidagi ob'ektlarni ro'yxatga oling.
tarmoqlari, masalan: Taira, sizga berilgan domen va hisob nom maydonidan foydalaning.

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

`mintable` qabul qiladi `Infinitely`, `Once`, `Not`, yoki `Limited(n)` qabul qilingan qiymatlar
ma'lumotlar modeli bilan. `scale` cheklanmagan raqamli aktiv uchun.

### O'yin-kulgi, yoqish va o'tkazish aktivlari {#mint-burn-and-transfer-assets}

Ushbu qoʻngʻiroqlar mavjud aktivdan foydalanadi ID. Avval aktivni belgilash, so'ngra
beton aktivni qurish ID aktivga ega bo'lgan hisob raqami uchun.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Oʻtkazish egaligi {#transfer-ownership}

O'z mulkdorligini o'tkazish domeniyani kim boshqarishini, aktivni belgilashni yoki NFT.
Amalga oshiruvchi shaxsni amaldagi mulkdor sifatida ishlating.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Metadatalarni oʻrnatish va olib tashlash {#set-and-remove-metadata}

Metadata qiymatlari quyidagicha bo'lishi kerak: JSON- seriyalash mumkin. `TransactionDraft`, ko'rsatilgan
davlat `TransactionConfig` andoza maqsadli hisob raqamiga aylanadi.

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

Yuqori darajadagi yordamchi loyihasi ko'rsatkichsiz tranzaksiya organini maqsad qiladi:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Haqiqiy dunyodagi aktivlar {#real-world-assets}

RWA yordamchilar foydalanish JSON- aktivga oid metadatalar uchun seriallashtiriladigan foydali yuklamalar,
kelib chiqishi va nazoratchi siyosati. `register_rwa` qabul qilmaydi `id` yoki
`owner`: ishga tushirish vaqti `RwaId`, va bitimlar organi
dastlabki egasi bo'ladi.

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

Ro'yxatdan o'tish tranzaksiyasining majburiyatlaridan so'ng, foydalanish `FindRwas`, `/v1/rwas`, bir RWA
o'tkaziladigan voqea yoki ishlab chiqilgan ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Keyingi operatsiyalarda ishlab chiqarilgan `hash$domain` ID:

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

Toʻliq oʻtkazib berish oʻzgarishi mumkin `owned_by` mavjud partiyada qisman o'tkazib berish va
Birlashish natijasida tug'ilgan bolalar ko'payadi.

### Ishtirokchilar {#triggers}

Ishlab chiqarishning boshqa koʻrsatmasi boʻlganda trigger roʻyxatga olish yordamchilaridan foydalaning
ketma-ketligi:

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

Torii shuningdek , REST Ishtirokchilarni hisobga olish yordamchilari:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Trigger inventar qo'ng'iroqlari faqat o'qish yoki tekshirish trigger rekordlar.
ijro etish, takrorlash o'zgarishlari va ro'yxatdan chiqarish mutatsiya qiluvchi operatsiyalardir.

### Repo va porabuzish yo'l-yo'riqlari {#repo-and-settlement-instructions}

Repo va ikki tomonlama qaror qabul qilish yordamchilari domenga oid yoʻl-yoʻriqlarni qoʻshadilar
qo'lda ishlab chiqarilmaydigan variantlar Norito foydali yuklar:

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

### JSON Qutish xonasi {#json-escape-hatch}

A Python yordamchi hali mavjud emas, kanonik ma'lumotlar modeli
`InstructionBox` JSON bilan `Instruction.from_json` yoki to'g'ridan-to'g'ri
`TransactionBuilder.add_instruction_json`. Bu tavsiya etilgan yoʻl
`Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, tengdosh/roll NFT
ro'yxatdan o'tish va qo'llab-quvvatlovchilarni ro'yxatga olmaydigan variantlar
bosilgan.

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

Ishlab chiqarilgan yoki shaffof bo'lmagan yo'l-yo'riq uchun JSON saqlashdan oldin
qurilmalar:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Transaksiya ish oqimlari {#transaction-workflows}

Foydalanish `TransactionDraft` avval ko'p ta'limotlarni yaratadigan dasturlar uchun
imzolash. Loyiha sizga tranzaksiya darajasidagi sozlamalarni saqlash imkonini beradi: `ttl_ms`,
`nonce`, va metadatalarni bir joyda, so'ngra bir marta imzolash:

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

Tekshiruv, audit yoki hamyon berish uchun deterministik manifestni eksport qilish:

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

Yo'nalish yo'nalishi uni talab qilganda imzolashdan oldin yo'nalishdagi maxfiylik hujjati qo'shilsin:

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

Qidirilgan soʻrov yordamchilari xom emas , balki maʼlumotlar sinflarini qaytaradi JSON so'zlar. Ular
boshlashning eng oson yo'li, chunki SDK Parses sahifalash va umumiy
siz uchun yozuv maydonlari:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

O ' zbekiston Respublikasining Torii tug'ich nuqta hali yozilmagan
qadoqlash:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Hisobvaraqlarga yordam beruvchilar hisob qaydnomasi identifikatorini SDK- Bu
normalizator. Kanonikadan foydalanish I105 hisob IDs yoki zanjirdagi aliaslar; agar blok
explorer yoki xom oxirgi nuqta ID deb SDK rad etadi, uni a
kanonik hisob ID Va yordamchilarni chaqirishdan oldin:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Tadbirlar {#events}

Streaming yordamchilari kodlash JSON andoza yordamchi yuklar. `with_metadata=True`
kerak bo'lganda SSE Tadbir nomi, ID, qayta urinish va xom yuk.
bilan `EventCursor` soʻnggi hodisa identifikatorini saqlab qolish uchun.
hodisalar, shuning uchun ularni tegishli hodisa oqimi bo'lgan nodga qarshi o'tkazing
qo'llanilgan va faol.

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

## O'lchovlar va manzillar {#keys-and-addresses}

O ' zbekiston Respublikasi SDK har bir imzo algoritmi uchun mahalliy imzo yordamchilarini ochib beradi
Bu yordamchilar chaqirishmaydi Taira, lekin ular talab
mahalliy kengaytma:

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

Foydalanish `supported_crypto_algorithms()` Sizning g'ildirakingiz nimaga tayanayotganini ko'rish uchun.
generik yordamchilar kanonik algoritm etiketlaridan foydalanadilar va Ed25519 uchun ishlaydilar.
secp256k1, ML-DSA, GOST, BLS, va SM2 agar ushbu algoritmlar quyidagilarda to'plansa:

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

### Xitoy SM Kriptografiya {#chinese-sm-cryptography}

O ' zbekiston Respublikasi Python SDK ikkalasi ham umumiy SM2 yordamchilar va SM2-o'ziga xos qulaylik
yordamchilar. SM2 farqlash
maqsadli tarmoq tomonidan kutilayotgan identifikator:

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

`crypto.sm.enabled` nodning qabul qilishini bildiradi SM- oilaviy algoritmlar
joriy siyosati. Xuddi shu reklama SM hash siyosati va tezlashtirish
maqomi, bu imkoniyatni qo'llash yoki yo'qligini hal qilishda foydali SM2-o'ziga xos oqimlar:

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

Umumiy Taira ko'rsatilgan SM tekshirish paytida imkoniyatlarni e'lon qilish, lekin SM imzolash
Uning reklama qilingan imzo algoritmlari `ed25519`,
`secp256k1`, va `bls_normal`, Bas, itoat etmanglar. SM2- imzolangan bitimlar
ishga tushirish, agar qobiliyat yuklanishi o'zgarmasa.

### GOST va kvantdan keyingi kalitlar {#gost-and-post-quantum-keys}

Umumiy kriptodan foydalaning API uchun GOST R 34.10-2012 parametrlar to'plami va ML-DSA
(`ml-dsa`) kvantdan keyingi imzolar. Xuddi shu kalit juftligi ob'ekti imzolarni ushlaydi,
tekshiruvi va ko'p hashli eksport:

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

Eshik GOST va nodning reklama qilingan imzolash algoritmlarida kvantdan keyingi oqimlar.
Oldinga mos algoritm nomlari uchun xom imkoniyatning foydali yukini ishlatish:

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

Agar nod sizga kerakli algoritmni reklama qilmasa, kalitdan faqat mahalliy uchun foydalaning
Ushbu algoritm bilan imzolangan tranzaksiyalarni
bu nod. Umumiy davrda Taira chek, GOST va ML-DSA mavjud bo'lgan SDK
yuqori tomondagi kripto yordamchilar Python kutubxona, lekin ular tomonidan e'lon qilinmagan
Transaksiya imzolash uchun nod.

## Xizmatchilarni yaratish {#config-aware-client-creation}

Foydalanish `resolve_torii_client_config` ilova nod sozlamalarini oʻqiganida
fayldan, ammo hali ham atrof-muhit yoki sinovga oid o'zgarishlar kerak:

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

O ' zbekiston Respublikasi Python SDK joriyni soʻrash mumkin JSON tayyorlik yo'li o'zining umumiy
Torii iltimos yordamchisi:

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

Python Kagemusha to'ldirish yoki sotib olish arxivlarini yaratishni ochib bermaydi.
Tugmalar birikmasi Swift yoki JVM kanonik qurilishi uchun qopchiq V4 arxivlar, keyin
qo'llab-quvvatlanadigan Kagemusha orqali ularni taqdim etish va so'rov berish Torii mijoz.

## Abonnementlar {#subscriptions}

Abonentlar yordamchilari oʻzaro aloqadan meros qilib olingan xizmat qoʻngʻiroqlarini mutatsiya qilishadi Torii
tomonidan ishlatiladigan mijoz `iroha_python.ToriiClient`. Foydalanish IDs va aktivlar mavjud
maqsadingiz bo'lgan tarmoq.

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

Qurish va tahlil qilish Aloqa URIs, va Connect-ning ommaviy holatini oʻqish
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

Ramka kodeklari, sessiya kalitining kelib chiqishi va sessiya yaratish uchun mahalliy kodek talab etiladi
kengaytma va Connect seans yo'nalishi:

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

Tasdiqdan keyingi xabarlarni holatli seans bilan kodlash:

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

## Boshqaruv, ish vaqti va admin yuzalari {#governance-runtime-and-admin-surfaces}

Ushbu faqat oʻqish uchun qoʻngʻiroqlar jamoatchilikka qarshi muvaffaqiyatli qaytdi Taira:

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

Ish vaqti yangilanish yordamchilari ish vaqti yangilanishi tomonidan ishlatiladigan manifest shaklini qabul qilishadi
API. Ular operatorning harakatlari, shuning uchun ularni faqat nodga qarshi ishlating
hisob va tokenlarga ruxsat beriladi:

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

## SoraFS, UAID, va Kaigi Yordamchilar {#sorafs-uaid-and-kaigi-helpers}

Ushbu yordamchilar maqsadli nod tegishli
Nexus/SORA oxirgi nuqtalar. Bo'sh ro'yxatlarni to'g'ri javob sifatida qabul qiling: ommaviy Taira may
ko'rsatkichlar o'rnatilmagan holda yo'nalishni qo'lga kiritgan bo'lishi; yoki UAID.

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

## Norito RPC va GPU Yordamchilar {#norito-rpc-and-gpu-helpers}

Foydalanish `NoritoRpcClient` agar siz allaqachon Norito baytlar va bir chaqirish kerak
ikkilamchi Torii oxirgi nuqta. Misol uchun avvalgi
Transaksiya namunalari:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA yordamchilar qaytadi `None` orqa tomoni mavjud bo'lmaganida, shuning uchun dasturlar
ko'lamli amalga oshirishlarga qaytishi mumkin:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Joriy qamrov {#current-coverage}

O ' zbekiston Respublikasi Python SDK allaqachon quyidagilar uchun yordamchilarni o'z ichiga oladi:

- Torii taqdim etish, holat, so'rov va admin oqimlari
- umumiy uchun bosma ko'rsatmalar ishlab chiqaruvchilari ISI va domenga oid kengaytmalar
- Transaksiya loyihalari, manifestlar, imzolash va imzolangan tranzaksiya zarflari
  ish oqimlari
- O'tkazilgan hodisalar, filtrlar va qayta tiklanishi mumkin bo'lgan kursorlar
- keng tarqalgan Kagemusha tayyorgarligi va Torii obuna yordamchilari; yozib qo'yilgan
  to'ldirish va to'lov qurilmalari bo'lmagan
- hisob manzili, barcha algoritmlarni imzolash yordamchilari, ko'p hashli qaytib borishlar, SM2,
  GOST, ML-DSA, BLS, va maxfiy kalitlarni boshqarish
- Ulanish URIs, seanslar, kadrlar, shifrlash yordamchilari va reyestr boshqaruvchisi
- boshqaruv, ishga tushirish vaqtini takomillashtirish, Sumeragi, nod-admin, SoraFS, UAID, va Kaigi
  nod ushbu xususiyatlarni ochib beradigan oxirgi nuqta qoplamalari

## Yuqoridagi ma'lumotlar {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Ushbu fayllar haqiqat manbaidir . Python to'plamdagi yuza
ish maydonini qayta ko'rib chiqish.
