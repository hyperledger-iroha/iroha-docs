---
translation_locale: az
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

Yuxarı axın iş sahəsindəki Python SDK `iroha-python` səviyyəsindədir. İlk Iroha 3 buraxılışı cari Torii və Norito səthlərini hədəfləyir. Paket versiyasını və ya inteqrasiyanız tərəfindən istifadə olunan mənbə tənzimləməsini sabitləyin ki, SDK və node eyni seriyalaşdırma formatının versiyasında qalsın.

Aşağıdakı anonim oxu nümunələri `https://taira.sora.org` ünvanındakı ictimai Taira-nı hədəfləyir. Marşrut yalnız oxumaq üçün olsa belə kanonik hesab imzası və ya məhz həmin şəbəkənin operator imzası tələb edə bilər; belə nümunələr ayrıca işarələnib. Vəziyyəti dəyişən nümunələr əməliyyat şablonlarıdır və göndərilməzdən əvvəl həqiqi Taira səlahiyyət sahibi, şəxsi açar, tipli ödəniş niyyəti, kifayət qədər testnet XOR və hədəf marşrutun tələb etdiyi autentifikasiya lazımdır.

Nümunələri bu ardıcıllıqla istifadə edin:

|Səhnə|İctimayətə qarşı qaçın Taira?|Sizə lazım olan|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Anonim oxunmuş zənglər| Bəli |Python paket və şəbəkə girişi|
|Hesab və ya operator tərəfindən təsdiqlənmiş oxumalar|Yalnız özünüzün etiraf etdiyi kimliklə|Dəqiq Taira `NetworkId` və müvafiq hesab və ya operator açarı|
|Yerli imzalama və təlimat qurucuları| `submit()`-ə qədər şəbəkə zəngi yoxdur|Yerlik uzantı və açar materialınız|
|Dəyişən əməliyyatlar və xidmət çağırışları|Yalnız öz maliyyələşdirilmiş hesabınızla|səlahiyyət verən əsas hesab, şəxsi açar, dəqiq Taira `NetworkId`, yazılı ödəniş niyyəti, ödəniş aktivinin balansı və marşrut tokenləri|
|Çərçivə kodeklərini, kripto və GPU köməkçilərini qoşun|Yalnız yerli|Yerli uzantı; GPU köməkçilərin də CUDA-bacarıqlı bir backend-ə ehtiyacı var|

## Quraşdır {#install}

Paket metadatasının adı `iroha-python`-dir. Qeyri-sabit PyPI quraşdırmanın canlı Taira şəbəkəsi ilə uyğun olduğunu fərz etməyin. İntegration hədəflədiyiniz eyni yuxarı axın versiyasından qurulmuş wheel və ya mənbə kodu işləyən nüsxəsini quraşdırın:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Əgər layihəniz yuxarıdakı iş sahəsini birbaşa istifadə edirsə, nümunələri işə salmazdan əvvəl Python asılılıqlarını quraşdırın və yerli genişləndirməni yaradın, hansı ki `Instruction`, `TransactionDraft` istifadə edir. imzalama, kripto, SoraFS yerli köməkçilər, GPU köməkçilər və ya Connect frame kodekləri. Upstream `python/iroha_python/README.md` tərəfindən qurma əmrdən istifadə edin, sonra yerli ixracların yükləndiyini yoxlayın:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Əgər `create_torii_client` idxal edilirsə, lakin `Instruction` və ya `generate_ed25519_keypair` uğursuz olursa, təmiz Python paketi mövcuddur, lakin yerli genişləndirilmə yoxdur.

## Tez Başlanğıc {#quickstart}

İctimai, yalnız oxumaq üçün Taira API son nöqtələrlə başlayın:

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

## Paylaşılan Quraşdırma {#shared-setup}

Bu quruluşu dəyişən şablonlar üçün istifadə edin. Tətbiq etməzdən əvvəl hər bir yer tutucunu Taira səlahiyyət prinsipi, şəxsi açar, token və aktiv/hesab ID-ləri ilə əvəz edin.

`authority` əməliyyatı imzalayan hesablardır və `private_key` onunla uyğun olmalıdır. Əməliyyatlar Taira-ün dəqiq genetik mənşəli `NetworkId`-inə bağlanır; zəncir UUID tətbiq etiketidir, əməliyyat şəxsiyyəti deyil. Ödənişlər tətbiq metadatasından asılı olmayaraq yazılı ödəniş niyyəti və dəqiq canlı təklifdən istifadə edir. Aşağıdakı hesab və açar yerləri qəsdən etibarsızdır ki, təsadüfən göndərilməsin.

Aşağıdakı literalla mövcud sabitlənmiş Taira blokçeyn başlanğıc şəxsiyyətidir. Testnet sıfırlaması bunu dəyişə bilər, buna görə onu imzalanmış yerləşdirmə profilindən yeniləyin və onu UUID zəncirindən heç vaxt çıxarmayın.

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

`Instruction.*` yalnız konstruksiya təlimatı yüklərini çağırır. `submit()` isə SDK-ün canlı ödəniş qiymət təxminini götürdüyü, dəqiq təklif edilmiş yükləni imzaladığı, onu Torii-yə göndərdiyi və vəziyyəti gözlədiyi nöqtədir.

## Ödənişlər və əməliyyatın həyata keçirilmə xərcləri {#fees-and-gas}

Yazma əməliyyatları üçün yazılmış `FeePaymentIntent` və maliyyələşdirilmiş ödəniş aktiv balansı tələb olunur. Taira üzərində, ictimai testnet maliyyələşdirmə xidməti testnet XOR-ü maliyyələşdirir. Python SDK sabit imzasız göndərir dəqiq ödəniş qiymət təxminatı üçün Torii ünvanına verilən yükləmə, təklifin ödəyəni və ya yükləməni əvəz etmədiyini təsdiqləyir və təklif olunan niyyəti imzalayır. Ödəniş seçimini əməliyyat metadatasına daxil etməyin.

Yuxarıdakı `submit()` köməkçisi, ödəniş limitləri qəsdən boş olan əməliyyat imzalama hesabı niyyəti ilə başlayır. `quote_and_sign()` imzalamadan əvvəl onları canlı təklifdən doldurur:

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

Yazıları göndərmədən əvvəl səlahiyyətli əsas hesabın kifayət qədər ödəniş aktivinə sahib olduğundan əmin olun. Dəqiq testnet maliyyələşdirmə xidməti və aktiv identifikatoru şəbəkəyə xasdır; bu, Taira formasındadır:

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

Testnet maliyyələşdirmə xidməti balansın yoxlanması üçün istifadə olunan konkret `asset_id` qaytarır. Canlı təklifin `FEE_ASSET_DEFINITION` ödəniş etdiyini təsdiqləyin; əməliyyat metadatalar vasitəsilə həmin aktiv seçilmir.

Proqram tətbiqi metadata-i ixtiyari xarakter daşıyır və heç bir ödəniş semantikasına malik deyil:

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

Əgər siz ödəniş niyyətini buraxsanız, gözlənilməz aktiv üçün təklif qəbul etsəniz, təklif verdikdən sonra yükü dəyişdirsəniz və ya maliyyələşdirilməmiş hesabla imzalasanız, əməliyyat göndərilməməlidir.

## Anonim Taira Oxuyur {#anonymous-taira-reads}

Bu çağırışlar, kataloq sərhədi anonim oxumağa icazə verdiyi Taira marşrutlarından istifadə edir:

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

`/v1/time/status` və hər bir `/v1/sumeragi/*` operator nöqtə-vaxt məlumat görünüşü, vəziyyəti dəyişdirməsələr belə, dəqiq şəbəkə operatoru imzası tələb edir. Anonim düyün üçün `request_json("GET", "/status")`-dən istifadə edin status yükü və operator parametrləri aşağıdakı kimi konsensus və ya node-lokal saat diaqnostikası üçün. Sessiya statusuna qoşulma ayrı bir protokol yolu olub, həmin sessiyanın idarəetmə tokenini tələb edir.

## Təlimat Qurucuları {#instruction-builders}

SDK ən ümumi təlimat ailələri üçün tipli qurucuları və hələ birinci dərəcəli Python metodlar olmayan variantlar üçün JSON qaçış qapısını təqdim edir. Aşağıdakı parçalar dəyişən əməliyyat şablonlarıdır və ictimai Taira-ə imza hesabı olmadan təqdim edilməyib.

Mövcud olduqda yazılı köməkçiləri üstün tutun: onlar Python dəyərlərini normallaşdırır və düzgün olmayan şəkillərdə erkən uğursuz olurlar. Yalnız hələ Python köməkçisi olmayan təlimat variantına ehtiyacınız olduqda `Instruction.from_json`-dən istifadə edin.

|Təlimat ailəsi|Python səth|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Qeydiyyatdan keçmək| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap alətləri üçün nəzərdə tutulub|
|Qeydiyyatdan çıxmaq| `unregister_trigger`; digər variantlar üçün `Instruction.from_json`-dən istifadə edin|
|Çıxar/Əlavə et| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`|
|Köçürmə| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Metaməlumat və nəzarətlər| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
|RWA həyat dövrü| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger                                                                                 | `execute_trigger`|
|Repo/hesablaşma uzantıları|`repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`|
| Yerli aktiv kilidləri| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, əlavə olaraq müştəri `*_and_wait` köməkçiləri|
|Təqdim et/Geri al, SetParameter, Qeyd, Xüsusi, Yeniləmə və daha az yayılmış qeydiyyat/qeydiyyatdan çıxarma variantları|`Instruction.from_json` və ya `TransactionBuilder.add_instruction_json` tək protokol-standart `InstructionBox` JSON ilə|

Escrow tipli şərti ödənişlər üçün baxın [Yerli Aktiv Depoziti](/az/blockchain/escrow.md#python-asset-locks). Python hazırda ümumi aktiv kilidləri üçün birinci dərəcəli köməkçiləri təqdim edir; bazar və anonim escrow köməkçiləri hələ birinci dərəcəli Python metodlar deyildir.

### Domenləri qurun, sonra hesabları və aktivləri qeydiyyatdan keçirin {#set-up-domains-then-register-accounts-and-assets}

Adi domen yaradılması deklarativ təxəllüs planlayıcısından keçir, beləliklə SNS icarə, sahiblik imkanları, ödəniş-qiymət doğrulama qoruyucusu və domen vəziyyəti birlikdə yoxlanılır. SDK və ya onboarding xidmətiniz ilə gizli-sız `AliasSetupPlanRequestV1` niyyət yaradın, sonra `iroha app alias setup plan` və `iroha app alias setup apply` istifadə edin. Tətbiq əməliyyatından `Instruction.register_domain` təqdim etməyin; o qurucu genesis/bootstrap alətləri üçün qalır.

Domen quruluşu planı yekunlaşdıqdan sonra, domenə aid obyektləri qeydiyyatdan keçirin. Taira kimi paylaşılan şəbəkədə, sizə təyin edilmiş domen və hesab adları məkanından istifadə edin.

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

`mintable` verilənlər modeli tərəfindən qəbul edilən `Infinitely`, `Once`, `Not` və ya `Limited(n)` dəyərləri qəbul edir. Məhdudiyyətsiz rəqəmsal aktiv üçün `scale`-i buraxın.

### məsələ, məhv etmək və Aktivləri Köçürmək {#mint-burn-and-transfer-assets}

Bu çağırışlar mövcud aktiv ID-dən istifadə edir. Əvvəlcə aktiv tərifini qeydiyyatdan keçirin, sonra aktivin sahibi olan hesab üçün konkret aktiv ID-ni yaradın.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Mülkiyyətin Köçürülməsi {#transfer-ownership}

Mülkiyyətin ötürülməsi domenin, aktivin təyinatını və ya NFT-ı kim idarə etdiyini dəyişdirir. Əməliyyatın icazə verən əsas şəxsi kimi hazırkı sahibini istifadə edin.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Metadataları təyin et və sil {#set-and-remove-metadata}

Metaməlumat dəyərləri JSON-serializə edilə bilməlidir. Siz `TransactionDraft`-dan istifadə etdikdə, `TransactionConfig`-dəki səlahiyyətləndirmə prinsipi standart hədəf hesabı olur.

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

Yüksək səviyyəli layihə köməkçisi standart olaraq əməliyyat səlahiyyət verən əsasını hədəfləyir:

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

### Real Dünya Aktivləri {#real-world-assets}

RWA köməkçilər aktiv-özəl metadata, mənşə və nəzarətçi siyasəti üçün JSON-serializable yükdən istifadə edir. `register_rwa` `id` və ya `owner` qəbul etmir: proqram təminatının icra mühiti `RwaId` yaradır və əməliyyatın təsdiq prinsipi ilkin sahibi olur.

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

Qeydiyyat əməliyyatı tamamlandıqdan sonra yaradılmış ID-ni tapmaq üçün `FindRwas`, `/v1/rwas`, bir RWA hadisəsi və ya tədqiqat marşrutu istifadə edin:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Sonrakı əməliyyatlar yaradılmış `hash$domain` ID-dən istifadə edir:

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

Tam transferlər mövcud lotda `owned_by`-ı dəyişə bilər. Qismən transferlər və birləşmələr yaradılmış uşaq lotları yaradır.

### Səbəblər {#triggers}

İcra edilən fayl başqa bir təlimat ardıcıllığı olduqda trigger qeydiyyatı köməkçilərindən istifadə edin:

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

Torii həmçinin trigger inventarizasiyası üçün REST köməkçilərini təqdim edir:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Trigger inventar çağırışları yalnız trigger qeydlərini oxuyur və ya yoxlayır. Qeydiyyat, icra, təkrar dəyişiklikləri və qeydiyyatdan silmək dəyişən əməliyyatlardır.

### Repo və maliyyə əməliyyatlarının həyata keçirilməsi təlimatları {#repo-and-settlement-instructions}

Repo və ikitərəfli-hesabat köməkçiləri sahəyə xas təlimat variantlarını əl ilə hazırlanmış Norito yükləri olmadan əlavə edirlər:

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

### JSON Təcavüz Çıxışı {#json-escape-hatch}

Bir Python köməkçi mövcud olmadıqda, tək protokol-standart məlumat modeli `InstructionBox` JSON daxil edin `Instruction.from_json`. Bu tövsiyə olunan yoldur `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, şəbəkə həmkarı/rol/NFT qeydiyyatı və köməkçilər yazılana qədər tetikleyici olmayan qeydiyyatdan çıxma variantları.

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

Nüsxələnmiş layihə yolunu əməliyyat sərhədində saxlayın: bu, dəqiq `NetworkId`, ödəniş niyyəti və imzadan əvvəlki qiymət dəyişməzliyini qoruyur. Birbaşa `TransactionBuilder` istifadəsi eyni dəyərləri və əlavə olaraq canlı qiymətin açıq təsdiqini tələb edir, buna görə də bu, tətbiq kodu üçün qısa yol deyil.

Yaradılmış və ya qeyri-müəyyən təlimatlar üçün, test nümunələrini saxlamağa başlamazdan əvvəl JSON vasitəsilə gediş-gəliş edin:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Əməliyyat İş Axınları {#transaction-workflows}

`TransactionDraft` -u birdən çox təlimat hazırlayan tətbiqlərdə istifadə edin. Sənəd layihəsi sizə `ttl_ms`, `nonce` və metadat kimi əməliyyat səviyyəsindəki parametrləri bir yerdə saxlamağa və sonra bir dəfə imzalamağa imkan verir:

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

Baxış, audit və ya cüzdanın təhvil verilməsi üçün deterministik texniki manifest ixrac edin:

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

Hədəf icra zolağı tələb etdikdə imzalamadan əvvəl icra zolağı məxfilik sübutunu əlavə edin:

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

## Sorğular {#queries}

Yazılmış sorğu köməkçiləri xam JSON lüğətlər əvəzinə dataklasslar qaytarır. Onlar başlamaq üçün ən asan yoldur, çünki SDK sizin üçün səhifələməni və ümumi qeyd sahələrini ayırır:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii API son nöqtəsi hələ tipli proqram təminatı adapterinə malik olmadıqda ümumi sorğu köməkçilərindən istifadə edin:

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

Hesab inventar köməkçiləri SDK tərəfindən qəbul edilən hesab identifikatorunu tələb edir. Tək protokol-standartlı I105 hesab ID-lərindən və ya zəncirdəki təxəllüslərdən istifadə edin; Əgər bir blok vasitəçisi və ya xam API son nöqtəsi SDK tərəfindən rədd edilən bir ID qaytarırsa, bu köməkçiləri çağırmadan əvvəl onu tək bir protokol-standart hesab ID-sinə həll edin:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Hadisələr {#events}

Axın köməkçiləri standart olaraq JSON məlumatlarını deşifrə edir. `with_metadata=True`-ı ötürün, əgər sizə SSE hadisə adı, identifikatoru, təkrar cəhd göstəricisi və xam məlumat lazım olsa. Yalnız bir protokol-standart `/v1/events/sse` feed canlıdır: o, heç bir təkrar oynatma ID-si göndərmir və heç bir təkrar oynatma jurnalı saxlamır, buna görə bu köməkçilər heç bir kursor və ya davam arqumenti təqdim etmir. Yenidən qoşulma yeni abunəliyi başlayır və boşluq ola bilər; Tam blok zənciri dəftər tarixçəsi tələb olunduqda məlum bir hündürlükdən `/v1/blocks/stream` istifadə edin. Bu nümunələr canlı hadisələri gözləyir, buna görə onları axın aktiv və aktiv olan bir node-a qarşı işlədin.

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

## Açarlar və Ünvanlar {#keys-and-addresses}

SDK yerli imzalama köməkçilərini yerli uzantıya yığılmış hər imza alqoritmi üçün təqdim edir. Bu köməkçilər Taira çağırmır, lakin onlar yerli uzantıya ehtiyac duyurlar:

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

`supported_crypto_algorithms()`-dan istifadə edərək təkərinizin nələri dəstəklədiyini görün. Ümumi köməkçilər tək protokol-standart alqoritm etiketlərindən istifadə edir və Ed25519, secp256k1, ML-DSA, GOST, BLS və SM2 üçün işləyir, bu alqoritmlər tərtib edildikdə:

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

### Çin SM Kriptoqrafiya {#chinese-sm-cryptography}

Python SDK həm ümumi SM2 köməkçilərini, həm də SM2-xüsusi rahatlıq köməkçilərini ortaya qoyur. Hədəf şəbəkə tərəfindən gözlənilən SM2 fərqləndirici identifikatoru seçmək üçün node imkan reklamından istifadə edin:

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

`crypto.sm.enabled` sizə nodun cari siyasətində SM-ailə alqoritmlərini qəbul edib-etmədiyini bildirir. Eyni elan SM kriptoqrafik xəş siyasəti və sürətləndirmə vəziyyətini də əhatə edir ki, bu da SM2-xüsusi axınları aktivləşdirib-aktivləşdirməməyi qərarlaşdırarkən faydalıdır:

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

Təsdiqlənmiş imkan yükünü yerləşdirilmiş node üçün səlahiyyətli kimi qəbul edin. `crypto.sm.enabled` doğru olmadıqca və elan edilmiş imzalama siyasəti buna icazə vermədikcə SM2-imzalı əməliyyatı təqdim etməyin.

### GOST və Post-Kvant Açarları {#gost-and-post-quantum-keys}

Ümumi kripto API-dən GOST R 34.10-2012 parametr dəstləri və ML-DSA (`ml-dsa`) kvantdan sonrakı imzalar üçün istifadə edin. Eyni açar-cüt obyekt imzalama, yoxlama və çoxhash ixracını idarə edir:

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

Qapı GOST və düyünün autentifikasiya edilmiş, tipli qabiliyyət elanında kvant sonrası axınlar:

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

Əgər bir node sizə lazım olan alqoritmi elan etmirsə, açarı yalnız lokal və ya oflayn iş axınları üçün istifadə edin. O alqoritmlə imzalanmış əməliyyatları həmin node-a göndərməyin. Ümumi Taira yoxlaması zamanı, GOST və ML-DSA yuxarı axın Python kitabxanasında SDK kripto köməkçiləri kimi mövcud idilər, lakin nod tərəfindən əməliyyat imzalama üçün elan edilmədilər.

## Konfiqurasiyanı nəzərə alan müştəri yaradılması {#config-aware-client-creation}

Tətbiqiniz fayldan node parametrlərini oxuyarkən, lakin hələ də mühitə və ya testə xas dəyişikliklərə ehtiyacı olduqda `resolve_torii_client_config` istifadə edin:

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

## Kagemusha Hazırlığı {#kagemusha-readiness}

Python SDK cari JSON hazırlıq marşrutunu onun ümumi Torii sorğu yardımçısı vasitəsilə sorğu edə bilər:

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

Python tipli Kagemusha balans artırma və ya geri alma arxiv generatorlarını açmır. Tək protokol-standart V4 arxivləri yaratmaq üçün tipli Swift və ya JVM pulqabısından istifadə edin, sonra onları dəstəklənən Kagemusha Torii klienti vasitəsilə göndərin və sorğu edin.

## Abunəliklər {#subscriptions}

Abunə oxumaları və layihə qurucuları `iroha_python.ToriiClient` tərəfindən istifadə olunan paylaşılmış Torii müştəridən miras alınır. Hər mutasiya bədənə bağlı tək bir şeylə qəbul edilir protokol-standart hesab imzası və imzasız əməliyyat layihəsini qaytarır. Torii heç vaxt şəxsi açarı qəbul etmir və layihəni sizin üçün təqdim etmir.

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

Hər dəqiq yükü və imzalama mesajını müvafiq hesabın lokal cüzdanına verin, orada tələb olunan əməliyyatı təsdiqləyin, imzalanmış əməliyyatı yığın və onu normal əməliyyat proqram təminatı işləmə iş axını vasitəsilə təqdim edin. Python SDK imzalama mesajının qaytarılan yüklənmiş məlumatın vahid protokol-standart kriptoqrafik hash olduğunu təsdiqləyir, lakin cüzdan imzalamadan əvvəl əməliyyatı deşifrə etmək və təsdiqləmək üçün məsuliyyətlidir.

## Qoşul {#connect}

Connect URIs-i yerli olaraq qurun və təhlil edin. Bir Connect identifikatoru SID-ni dəqiq `NetworkId`, tətbiq açıq açarı və kriptoqrafik nonce dəyəri ilə bağlayır:

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

Hədəf düyün Connect-i təqdim etdikdə yalnız həmin dəqiq önizləməni qeyd edin. Sessiyanın yaradılması rol-specific olan dörd daşıyıcı tokeni qaytarır. Hər-sessiya vəziyyəti marşrutu idarəetmə tokenini tələb edir; ümumi vəziyyət operator marşrutudur.

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

Təsdiq sonrası mesajları vəziyyətli sessiya ilə şifrələ:

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

## İdarəetmə, proqram təminatı icra mühiti və İdarəçi Səthləri {#governance-runtime-and-admin-surfaces}

İdarəetmə oxunuşları hesabla təsdiqlənir. [Paylaşılan Quraşdırma](#shared-setup)-dən olan səlahiyyət prinsipi və açar cütündən istifadə edərək hər bir köməkçi çağırışı Taira-nin dəqiq başlanğıc-əsaslı `NetworkId` ilə bağlayın:

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

Operator oxumaları üçün ayrıca bir müştəri yaradın. İcazə verilmiş operator açarını proqram icra mühitində yükləyin və onu Taira-nin dəqiq `NetworkId`-ına bağlayın; daşıyıcı tokenlər və `x-api-token` bu imzanı əvəz etmir:

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

İcra-vaxtı yeniləmə marşrutları operator tərəfindən təsdiqlənmiş təlimat qurucularıdır. Uğurlu təklif, aktivləşdirmə və ya ləğv cavabı `tx_instructions` qaytarır; bu, yeniləməni həyata keçirmir. O paketi normal imzalanmış əməliyyat və idarəetmə yolu ilə təqdim edin. Sabitlənmiş Python üsullar `propose_runtime_upgrade`, `activate_runtime_upgrade` və `cancel_runtime_upgrade` hazırda müştərinin `OperatorSigningContext` tətbiq edilmək əvəzinə sadə sorğular göndərir, buna görə bu təlim onları işlək operator axını kimi təqdim etmir.

## Status, Konsensus və Şəbəkə Telemetriyası {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID və Kaigi Köməkçilər {#sorafs-uaid-and-kaigi-helpers}

Bu köməkçilər hədəf düyün müvafiq Nexus/SORA API son nöqtələrini təqdim etdikdə mövcuddur. Boş siyahıları etibarlı cavab kimi qəbul edin: ictimai Taira nümunə texniki manifest və ya UAID üçün məlumat olmadan marşrutun aktiv ola bilər.

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

## Norito RPC və GPU Köməkçilər {#norito-rpc-and-gpu-helpers}

`NoritoRpcClient`-dan istifadə edin, əgər sizdə artıq Norito bayt varsa və Torii API ikili son nöqtəsini çağırmaq lazımdır. Nümunə əvvəlki əməliyyat şablonundan imzalanmış məlumat konteyneri tələb edir:

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

CUDA köməkçilər backend mövcud olmadıqda `None` qaytarırlar, beləliklə tətbiqlər skalar implementasiyalara keçə bilər:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Cari Əhatə {#current-coverage}

Python SDK artıq aşağıdakılar üçün köməkçiləri ehtiva edir:

- Torii təqdimat, vəziyyət, sorğu və inzibati axınlar
- ümumi ISI və sahəyə xas genişlənmələr üçün yazılmış təlimat yaradıcıları
- əməliyyat layihələri, texniki manifestlər, imzalama və imzalanmış əməliyyat məlumat konteyneri iş axınları
- canlı tədbir yayım və yazılmış filtrlər; yekun blok axınları tam tarixçəni təmin edir
- genel Kagemusha hazırlıq girişi və Torii abunə köməkçiləri; tiplənmiş balans doldurma və geri alım yaradıcıları açıq deyildir
- hesab ünvanı, bütün-alqoritm imzalama köməkçiləri, çoxhash dövrü səyahətlər, SM2, GOST, ML-DSA, BLS, və məxfi açar idarəsi
- URIs-ə, sessiyalara, ramklara, şifrələmə köməkçilərinə və qeyd dəftərinin admininə qoşul
- idarəetmə, proqram təminatının icra mühiti yeniləməsi, Sumeragi, node-admin, SoraFS, UAID və Kaigi API son nöqtə proqram təminatı adapterləri, burada node bu xüsusiyyətləri göstərir

## Yuxarı Axın İstinadları {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

O fayllar, bərkidilmiş iş sahəsi redaksiyasında Python səthi üçün həqiqət mənbəyidir.
