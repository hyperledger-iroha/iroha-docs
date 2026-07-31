---
translation_locale: az
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Xüsusi təlimatlar {#iroha-special-instructions}

Biz haqqında danışarkən [necə Iroha fəaliyyət göstərir](/az/blockchain/iroha-explained), Biz demişdik ki, Iroha Xüsusi təlimatlar dünya dövlətinin dəyişdirilməsinin yeganə yoludır. Bu dərslikdəki dil təlimatlarını oxuduğunuzda, Artıq bir neçə təlimat gördünüz: `Register<Account>` və `Mint<Numeric>`.

Iroha Xüsusi təlimatların tam siyahısı:

|Təlimat |Təsvirlər |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Qeydiyyatdan çıxarmaq/Qeyri-qeydiyyatlaşdırmaq](#un-register) |Bir ID verilsin yeni bir qurum blockchain. |
| [Mint/Burn](#mint-burn) |"Mint/burn" saylı aktivlər və ya təkrarlamaları başlatmaq. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Blockchain obyektlərinin metadatalarını yeniləyin. |
| [SetParameter](#setparameter) |Zəncir genişliyi parametrini təyin edin. |
| [Grant/Revoke](#grant-revoke) |icazələr və rollar verin və ya çıxarın. |
| [Transfer](#transfer) |Mülkiyyət və ya aktiv dəyərinin köçürülməsi. |
| [Yerli depozit və aktivlər ](#native-escrow-and-asset-locks) |Saylı aktivləri protokol saxlamaqda kilidləyin. |
| [ExecuteTrigger](#executetrigger) |Başlatıcıları icra edin. |
| [Log/Custom/Upgrade](#other-instructions) |Sürüş vaxtı davranışını qeyd edin, uzatın və ya təkmilləşdirin. |

Iroha Xüsusi Təlimatların ümumiləşdirilməsi ilə başlayaq; hər təlimat üçün hansı obyektlər çağırıla bilər və hər bir obyekt üçün hansı təlimatlar mövcuddur.

## Qeydiyyat {#summary}

Hər bir təlimat üçün bu təlimatın icra edilə biləcəyi obyektlərin siyahısı var. Məsələn, köçürmə variantları mülkiyyətli nəşriyyat obyektlərini və rəqəmli aktivləri əhatə edir, mining isə rəqəmsal aktivləri ələ keçirir və təkrarlamaları başlatır.

Bəzi təlimatlarda məqsədin müəyyən edilməsi tələb olunur. Məsələn, aktivləri köçürsəniz, onları hansı hesabda köçürəcəyinizi həmişə göstərməlisiniz. Digər tərəfdən, bir şeyi qeydiyyatdan keçirərkən yalnız qeydiyyatda saxlamaq istədiyiniz obyektə ehtiyacınız olur.

|Təlimat |Əşyalar |Məqsəd |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |Adətənki domen, məlumat məkanı və hesab adı qurma |                      |
| [Qeydiyyatdan çıxarmaq/Qeyri-qeydiyyatlaşdırmaq](#un-register) |Hesabatlar, aktivlərin tərifləri, NFTs, rollar, tetiklər, həmyaşıdlar; domen çıxarılması |                      |
| [Mint/Burn](#mint-burn) |rəqəmsal aktivlər, təkrarlamaları başlatmaq |hesablar və ya tetiklər |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[metadata](./metadata.md) malik olan obyektlər: domenlər, hesablar, aktiv tərifləri, NFTs, RWAs, tetikləyici |                      |
| [SetParameter](#setparameter) |zəncir parametrləri |                      |
| [Grant/Revoke](#grant-revoke) | [rolu, icazə nömrələri](/az/blockchain/permissions.md) |Hesablar və ya rollar |
| [Transfer](#transfer) |domenlər, aktiv tərifləri, rəqəmsal aktivlər, NFTs |Hesabatlar |
| [Yerli depozit və aktivlər ](#native-escrow-and-asset-locks) |rəqəmsal vəsait əmanətləri, aktivlər bağlamaları, anonim vəsait əmanı öhdəlikləri |Alıcılar, istiqamətlər və ya mübahisə bölünmələri |
| [ExecuteTrigger](#executetrigger) |başlatıcılar|                      |
| [Log/Custom/Upgrade](#other-instructions) |loglar, icraçı xüsusi paylı yüklər, icraçının yüksəldilməsi |                      |

ISI -in toxunduğu nəşr obyekti baxımından başqa bir baxış yolu da var:

|Hədəf |Təlimatlar |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Hesab |Hesabların qeydiyyatdan çıxarılması və qeydiyyata alınması, aktivlərin qəbul edilməsi, hesabın metadatalarının yenilənməsi, icazələrin verilməsi və ləğv edilməsi və rolları |
|Domain |domenlərin qurulmasını təmin etmək, domenləri qeydiyyatdan çıxarmaq, domen mülkiyyətini köçürmək, domen metadatalarını yeniləmək |
|Mülkiyyətin təyinatı|qeydiyyatdan çıxarma tərifləri, mülkiyyətin ötürülməsi, metadata yeniləmə |
|Mülkiyyət|Ədəd miqdarı, köçürülmə miqdarı |
|Əmanət götürülməsi|göndərilən ödənişi açmaq, qəbul etmək, qeyd etmək, buraxmaq, ləğv etmək, mübahisə aparmaq, həll etmək, çıxarmaq və ya yerli saxlama sənədlərini bitirmək.|
|NFT |qeydiyyatdan çıxarma NFTs, mülkiyyətin ötürülməsi, meta məlumatların yenilənməsi |
|RWA |partiyaların qeydiyyatına alınması, miqdarın köçürülməsi, saxlanılması/azad edilməsi, dondurulması/dondurulmaması, əvəz olunması, birləşdirilməsi, metadata və nəzarətlərin yenilənməsi |
|Trigger |qeydiyyatdan çıxarmaq/qeydiyyatdan çıxartmaq, mint/burning trigger təkrarlamaları, execut trigger, update trigger metadataları |
|Dünya |qeydiyyatdan çıxarmaq / qeydiyyata alınmayan həmyaşıdlar və rollar, parametrləri təyin etmək, icraçını yüksəltmək |

## CLI nümunələr {#cli-examples}

Bu səhifədəki nümunələr, əvvəlcədən yerli müştəri konfigurasiyasına qarşı yuxarı axını Iroha iş məkanından əmrləri icra etdiyinizi güman edir:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

`iroha` ikili quraşdırdığınız təqdirdə, bunun əvəzinə `iroha --config ./defaults/client.toml` istifadə edin. Aşağıda yer tutanları şəbəkənizdən olan dəyərlərlə əvəz edin:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

İctimaiyyətə hədəfləndikdə Taira testnet, istifadə a Taira Müştəri konfigurasiyası. ödənişli nümunələri çalışdırmadan əvvəl, faucet köməkçisini [Testnet əldə edin XOR ilə Taira](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) kimi `taira_faucet_claim.py`, sonra da iddia testnet XOR qabdan:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Qanaqdan maliyyələşdirilən aktiv görünmədikdən sonra əməliyyatları yazmaq üçün tələb olunan qaz aktivinin metadatalarını əlavə edin:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` domenlərin və onların SNS icarə dairələrinin yaradılması üçün adi ilk buraxılış yoludur. Bu, dəqiq məlumat məkanını, sahibini, icarə müddəti və qiymət mühafizəsini bəyanatlı olaraq bağlayır, sonra bütün tələb olunan vəziyyəti atomik şəkildə yaratır və ya təmir edir. Məlum olan `POST /v1/aliases/setup/plan` son nöqtəsini və ya uyğunlaşan CLI iş axını istifadə edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Məqsəd və plan sirrsizdir, lakin addım əlamətləri tətbiq edir və qurulmuş hesabla adi bir əməliyyat təqdim edir. Bir plan onun zəncirinə, səlahiyyətinə, canlı dövlət ancoruna və müddətə bağlıdır; heç vaxt başqa şəbəkədə yenidən istifadə etməyin.

## (Un) qeydiyyat {#un-register}

Qeydiyyat və qeydiyyatdan kənarlaşdırma ID verilməsi üçün istifadə olunan təlimatlardır.

Qeydiyyatdan keçirilə bilən hər şey həm `Registrable` və `Identifiable`dir, amma `Identifiable` olan hər şey `Registrable` deyil. Əksər şeylər birbaşa qeydiyyatdan keçirilir, lakin bəzi hallarda blok zincirindəki təmsilçiliyin daha çox məlumatı var. Təhlükəsizlik və performans səbəbləri üçün bu cür məlumat strukturları üçün quruculardan istifadə edirik (məsələn `NewAccount`), həmyaşıd qeydiyyatı xüsusi bir mülkiyyət sübutu təlimatına malikdir. Bir qayda olaraq, qeyd edilə bilən hər şey də qeydiyyatsız ola bilər, amma bu sərt və sürətli bir qayda deyil.

Hesablar, aktiv tərifləri, NFTs, həmyaşıllılar, rollar və tetiklər qeydiyyatdan keçirə bilərsiniz. Domen quruluşu `EnsureAlias` istifadə edir; xam `Register::Domain` pay yükü genesis / bootstrap üçün ayrılır. Tərəfdaş qeydiyyatı `RegisterPeerWithPop` istifadə edir ki, həmyaşılı açarın sahiblik sübutunu daşıyır. Birlik adlarına qoyulan məhdudiyyətlər haqqında öyrənmək üçün [ adlandırma konvensiyalarımızı](/az/reference/naming.md) yoxlayın.

RWA partiyaları xüsusi `RegisterRwa` təlimatı vasitəsilə yaradılır. mövcud kod `UnregisterRwa` təlimatını açıqlamır; təsvir olunan miqdarı geri çəkmək üçün `RedeemRwa` istifadə edin.

::: məlumat

Qeyd edək ki, [genesis blokunuzu](/az/guide/configure/genesis.md) `genesis.json`da necə qurmağı qərar verdiyindən asılı olaraq (müəyyən olaraq icazə simvollarının qeydiyyatı daxil olub-olmamasından asılı olaraq), hesabın qeydiyyata alınması prosesi çox fərqli ola bilər. Ümumiyyətlə, onu belə bir şəkildə qısaca izah edə bilərik:

- İctimai blok zincirdə hər kəs hesab yaza bilər.
- Şəxsi blok kateqoriyada hesabların qeydiyyatı üçün unikal bir proses ola bilər. Tipik xüsusi blok kateqoriyada, yəni hesabların qeydiyyata alınması üçün heç bir unikal proses olmayan blok kateqoriyalarında başqa bir hesabı qeyd etmək üçün bir hesab lazımdır.

Biz [ özəl və ictimai blok zincirləri ](/az/guide/configure/modes.md) müqayisə edərkən bu fərqlər haqqında ətraflı danışırıq.

:::

::: məlumat

Bir həmyaşıdın qeydiyyatı, hazırda şəbəkəyə orijinal etibarlı həmyaşıddan olmayan həmyaşıdı əlavə etmək üçün yeganə yoldur.

:::

Bir blok zincirində obyektlərin qeydiyyatı prosesindən keçmək üçün dilə aid təlimatlardan birinə baxın:

|Dil |Təlimat |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Domenləri qurmaq və hesabları və aktivləri qeyd etmək üçün [Iroha CLI](/az/get-started/operate-iroha-via-cli.md) istifadə edin. |
|Rust |[Rust təlimatını istifadə edin ](/az/guide/tutorials/rust.md). |
|Kotlin/Java |[Kotlin/Java təlimatından istifadə edin ](/az/guide/tutorials/kotlin-java.md). |
|Python |[Python təlimatını istifadə edin ](/az/guide/tutorials/python.md). |
|JavaScript/TypeScript |[JavaScript/TypeScript təlimatını istifadə edin ](/az/guide/tutorials/javascript.md).|

Adətənki domen quruluşunu planlaşdırın və tətbiq edin, sonra artıq lazım olmadıqda domeni qeydiyyatdan çıxarın:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Qeydiyyat və qeydiyyata alınmayan hesablar:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Qeydiyyat və qeydiyyata alınmayan aktivlərin tərifləri:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Qeydiyyatdan və qeydiyyata alınmadan NFTs. NFT qeydiyyat onun məzmununu oxuyur JSON Standart girişdən:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Qeydiyyat və qeydiyyata alınmayan vəzifələr:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Trigger qeydiyyatı tələbləri ya tərtib edilmişdir IVM Bytecode və ya seriallaşdırılmış təlimat siyahısı. `Log` təlimatları ilə CLI və onu tetikləyici qeydiyyatına gətirir:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

BLS açarını və PoP açarını `kagami` ilə istehsal edin, əgər sizdə hələ yoxdursa:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Mint/Burn {#mint-burn}

Çıxma və yandırma saylı aktivlərə aid ola bilər və təkrarların məhdud sayı ilə tetiklənir. Bəzi aktivlər çırpılmaz olaraq bəyan edilə bilər, yəni qeydiyyatdan sonra yalnız bir dəfə çırpıla bilər.

Əmlaklar müəyyən bir hesabda, adətən ilk növbədə aktivin qeydiyyata alınması üçün qeydə alınıb. Mülkiyyət miqdarları mənfi deyil, buna görə heç vaxt `$-1.0` bir aktivə sahib ola bilməzsən və ya mənfi məbləği yandırıb mint ala bilməzsən.

Bir blok zincirində aktivlərin qazılması prosesindən keçmək üçün dilə aid təlimatlardan birinə baxın:

- [CLI](/az/get-started/operate-iroha-via-cli.md)
- [Rust](/az/guide/tutorials/rust.md)
- [Kotlin/Java](/az/guide/tutorials/kotlin-java.md)
- [Python](/az/guide/tutorials/python.md)
- [JavaScript/TypeScript](/az/guide/tutorials/javascript.md)

Burda yanmış aktivlərin nümunələri var:

- [CLI](/az/get-started/operate-iroha-via-cli.md)
- [Rust](/az/guide/tutorials/rust.md)

"Mint" və "burn" sayı aktivləri:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Mint və yanma tetikləyici təkrarlamaları:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Transfer {#transfer}

Transferlər hesablar arasında mülkiyyət və ya dəyər köçürülür. və NFTs. RWA miqdarı hərəkət xüsusi istifadə edir `TransferRwa` və `ForceTransferRwa` Məlumatda təsvir edilən təlimatlar [Əsl dünya aktivləri](/az/blockchain/rwas.md).

Bunun üçün hesab verilməlidir. [aktivlərin köçürülməsinə icazə](/az/reference/permissions.md). Əməliyyat vasitələri ilə aktivlərin köçürülməsi barədə bir nümunəyə baxın. [CLI](/az/get-started/operate-iroha-via-cli.md) və ya [Rust](/az/guide/tutorials/rust.md).

Saylı aktivlərin köçürülməsi:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Transfer domeni, aktiv tərifi və NFT mülkiyyət:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Məlum vəsaitlərin qapanması {#native-escrow-and-asset-locks}

Native escrow instructions lock numeric assets in ledger-managed protocol custody. Onlar bazar üslubunda hesablaşma, ümumi aktivlər kilidləri və anonim qorunmuş escrow axınları üçün istifadə olunur.

Marketplace escrow istifadəsi `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, və `ResolveEscrowDispute`. Ümumi aktivlər qapaqlarının istifadəsi `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, və `ExpireAssetLock`. Anonymous escrow bazarın həyat dövrünü əks etdirir `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, və `ResolveAnonymousEscrowDispute`.

Bu ISIs hazırda birinci dərəcəli CLI əmrlərinə malik deyil. Tiplənmiş SDK qurucularından və ya seriyalı təlimat yüklərindən istifadə edin və həyat dövrü detalları, icazələr, sorğular, hadisələr və Rust nümunələri üçün [Native Asset Escrow](/az/blockchain/escrow.md) baxın.

## Grant/Revoque {#grant-revoke}

Müdafiə və ləğv təlimatları [ icazələr və rollar üçün istifadə olunur ](permissions.md).

`Grant` istifadəçiyə tək icazə və ya bir qrup icazə vermək üçün davamlı olaraq istifadə olunur ("roll"). Verilən rollar və icazələr yalnız `Revoke` təlimatı ilə aradan qaldırıla bilər. Beləliklə, bu təlimatları diqqətlə istifadə etmək lazımdır.

Hesabda rol vermək və ləğv etmək:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

İzin verilməsi və ləğv edilməsi üçün icazə simvolları. İzin əmrləri standart girişdən bir icazə obyekti oxuyur:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Bir rol üçün icazə ver və ləğv et:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Bu təlimatlar obyekti [metadata](/az/blockchain/metadata.md) yeniləyir. Metadata girişini daxil etmək və ya əvəz etmək üçün `SetKeyValue` istifadə edin və birini silmək üçün `RemoveKeyValue` istifadə edin.

Metadata `set` əmrləri standart girişdən JSON dəyərini oxumuşdur:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Hesablar, aktivlər tərifləri, NFTs, RWAs üçün eyni nümunə mövcuddur və tetikləyici:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` aktiv məlumat modeli və icraçısı tərəfindən aşkar edilmiş şəbəkə boyu parametrləri dəyişir.

Standart girişdə yalnız bir parametr JSON obyektini keçərək bir parametr təyin edin:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Bu təlimat [ triggerləri ](./triggers.md) icra etmək üçün istifadə olunur.

İndiki CLI başlatıcıları qeyd edə və başlatıcı icra hadisələrini birbaşa abunə ola bilər. `execute trigger` əmr, beləliklə bir təlimat təqdim etmək üçün `ExecuteTrigger` təlimat, seriallaşdırılmış bir istehsal `InstructionBox` bir SDK və ya icra vasitəsi və nəticəsində keçmək JSON arşivi keçmək `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Digər təlimatlar {#other-instructions}

Iroha həmçinin iş vaxtı və icraçı inteqrasiyası üçün aşağı səviyyəli təlimatları açıqlayır:

- `Log`: icra olunarkən qeydə alınmış bir giriş buraxın
- `CustomInstruction`: icraçıya aid olan JSON pay yükləri daşın
- `Upgrade`: icraçı təkmilləşdirməni aktivləşdirin

`Log` təlimatını ping köməkçisi ilə təqdim edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Seriallaşdırılmış `InstructionBox` olaraq xüsusi icraçı təlimatını təqdim edin. Faydalı yük şəklini icraçı xüsusi edir, buna görə də təlimatı uyğunlaşdıran SDK və ya icraçı alətləri ilə istehsal edin:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Yükləyici IVM bytecode faylından yüksəltmək:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
