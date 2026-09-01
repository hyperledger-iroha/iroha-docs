---
translation_locale: am
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

በላይኛው የስራ ቦታ ውስጥ ያለው Python SDK `iroha-python` ነው። የመጀመሪያው Iroha 3 ልቀት የአሁኑን Torii እና Norito ንጣፎችን ያነጣጠረ ነው። SDK እና ኖድ በተመሳሳይ ተከታታይ ቅርጸት ክለሳ ላይ እንዲቆዩ በውህደትዎ ጥቅም ላይ የዋለውን የጥቅል ስሪት ወይም የምንጭ ክለሳ ይሰኩት።

ማንነታቸው ያልታወቁ ምሳሌዎች ከታች ያነበቡ ይፋዊ Taira በ`https://taira.sora.org` ላይ ያነጣጠሩ ናቸው። መንገዱ ተነባቢ-ብቻ ሊሆን ይችላል እና አሁንም አንድ ፕሮቶኮል-መደበኛ መለያ ፊርማ ወይም ትክክለኛ የአውታረ መረብ ኦፕሬተር ፊርማ ያስፈልገዋል; እነዚያ ምሳሌዎች ለየብቻ ምልክት ተደርጎባቸዋል. ሚውቴሽን ምሳሌዎች የግብይት አብነቶች ናቸው እና እውነተኛ Taira የፈቃድ ባለቤት፣ የግል ቁልፍ፣ የተተየበ የክፍያ ክፍያ ዓላማ፣ በቂ የሙከራ መረብ XOR እና ከማስገባቱ በፊት በዒላማው መንገድ የሚፈለገውን ማረጋገጫ ይፈልጋሉ።

ምሳሌዎቹን በዚህ ቅደም ተከተል ይጠቀሙ -

|ደረጃ|በህዝብ ላይ መሮጥ Taira?|ምንድን ነው የሚፈልጉት|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|ስም-አልባ ጥሪዎችን ያነበቡ|አዎ|Python ጥቅል እና የአውታረ መረብ መዳረሻ|
|መለያ ወይም ኦፕሬተር የተረጋገጠ ንባቦች|በራስዎ ተቀባይነት ያለው ማንነት ብቻ|ትክክለኛው Taira `NetworkId` እና ተጓዳኝ መለያ ወይንም አንቀሳቃሽ ቁልፍ|
|የአካባቢ ፊርማ እና መመሪያ ገንቢዎች|እስከ `submit()` ድረስ ምንም የአውታረ መረብ ጥሪ የለም።|ቤተኛ ቅጥያ እና የእርስዎ ቁልፍ ቁሳቁስ|
|ግብይቶችን እና የአገልግሎት ጥሪዎችን መለዋወጥ|በራስዎ የገንዘብ ድጋፍ ሂሳብ ብቻ|የፍቃድ ዋና መለያ፣ የግል ቁልፍ፣ ትክክለኛ Taira `NetworkId`፣ የተተየበ የክፍያ ዓላማ፣ የክፍያ ንብረት ቀሪ ሂሳብ እና የመንገድ ቶከኖች|
|የፍሬም ኮዴኮችን፣ ክሪፕቶፕን እና GPU ረዳቶችን ያገናኙ|አካባቢያዊ ብቻ|ቤተኛ ቅጥያ; GPU ረዳቶች እንዲሁ CUDA የሚችል ጀርባ ያስፈልጋቸዋል|

## ጫን። {#install}

የጥቅሉ ሜታዳታ ስም `iroha-python` ነው። ያልተሰካ PyPI ጭነት ከቀጥታ Taira አውታረ መረብ ጋር ይዛመዳል ብለው አያስቡ። የውህደት ኢላማዎችዎ ከተመሳሳይ የላይኛው ክለሳ የተገነባ የዊል ወይም የምንጭ ኮድ የስራ ቅጂ ይጫኑ -

```bash
python -m pip install /path/to/iroha_python-*.whl
```

ፕሮጀክትዎ የላይኛውን የስራ ቦታ በቀጥታ የሚጠቀም ከሆነ፣ Python ጥገኞችን ይጫኑ እና `Instruction`፣ `TransactionDraft` የሚጠቀሙ ምሳሌዎችን ከማስኬድዎ በፊት ቤተኛ ቅጥያውን ይገንቡ። መፈረም፣ crypto፣ SoraFS ቤተኛ ረዳቶች፣ GPU ረዳቶች ወይም የፍሬም ኮዴኮችን ያገናኙ። ከላይ ያለውን የግንባታ ትዕዛዝ ይጠቀሙ `python/iroha_python/README.md` እና ከዚያ ቤተኛ ወደ ውጭ የሚላኩ መጫኑን ያረጋግጡ -

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

`create_torii_client` ከማስመጣት ነገር ግን `Instruction` ወይም `generate_ed25519_keypair` ካልተሳካ፣ ንፁህ Python ጥቅል ይገኛል ነገር ግን ቤተኛ ቅጥያው የለም።

## ፈጣን ጅምር {#quickstart}

ይፋዊ፣ ተነባቢ-ብቻ Taira API የመጨረሻ ነጥቦች ጀምር

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

## የተጋራ ማዋቀር {#shared-setup}

ለሚውቴሽን አብነቶች ይህንን ማዋቀር ይጠቀሙ። ከማሰማራትዎ በፊት እያንዳንዱን ቦታ ያዥ በ Taira የፈቃድ ባለቤት፣ የግል ቁልፍ፣ ቶከን እና የንብረት/መለያ መታወቂያዎች ይተኩ።

`authority` ግብይቱን የሚፈርም መለያ ነው እና `private_key` ከእሱ ጋር መዛመድ አለበት።. ግብይቶች ከ Taira ትክክለኛ የጀነሲስ የተገኘ `NetworkId` ጋር ይሳሰራሉ። ሰንሰለቱ UUID የማሰማራት መለያ እንጂ የግብይት መለያ አይደለም። ክፍያዎች ከመተግበሪያ ሜታዳታ ነፃ የሆነ የተተየበ የክፍያ ዓላማ እና ትክክለኛ የቀጥታ የክፍያ ዋጋ ግምት ይጠቀማሉ። ከታች ያሉት መለያ እና ቁልፍ ቦታ ያዢዎች ሆን ተብሎ ልክ ያልሆኑ ናቸው ስለዚህ በአጋጣሚ አይቀርቡም።

ከታች ያለው ቃል በቃል የአሁኑ የተሰካ Taira የብሎክቼይን ጀነሲስ መለያ ነው። የቴስትኔት ዳግም ማስጀመር ሊለውጠው ይችላል፣ ስለዚህ ከተፈረመው የማሰማራት መገለጫ ያድሱት እና ከሰንሰለቱ UUID በጭራሽ አይገምቱት።

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

`Instruction.*` የሚገነባው የማስተማሪያ ጭነቶችን ብቻ ነው። `submit()` SDK የቀጥታ ክፍያ ዋጋ ግምትን የሚያገኝበት፣ ትክክለኛውን የተጠቀሰውን ጭነት የሚፈርምበት፣ ወደ Torii የሚልክበት እና ሁኔታን የሚጠብቅበት ነጥብ ነው።

## ክፍያዎች እና የግብይት አፈፃፀም ዋጋ {#fees-and-gas}

ግብይቶችን ይፃፉ የተተየበ `FeePaymentIntent` እና በገንዘብ የተደገፈ የክፍያ ንብረት ቀሪ ሂሳብ ያስፈልጋቸዋል። በ Taira ላይ፣ የህዝብ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት የገንዘብ ድጋፍ testnet XOR። Python SDK ቋሚውን ያልተፈረመውን ይልካል ለትክክለኛው የክፍያ ዋጋ ግምት ወደ Torii ጭነት፣ ጥቅሱ ከፋዩን ወይም ሸክሙን እንዳልተካ ያረጋግጣል እና የተጠቀሰውን ዓላማ ይፈርማል። የክፍያ ምርጫን በግብይት ሜታዳታ ውስጥ አያስቀምጡ።

ከላይ ያለው `submit()` ረዳት የሚጀምረው የክፍያ ገደቡ ሆን ተብሎ ባዶ በሆነው በግብይቱ-ፊርማ-መለያ ዓላማ ነው።. `quote_and_sign()` ከመፈረምዎ በፊት ከቀጥታ የክፍያ ዋጋ ግምት ይሞላቸዋል -

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

የመጻፍ ክዋኔዎችን ከመላክዎ በፊት፣ የፍቃድ ዋና መለያው በቂ የክፍያ ንብረቱ ባለቤት መሆኑን ያረጋግጡ። ትክክለኛው የቴስትኔት የገንዘብ ድጋፍ አገልግሎት እና የንብረት መታወቂያ አውታረ መረብ-ተኮር ናቸው; ይህ Taira ቅርጽ ነው -

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

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ለሂሳብ ቼክ ጥቅም ላይ የሚውለውን ኮንክሪት `asset_id` ይመልሳል። የቀጥታ ጥቅሱ `FEE_ASSET_DEFINITION` ክፍያ እንደሚያስከፍል ያረጋግጡ; ግብይቱ ያንን ንብረት በሜታዳታ አይመርጥም።

የመተግበሪያ ሜታዳታ አማራጭ ነው እና ምንም የክፍያ ትርጓሜ የለውም -

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

የክፍያ ዓላማውን ከተዉ፣ ላልተጠበቀ ንብረት የክፍያ ግምት ከተቀበሉ፣ ከግምቱ በኋላ ጭነቱን ከቀየሩ ወይም ገንዘብ ባልተሞላ መለያ ከፈረሙ፣ ግብይቱን ማስገባት የለብዎትም።

## ስም የለሽ Taira ያነባል {#anonymous-taira-reads}

እነዚህ ጥሪዎች የካታሎግ ወሰናቸው ማንነታቸው ያልታወቀ ንባብ የሚፈቅዱ Taira መንገዶችን ይጠቀማሉ -

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

`/v1/time/status` እና እያንዳንዱ `/v1/sumeragi/*` ኦፕሬተር ነጥብ-በ-ጊዜ የውሂብ እይታ ምንም እንኳን ሁኔታን ባይቀየሩም ትክክለኛ የአውታረ መረብ ኦፕሬተር ፊርማ ያስፈልገዋል።. ለማይታወቅ ኖድ `request_json("GET", "/status")`ን ይጠቀሙ የሁኔታ ጭነት እና ከዚህ በታች ያለው ኦፕሬተር ለስምምነት ወይም ለኖድ የሰዓት ምርመራዎች። የክፍለ ጊዜ ሁኔታን ያገናኙ የተለየ የፕሮቶኮል መንገድ ነው እና የዚያን ክፍለ ጊዜ አስተዳደር ቶከን ይፈልጋል።

## መመሪያ ገንቢዎች {#instruction-builders}

SDK በጣም ለተለመዱት የማስተማሪያ ቤተሰቦች የተተየቡ ግንበኞችን እና JSON የማምለጫ መፈልፈያ ገና አንደኛ ደረጃ Python ዘዴዎች ላልሆኑ ተለዋጮች ያጋልጣል። የሚከተሉት ቅንጥቦች የግብይት አብነቶችን እየቀየሩ ነው እና ያለ ፊርማ መለያ ለህዝብ Taira አልቀረቡም።

የተተየቡ ረዳቶች በሚኖሩበት ጊዜ ይምረጡ የ Python እሴቶችን መደበኛ ያደርጋሉ እና ልክ ባልሆኑ ቅርጾች ላይ ቀደም ብለው ይወድቃሉ። `Instruction.from_json` እስካሁን Python ረዳት የሌለው የማስተማሪያ ልዩነት ሲፈልጉ ብቻ ይጠቀሙ።

|ትምህርት ቤተሰብ|Python ፊት|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|ይመዝገቡ|`register_account`፣ `register_asset_definition_numeric`፣ `register_rwa`፣ `register_time_trigger`፣ `register_precommit_trigger`; `register_domain` ለጀነሲስ/ቡት ማሰሪያ መሳሪያ የተያዘ ነው።|
|ከምዝገባ ይውጡ|`unregister_trigger`; ለሌሎች ተለዋጮች `Instruction.from_json` ተጠቀም|
|ሚንት / ማቃጠል|`mint_asset_numeric`፣ `burn_asset_numeric`፣ `mint_trigger_repetitions`፣ `burn_trigger_repetitions`|
|ማስተላለፍ|`transfer_asset_numeric`፣ `transfer_domain`፣ `transfer_asset_definition`፣ `transfer_nft`፣ `transfer_rwa`፣ `force_transfer_rwa`|
|ሜታዳታ እና መቆጣጠሪያዎች|`set_account_key_value`፣ `remove_account_key_value`፣ `set_rwa_controls`፣ `set_rwa_key_value`፣ `remove_rwa_key_value`|
|RWA የሕይወት ዑደት|`merge_rwas`፣ `redeem_rwa`፣ `freeze_rwa`፣ `unfreeze_rwa`፣ `hold_rwa`፣ `release_rwa`|
|ExecuteTrigger|`execute_trigger`|
|የሪፖ/የማጠናቀቂያ ማራዘሚያዎች|`repo_initiate`፣ `repo_unwind`፣ `repo_margin_call`፣ `settlement_dvp`፣ `settlement_pvp`|
|ቤተኛ የንብረት መቆለፊያዎች|`open_asset_lock`፣ `drawdown_asset_lock`፣ `cancel_asset_lock`፣ `expire_asset_lock`፣ እና ደንበኛ `*_and_wait` ረዳቶች|
|ስጦታ/መሻር፣ SetParameter፣ ምዝግብ ማስታወሻ፣ ብጁ፣ አሻሽል፣ እና ብዙም ያልተለመዱ የመመዝገቢያ/መመዝገቢያ ልዩነቶች|`Instruction.from_json` ወይም `TransactionBuilder.add_instruction_json` ከነጠላ ፕሮቶኮል-መደበኛ `InstructionBox` JSON ጋር|

ለ escrow አይነት ሁኔታዊ ክፍያዎች፣ [ቤተኛ ንብረት Escrow](/am/blockchain/escrow.md#python-asset-locks) ይመልከቱ። Python በአሁኑ ጊዜ ለአጠቃላይ የንብረት መቆለፊያዎች አንደኛ ደረጃ ረዳቶችን ይሰጣል። የገበያ ቦታ እና ማንነታቸው ያልታወቁ የዋስትና ረዳቶች ገና አንደኛ ደረጃ Python ዘዴዎች አይደሉም።.

### ጎራዎችን ያዋቅሩ እና መለያዎችን እና ንብረቶችን ያስመዝግቡ {#set-up-domains-then-register-accounts-and-assets}

ተራ የጎራ ፈጠራ በገላጭ ተለዋጭ ስም እቅድ አውጪ በኩል ያልፋል ስለዚህ የ SNS የሊዝ ውል፣ የባለቤት ችሎታዎች፣ የክፍያ-ዋጋ ማረጋገጫ ጠባቂ እና የጎራ ሁኔታ አንድ ላይ ይጣራሉ። በእርስዎ SDK ወይም በመሳፈሪያ አገልግሎትዎ ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` አላማ ይፍጠሩ እና ከዚያ `iroha app alias setup plan` እና `iroha app alias setup apply` ይጠቀሙ። ከማመልከቻ ግብይት `Instruction.register_domain` አያስገቡ; ያ ገንቢ ለጀነሲስ/ቡት ማሰሪያ መሳሪያ ይቀራል።

የጎራ ማዋቀር እቅዱ ከተጠናቀቀ በኋላ በጎራ ባለቤትነት የተያዙ ነገሮችን ይመዝገቡ። እንደ Taira ባሉ የጋራ አውታረ መረብ ላይ ለእርስዎ የተመደበውን የጎራ እና የመለያ ስም ቦታ ይጠቀሙ።

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

`mintable` በውሂብ ሞዴል ተቀባይነት ያላቸውን `Infinitely`፣ `Once`፣ `Not` ወይም `Limited(n)` እሴቶችን ይቀበላል። ላልተገደበ የቁጥር ንብረት `scale`ን ይተዉት።

### ንብረቶችን ማውጣት፣ ማጥፋት እና ማስተላለፍ {#mint-burn-and-transfer-assets}

እነዚህ ጥሪዎች ነባር የንብረት መታወቂያ ይጠቀማሉ። መጀመሪያ የንብረቱን ፍቺ ያስመዝግቡ፣ ከዚያ የንብረቱ ባለቤት ለሆነው መለያ የኮንክሪት ንብረት መታወቂያ ይገንቡ።

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### የባለቤትነት መብትን ያስተላልፉ {#transfer-ownership}

የባለቤትነት ዝውውሮች ጎራውን፣ የንብረት ፍቺውን ወይም NFT ማን እንደሚቆጣጠር ይለውጣል። የአሁኑን ባለቤት እንደ የግብይት ፈቃድ ዋና ይጠቀሙ።

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### ሜታዳታ ያዘጋጁ እና ያስወግዱ {#set-and-remove-metadata}

የሜታዳታ እሴቶች JSON-ተከታታይ መሆን አለባቸው። `TransactionDraft`ን ሲጠቀሙ፣ በ`TransactionConfig` ውስጥ ያለው የፍቃድ ዋና ነባሪ የዒላማ መለያ ይሆናል።

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

የከፍተኛ ደረጃ ረቂቅ ረዳት በነባሪነት የግብይት የፈቃድ ባለቤትን ያነጣጠረ ነው -

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

### የገሃዱ ዓለም ንብረቶች {#real-world-assets}

RWA ረዳቶች ለንብረት-ተኮር ሜታዳታ፣ አመጣጥ እና ተቆጣጣሪ ፖሊሲ JSON -ተከታታይ ጭነቶችን ይጠቀማሉ። `register_rwa` `id` ወይም `owner` አይቀበልም - የሶፍትዌር ማስፈጸሚያ አካባቢ `RwaId` ያመነጫል፣ እና የግብይት ፍቃድ ርእሰ መምህሩ የመጀመሪያ ባለቤት ይሆናል።

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

የምዝገባ ግብይቱ ከተጠናቀቀ በኋላ፣ የተፈጠረውን መታወቂያ ለማግኘት `FindRwas`፣ `/v1/rwas`፣ RWA ክስተት ወይም የአሳሽ መንገድ ተዘጋጅቷል።

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

ተከታይ ክዋኔዎች የመነጨውን `hash$domain` መታወቂያ ይጠቀማሉ -

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

ሙሉ ዝውውሮች አሁን ባለው ዕጣ ላይ `owned_by` ሊለወጡ ይችላሉ። ከፊል ዝውውሮች እና ውህደቶች የመነጩ የልጅ ዕጣዎችን ይፈጥራሉ።

### ቀስቅሴዎች {#triggers}

አስፈፃሚው ሌላ የመመሪያ ቅደም ተከተል ሲሆን ቀስቅሴ ምዝገባ ረዳቶችን ይጠቀሙ -

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

Torii እንዲሁም REST ረዳቶችን ለቀስቅሴ ክምችት ያጋልጣል -

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

ቀስቅሴ የእቃ ዝርዝር ጥሪዎች ቀስቅሴ መዝገቦችን ብቻ ያንብቡ ወይም ይፈትሹ። ምዝገባ፣ አፈፃፀም፣ የድግግሞሽ ለውጦች እና መመዝገቢያ ማውጣት ስራዎችን የሚቀይሩ ናቸው።

### ሪፖ እና የፋይናንስ ግብይት ማቋቋሚያ መመሪያዎች {#repo-and-settlement-instructions}

ሪፖ እና የሁለትዮሽ-ማጠናቀቂያ ረዳቶች ጎራ-ተኮር የመመሪያ ልዩነቶችን በእጅ ሳይሰሩ Norito ጭነቶችን ያያይዛሉ -

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

### JSON አምልጥ ሂች {#json-escape-hatch}

Python ረዳት በማይገኝበት ጊዜ፣ ነጠላ ፕሮቶኮል-መደበኛ የውሂብ-ሞዴል `InstructionBox` JSON ወደ `Instruction.from_json` ይመግቡ። ይህ የሚመከረው መንገድ ነው `Grant`፣ `Revoke`፣ `SetParameter`፣ `Log`፣ `Custom`፣ `Upgrade`፣ የአቻ/ሚና/NFT ምዝገባ፣ እና ቀስቅሴ ያልሆኑ ልዩነቶች እነዚያ ረዳቶች እስኪተየቡ ድረስ።

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

የተተየበውን ረቂቅ መንገድ በግብይቱ ወሰን ላይ ያቆዩት ትክክለኛውን `NetworkId`፣ የክፍያ ክፍያ ዓላማን እና ከመፈረምዎ በፊት የክፍያ ዋጋ ግምት የማይለዋወጥን ይጠብቃል። ቀጥተኛ `TransactionBuilder` አጠቃቀም ተመሳሳይ እሴቶችን እና የቀጥታ የክፍያ ዋጋ ግምት ግልጽ ማረጋገጫን ይፈልጋል፣ ስለዚህ ለመተግበሪያ ኮድ አቋራጭ መንገድ አይደለም።

ለተፈጠሩ ወይም ግልጽ ያልሆኑ መመሪያዎች፣ የሙከራ አብነቶችን ከማጠራቀምዎ በፊት በ JSON በኩል ዙር ጉዞ -

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## የግብይት የስራ ፍሰቶች {#transaction-workflows}

ከመፈረምዎ በፊት ብዙ መመሪያዎችን ለሚገነቡ መተግበሪያዎች `TransactionDraft`ን ይጠቀሙ። ረቂቅ እንደ `ttl_ms`፣ `nonce` እና ሜታዳታ ያሉ የግብይት ደረጃ ቅንብሮችን በአንድ ቦታ እንዲያስቀምጡ ያስችልዎታል እና ከዚያ አንድ ጊዜ ይፈርሙ -

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

ለግምገማ፣ ኦዲት ወይም የኪስ ቦርሳ ማስረከብ ዲተርሚኒስቲክ ቴክኒካል ማኒፌስት ወደ ውጭ ይላኩ -

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

የታለመው የማስፈጸሚያ መስመር በሚፈልግበት ጊዜ ከመፈረምዎ በፊት የማስፈጸሚያ መስመር ግላዊነት ማረጋገጫ ያያይዙ -

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

## መጠይቆች {#queries}

የተተየቡ መጠይቅ ረዳቶች ከጥሬ JSON መዝገበ-ቃላት ይልቅ የውሂብ ክፍሎችን ይመልሳሉ። ለመጀመር ቀላሉ መንገድ ናቸው ምክንያቱም SDK ገጽ አወጣጥ እና የጋራ መዝገብ መስኮችን ለእርስዎ ስለሚተነትኑ -

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii API የመጨረሻ ነጥብ ገና የተተየበ የሶፍትዌር አስማሚ ከሌለው አጠቃላይ የጥያቄ ረዳቶችን ይጠቀሙ -

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

የመለያ ክምችት ረዳቶች በ SDK መደበኛነት ተቀባይነት ያለው መለያ መለያ ያስፈልጋቸዋል። ነጠላ ፕሮቶኮል-መደበኛ I105 መለያ መታወቂያዎችን ወይም በሰንሰለት ላይ ያሉ ተለዋጭ ስሞችን ይጠቀሙ; የብሎክ አሳሽ ወይም ጥሬ API የመጨረሻ ነጥብ SDK ውድቅ ያደረገውን መታወቂያ ከመለሰ፣ እነዚህን ረዳቶች ከመደወልዎ በፊት ወደ አንድ ፕሮቶኮል-መደበኛ መለያ መታወቂያ ይፍቱት።

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## ክስተቶች {#events}

የዥረት ረዳቶች JSON ጭነቶችን በነባሪነት ይፈታሉ። የ SSE የክስተት ስም፣ መታወቂያ፣ ፍንጭ እንደገና ይሞክሩ እና ጥሬ ጭነት ሲፈልጉ `with_metadata=True`ን ይለፉ። ነጠላ ፕሮቶኮል-ስታንዳርድ `/v1/events/sse` ምግብ የቀጥታ ስርጭት ብቻ ነው - ምንም የመልሶ ማጫወት መታወቂያዎችን አያወጣም እና ምንም የመልሶ ማጫወት ምዝግብ ማስታወሻ አይይዝም፣ ስለዚህ እነዚህ ረዳቶች ምንም ጠቋሚ ወይም ከቆመበት ቀጥል ክርክር አይሰጡም። እንደገና መገናኘት አዲስ የደንበኝነት ምዝገባ ይጀምራል እና ክፍተት ሊኖረው ይችላል። ሙሉው የብሎክቼይን መዝገብ ታሪክ ሲያስፈልግ `/v1/blocks/stream`ን ከሚታወቅ ከፍታ ይጠቀሙ። እነዚህ ምሳሌዎች የቀጥታ ክስተቶችን ይጠብቃሉ፣ ስለዚህ ዥረቱ ከነቃ እና ንቁ በሆነበት ኖድ ላይ ያሂዷቸው።

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

## ቁልፎች እና አድራሻዎች {#keys-and-addresses}

SDK ወደ ቤተኛ ቅጥያ ለተጠናቀረ እያንዳንዱ የፊርማ ስልተ ቀመር የአካባቢ ፊርማ ረዳቶችን ያጋልጣል። እነዚህ ረዳቶች Taira አይደውሉም፣ ነገር ግን ቤተኛ ቅጥያ ያስፈልጋቸዋል -

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

መንኮራኩርዎ ምን እንደሚደግፍ ለማየት `supported_crypto_algorithms()` ይጠቀሙ። አጠቃላይ ረዳቶቹ ነጠላ ፕሮቶኮል-መደበኛ አልጎሪዝም መለያዎችን ይጠቀማሉ እና ለ Ed25519፣ secp256k1፣ ML-DSA፣ GOST፣ BLS እና SM2 እነዚያ ስልተ ቀመሮች ሲጠናቀሩ ይሰራሉ -

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

### ቻይንኛ SM ክሪፕቶግራፊ {#chinese-sm-cryptography}

Python SDK ሁለቱንም አጠቃላይ SM2 ረዳቶችን እና SM2-ተኮር የምቾት ረዳቶችን ያጋልጣል። በዒላማው አውታረመረብ የሚጠበቀውን SM2 መለያ ለመምረጥ የኖድ አቅም ማስታወቂያውን ይጠቀሙ -

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

`crypto.sm.enabled` ኖድ አሁን ባለው ፖሊሲ ውስጥ SM -ቤተሰብ ስልተ ቀመሮችን መቀበሉን ይነግርዎታል። ይኸው ማስታወቂያ SM ምስጠራ ሃሽ ፖሊሲን እና የፍጥነት ሁኔታን ያካትታል፣ ይህም SM2 -ተኮር ፍሰቶችን ለማንቃት ሲወስኑ ጠቃሚ ነው።

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

የተረጋገጠውን የችሎታ ጭነት ለተዘረጋው ኖድ እንደ ስልጣን ይያዙት። `crypto.sm.enabled` እውነት ካልሆነ እና የማስታወቂያው የፊርማ ፖሊሲ ካልፈቀደ በስተቀር በ SM2 የተፈረመ ግብይት አያስገቡ።

### GOST እና ድህረ-ኳንተም ቁልፎች {#gost-and-post-quantum-keys}

ለ GOST R 34.10-2012 የመለኪያ ስብስቦች እና ML-DSA (`ml-dsa`) የድህረ-ኳንተም ፊርማዎችን አጠቃላይ crypto API ይጠቀሙ። ተመሳሳይ የቁልፍ-ጥንድ ነገር መፈረም፣ ማረጋገጫ እና ባለብዙ ሃሽ ወደ ውጭ መላክን ያስተናግዳል -

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

በር GOST እና የድህረ-ኳንተም ፍሰቶች በኖድ በተረጋገጠ፣ በተተየበ የአቅም ማስታወቂያ ላይ -

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

አንድ ኖድ የሚፈልጉትን ስልተ ቀመር ካላስተዋወቀ ቁልፉን ለአካባቢያዊ ወይም ከመስመር ውጭ የስራ ፍሰቶች ብቻ ይጠቀሙ። በዚያ ስልተ ቀመር የተፈረሙ ግብይቶችን ወደዚያ ኖድ አያስገቡ። በሕዝብ Taira ፍተሻ ወቅት፣ GOST እና ML-DSA በላይኛው ተፋሰስ Python ቤተ-መጽሐፍት ውስጥ እንደ SDK crypto ረዳቶች ይገኛሉ ነገር ግን ለግብይት ፊርማ በኖድ ማስታወቂያ አልተደረጉም።

## ውቅረት-አዋቂ የደንበኛ መፍጠር {#config-aware-client-creation}

መተግበሪያዎ የኖድ ቅንብሮችን ከፋይል ሲያነብ ነገር ግን አሁንም አካባቢን ወይም ሙከራ-ተኮር መሻራዎችን ሲፈልግ `resolve_torii_client_config` ይጠቀሙ

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

## የካጌሙሻ ዝግጁነት {#kagemusha-readiness}

የ Python SDK የአሁኑን JSON ዝግጁነት መንገድ በአጠቃላይ Torii ጥያቄ ረዳት በኩል መጠየቅ ይችላል -

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

Python የተተየቡ የካጌሙሻ መሙያ ወይም መቤዠት ማህደር ግንበኞችን አያጋልጥም።. ነጠላ ፕሮቶኮል-ስታንዳርድ V4 ማህደሮችን ለመገንባት የተተየበ Swift ወይም JVM የኪስ ቦርሳ ይጠቀሙ፣ ከዚያ በሚደገፍ የKagemusha Torii ደንበኛ በኩል ያስገቡ እና ይመርጧቸው።

## የደንበኝነት ምዝገባዎች {#subscriptions}

የደንበኝነት ምዝገባ ንባቦች እና ረቂቅ ግንበኞች በ`iroha_python.ToriiClient` ጥቅም ላይ ከሚውለው የጋራ Torii ደንበኛ ይወርሳሉ። እያንዳንዱ ሚውቴሽን ከውሂብ አካል ጋር በተያያዘ ነጠላ ይቀበላል ፕሮቶኮል-መደበኛ መለያ ፊርማ እና ያልተፈረመ የግብይት ረቂቅ ይመልሳል። Torii የግል ቁልፍን በጭራሽ አይቀበልም እና ረቂቁን አያቀርብልዎትም።.

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

እያንዳንዱን ትክክለኛ ጭነት እና የፊርማ መልእክት ለተዛማጅ መለያው የኪስ ቦርሳ ይስጡ፣ የተጠየቀውን ክዋኔ እዚያ ያረጋግጡ፣ የተፈረመውን ግብይት ያሰባስቡ እና በተለመደው የግብይት ሶፍትዌር ማቀነባበሪያ የስራ ሂደት ያስገቡ። Python SDK የፊርማ መልእክቱ የተመለሰው ጭነት ነጠላ ፕሮቶኮል-ስታንዳርድ ምስጠራ ሃሽ መሆኑን ያረጋግጣል፣ ነገር ግን የኪስ ቦርሳው ከመፈረሙ በፊት ግብይቱን የመፍታት እና የማጽደቅ ሃላፊነት አለበት።

## ይገናኙ {#connect}

ይገንቡ እና ይተንትኑ አገናኝ URIs በአገር ውስጥ። የግንኙነት መታወቂያ SID ን ከትክክለኛው `NetworkId`፣ የመተግበሪያ የህዝብ ቁልፍ እና ምስጠራ ኖስ እሴት ጋር ያገናኛል።

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

ያንን ትክክለኛ ቅድመ እይታ ያስመዝግቡ የታለመው ኖድ ግንኙነትን ሲያጋልጥ ብቻ ነው። የክፍለ ጊዜ ፈጠራ አራት ሚና-ተኮር ተሸካሚ ቶከኖችን ይመልሳል። የእያንዳንዱ ክፍለ ጊዜ ሁኔታ መንገድ የአስተዳደር ቶከኑን ይፈልጋል; ድምር ሁኔታ የኦፕሬተር መንገድ ነው።

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

የድህረ-ማጽደቅ መልዕክቶችን በሁኔታ ክፍለ ጊዜ ኢንክሪፕት ያድርጉ -

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

## አስተዳደር፣ የሶፍትዌር ማስፈጸሚያ አካባቢ እና የአስተዳዳሪ ገጽታዎች {#governance-runtime-and-admin-surfaces}

የአስተዳደር ንባቦች በመለያ የተረጋገጡ ናቸው። ከ[የተጋራ ማዋቀር](#shared-setup) የፍቃድ ርእሰ መምህሩን እና የቁልፍ ጥንድን በመጠቀም እያንዳንዱን የረዳት ጥሪ ከ Taira ትክክለኛ የጀነሲስ የተገኘ `NetworkId` ጋር ያያይዙ።

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

ለኦፕሬተር ንባብ የተለየ ደንበኛ ይፍጠሩ። የተፈቀደውን ኦፕሬተር ቁልፍ በሶፍትዌር ማስፈጸሚያ አካባቢ ላይ ይጫኑ እና ከ Taira ትክክለኛ `NetworkId` ጋር ያያይዙት። ተሸካሚ ቶከኖች እና `x-api-token` ይህን ፊርማ አይተኩትም -

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

የአሂድ ጊዜ-ማሻሻያ መንገዶች በኦፕሬተር የተረጋገጡ መመሪያ ገንቢዎች ናቸው። የተሳካ ሀሳብ ማቅረብ፣ ማግበር ወይም መሰረዝ ምላሽ ይመለሳል `tx_instructions`; ማሻሻያውን አያወጣም። ያንን ጥቅል በተለመደው የተፈረመ የግብይት እና የአስተዳደር መንገድ ያስገቡ። የተሰካው Python ዘዴዎች `propose_runtime_upgrade`፣ `activate_runtime_upgrade` እና `cancel_runtime_upgrade` በአሁኑ ጊዜ የደንበኛውን `OperatorSigningContext` ከመተግበር ይልቅ ግልጽ ጥያቄዎችን ይሰጣሉ፣ ስለዚህ ይህ አጋዥ ስልጠና እንደ የሚሰራ ኦፕሬተር ፍሰት አያቀርባቸውም።

## ሁኔታ፣ መግባባት እና የአውታረ መረብ ቴሌሜትሪ {#status-consensus-and-network-telemetry}

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

## SoraFS፣ UAID እና Kaigi ረዳቶች {#sorafs-uaid-and-kaigi-helpers}

እነዚህ ረዳቶች የሚገኙት የዒላማው ኖድ ተጓዳኝ Nexus/SORA API የመጨረሻ ነጥቦችን ሲያጋልጥ ነው። ባዶ ዝርዝሮችን እንደ ትክክለኛ ምላሽ ይያዙ ይፋዊ Taira መንገዱ ያለ ውሂብ ሊነቃ ይችላል ቴክኒካል ማኒፌስት ወይም UAID።

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

## Norito RPC እና GPU ረዳቶች {#norito-rpc-and-gpu-helpers}

አስቀድመው Norito ባይት ሲኖርዎት እና ሁለትዮሽ Torii API የመጨረሻ ነጥብ መጥራት ሲፈልጉ `NoritoRpcClient` ይጠቀሙ። ምሳሌው ከቀዳሚው የግብይት አብነት የተፈረመ የውሂብ መያዣ ያስፈልገዋል -

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

CUDA የጀርባው ክፍል በማይገኝበት ጊዜ ረዳቶች `None` ይመለሳሉ፣ ስለዚህ አፕሊኬሽኖች ወደ ስካላር ትግበራዎች ሊመለሱ ይችላሉ።

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## የአሁኑ ሽፋን {#current-coverage}

Python SDK አስቀድሞ ረዳቶችን ያካትታል -

- Torii ማስረከቢያ፣ ሁኔታ፣ መጠይቅ እና የአስተዳዳሪ ፍሰቶች
- የተተየቡ መመሪያ ገንቢዎች ለጋራ ISI እና ጎራ-ተኮር ቅጥያዎች
- የግብይት ረቂቆች፣ ቴክኒካዊ መግለጫዎች፣ ፊርማ እና የተፈረመ የግብይት ውሂብ መያዣ የስራ ፍሰቶች
- የቀጥታ ክስተት ዥረቶች እና የተተየቡ ማጣሪያዎች; የተጠናቀቁ የብሎክ ዥረቶች የተሟላ ታሪክ ይሰጣሉ
- አጠቃላይ የ Kagemusha ዝግጁነት መዳረሻ እና Torii የደንበኝነት ምዝገባ ረዳቶች; የተተየቡ መሙያ እና መቤዠት ግንበኞች አይጋለጡም
- የመለያ አድራሻ፣ ሁሉም-አልጎሪዝም ፊርማ ረዳቶች፣ ባለብዙ ሃሽ ክብ ጉዞዎች፣ SM2፣ GOST፣ ML-DSA፣ BLS እና ሚስጥራዊ ቁልፍ አያያዝ
- URIs ን፣ ክፍለ-ጊዜዎችን፣ ክፈፎችን፣ ምስጠራ ረዳቶችን እና የመመዝገቢያ አስተዳዳሪን ያገናኙ
- አስተዳደር፣ የሶፍትዌር ማስፈጸሚያ አካባቢ ማሻሻል፣ Sumeragi፣ ኖድ-አስተዳዳሪ፣ SoraFS፣ UAID እና Kaigi API የመጨረሻ ነጥብ ሶፍትዌር አስማሚዎች ኖድ እነዚያን ባህሪያት የሚያጋልጥባቸው

## የላይኛው ማጣቀሻዎች {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

እነዚያ ፋይሎች በተሰካው የስራ ቦታ ክለሳ ውስጥ ላለው Python ወለል የእውነት ምንጭ ናቸው።
