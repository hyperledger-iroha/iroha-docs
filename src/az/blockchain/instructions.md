---
translation_locale: az
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Təlimat əməliyyatları {#iroha-special-instructions}

Biz [Iroha necə işləyir](/az/blockchain/iroha-explained) haqqında danışanda, Iroha Təlimat əməliyyatlarının dünya vəziyyətini dəyişdirməyin yeganə yolu olduğunu dedik. Beləliklə, hansı növ təlimat Bizdə hansı əməliyyatlar var? Əgər siz bu dərslikdə dilə xas bələdçiləri oxumusunuzsa, artıq bir neçə təlimatı görmüsünüz: `Register<Account>` və `Mint<Numeric>`.

Budur Iroha Təlim əməliyyatlarının tam siyahısı:

|Təlimat|Təsvirlər|
| --------------------------------------------------------- | ------------------------------------------------ |
| [Qeydiyyatdan keç/Qeydiyyatdan çıx](#un-register)                       |Blokçeyn üzərində yeni bir varlığa ID verin.|
| [Mint/Burn](#mint-burn) |Rəqəmsal aktivləri çap et/yan və ya təkrarlanmanı işə sal.|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Blokçeyn obyektinin metadatasını yeniləyin.|
| [SetParameter](#setparameter)                             |Zəncir üzrə ümumi parametr təyin edin.|
| [Grant/Revoke](#grant-revoke)                             |İcazələri və rolları verin və ya silin.|
| [Köçürmə](#transfer)                                     |Mülkiyyətin və ya aktivin dəyərinin köçürülməsi.|
| [Yerli etibar və aktiv kilidləri](#native-escrow-and-asset-locks) |Rəqəmsal aktivləri protokol mühafizəsində kilidləyin.|
| [Atomik şəxsi maliyyə əməliyyatının həlli](#atomic-private-settlement)   |Gizli protokol məlumat qruplarını və atom paketlərini idarə edin.|
| [ExecuteTrigger](#executetrigger)                         |Tətikləyiciləri işə sal.|
| [Log/Custom/Upgrade](#other-instructions)                 |Proqramın icra mühitinin davranışını qeydə alın, genişləndirin və ya təkmilləşdirin.|

Gəlin Iroha Təlimat əməliyyatlarının xülasəsi ilə başlayaq; hər bir təlimatın hansı obyektlər üçün çağırıla biləcəyini və hər bir obyekt üçün hansı təlimatların mövcud olduğunu.

## Xülasə {#summary}

Hər təlimat üçün bu təlimatın tətbiq oluna biləcəyi obyektlərin siyahısı var. Məsələn, köçürmə variantları mülkiyyətli blokçeyn dəftər obyektlərini və rəqəmsal aktivləri əhatə edir, çıxarma isə rəqəmsal aktivləri və təkrarlanan tetiklemeleri əhatə edir.

Bəzi təlimatlar bir təyinatın göstərilməsini tələb edir. Məsələn, əgər aktivləri transfer edirsinizsə, onları hansı hesaba köçürdüyünüzü həmişə göstərməlisiniz. Digər tərəfdən, bir şeyi qeydiyyata alanda, sadəcə qeydiyyatdan keçirmək istədiyiniz obyekt kifayətdir.

|Təlimat|Obyektlər|Təyinat|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |adi domen, məlumatlar məkanı-təxəllüs və hesab-təxəllüs qurulması|                      |
| [Qeydiyyatdan keç/Qeydiyyatı ləğv et](#un-register)                       |hesablar, aktiv təsvirləri, NFTs, rollar, tetikleyicilər, şəbəkə həmkarları; domenin silinməsi|                      |
| [Mint/Burn](#mint-burn) |rəqəmsal aktivlər, təkrarları tetiklə|hesablar və ya tetikleyicilər|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |obyektlər ki, [metaməlumat](./metadata.md): domenlər, hesablar, aktiv tərifləri, NFTs, RWAs, tetikleyiciləri var|                      |
| [SetParameter](#setparameter)                             |zəncir parametrləri|                      |
| [Grant/Revoke](#grant-revoke)                             | [rollar, icazə tokenləri](/az/blockchain/permissions.md)                                                  |hesablar və ya rollar|
| [Köçürmə](#transfer)                                     |domenlər, aktiv tərifləri, rəqəmsal aktivlər, NFTs|hesablar|
| [Yerli etibar və aktiv kilidləri](#native-escrow-and-asset-locks) |rəqəmsal aktiv depozitləri, aktiv kilidləri, anonim depozit kriptoqrafik öhdəlik dəyərləri|alıcılar, təyinatlar və ya mübahisə bölgüləri|
| [Atomik şəxsi maliyyə əməliyyatının həlli](#atomic-private-settlement)   |marşrut üzrə məhdudlaşdırılmış gizli protokol məlumat qrupları, siyasət rotasiyaları, yekunlaşdırılmış paketlər və ləğv işarələri|                      |
| [ExecuteTrigger](#executetrigger)                         |tetikləyir|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |jurnallar, icraçıya xüsusi fayllar, icraçı yeniləmələri|                      |

ISI-a baxmağın başqa bir yolu da var, onlarla əlaqəli blokçeyn qeyd dəftəri obyekti baxımından:

|Hədəf|Təlimatlar|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Hesab|hesabları qeydiyyatdan keçirmək/ləğv etmək, aktivləri qəbul etmək, hesab metadata-sını yeniləmək, icazə və rolları vermək/ləğv etmək|
|Domen|domen qurulmasını təmin edin, domenləri qeydiyyatdan çıxarın, domen sahibliyini köçürün, domen metadatasını yeniləyin|
|Əmlakın tərifi|tərifləri qeydiyyatdan keçirmək/ləğv etmək, mülkiyyəti ötürmək, metadatanı yeniləmək|
|Aktiv|rəqəmsal miqdarı çıxarmaq/yandırmaq, rəqəmsal miqdarı köçürmək|
|Əmanət|açmaq, qəbul etmək, ödəmə göndərildiyini işarələmək, buraxmaq, ləğv etmək, mübahisə etmək, həll etmək, çəkmək və ya yerli saxlama qeydlərinin müddətini başa vurmaq|
| NFT              | qeydiyyatdan keçirmək/qeydiyyatdan silmək NFTs, mülkiyyəti köçürmək, metadatanı yeniləmək|
| RWA              |çoxluqları qeydiyyatdan keçirmək, miqdarı köçürmək, saxlamaq/buraxmaq, dondurmaq/dondurmanı açmaq, geri ödəmək, birləşdirmək, metadatanı və nəzarətləri yeniləmək|
|Tətik| qeydiyyatdan keçmək/qatılmamaq, pul vurmaq/yandırmaq tetik təkrarları, tetiki icra etmək, tetik metadatasını yeniləmək|
|Dünya|şəbəkə iştirakçılarını və rollarını qeydiyyatdan keçirmək/ləğv etmək, parametrləri təyin etmək, icraçını yeniləmək|

## CLI Nümunələr {#cli-examples}

Bu səhifədəki nümunələr, upstream Iroha iş sahəsindən komandaları defolt yerli müştəri konfiqurasiyasına qarşı işlətdiyinizi nəzərdə tutur:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Əgər siz `iroha` ikili faylını quraşdırmısınızsa, onun əvəzinə `iroha --config ./defaults/client.toml`-dən istifadə edin. Aşağıdakı yer tutucuları şəbəkənizdən olan dəyərlərlə əvəz edin:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

İctimai Taira testnet-i hədəfləyərkən, Taira müştəri konfiqurasiyasından istifadə edin. Ödəniş tələb edən nümunələri işlətmədən əvvəl, testnet maliyyələşdirmə xidməti köməkçisini [Taira üzərində Testnet XOR əldə edin](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-dən `taira_faucet_claim.py` olaraq yadda saxlayın, sonra testnet maliyyələşdirmə xidmətindən testnet XOR-ü tələb edin:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Testnet tərəfindən maliyyələşdirilən aktiv göründükdən sonra, yazı əməliyyatlarına lazım olan əməliyyat icra xərci aktiv metadatasını əlavə edin:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` domenlər yaratmaq və onların SNS icarələrini təyin etmək üçün adi ilk-çıxış yoludur. Bu, dəqiq məlumat sahəsini, sahibi, icarə müddətini deklarativ şəkildə bağlayır, və ödəniş-qiymət yoxlama qoruyucusu, sonra bütün tələb olunan vəziyyəti atomik şəkildə yaradır və ya təmir edir. Doğrulanmış `POST /v1/aliases/setup/plan` API son nöqtəsindən və ya uyğun CLI iş axınından istifadə edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Niyyət və plan gizli-sizdir, lakin tətbiq addımı tənzimlənmiş hesabla adi əməliyyatı imzalayır və təqdim edir. Plan öz zənciri, icazə prinsipi, canlı vəziyyət lövhəsi və son tarixlə bağlıdır; heç vaxt birini başqa şəbəkədə təkrar istifadə etməyin.

## (Qeydiyyatdan keçmək/Qeydiyyatdan çıxmaq) {#un-register}

Qeydiyyatdan keçmək və qeydiyyatı silmək blokçeyndə yeni varlığa ID vermək üçün istifadə olunan təlimatlardır.

Qeydiyyatdan keçirilə bilən hər şey həm `Registrable`, həm də `Identifiable`dir, amma hər şey `Identifiable` olan `Registrable` olmur. Əksər şeylər birbaşa qeydiyyata alınır, lakin bəzi hallarda blokçeyndəki nümayəndəlik xeyli daha çox məlumat ehtiva edir. Təhlükəsizlik və performans səbəblərinə görə, biz belə məlumat strukturları üçün quruculardan istifadə edirik (məsələn, `NewAccount`), və şəbəkə həmkarı qeydiyyatı üçün xüsusi bir sahiblik sübutu təlimatı mövcuddur. Qayda olaraq, qeydiyyatdan keçə bilən hər şey həm də qeydə alınmadan çıxarıla bilər, amma bu sərt və qəti bir qayda deyil.

Siz hesabları, aktivlərin təyinatlarını, NFTs, şəbəkə iştirakçılarını, rolları və tetikleyiciləri qeydiyyatdan keçirə bilərsiniz. Domen qurulumu `EnsureAlias` istifadə edir; xam `Register::Domain` yükləməsi üçün ayrılmışdır genesis/bootstrap. şəbəkə həmkarı qeydiyyatı üçün `RegisterPeerWithPop` istifadə olunur, bu isə şəbəkə həmkarı açarı üçün mülkiyyət sübutunu daşıyır. Subyekt adlarına qoyulan məhdudiyyətləri öyrənmək üçün bizim [adlandırma qaydaları](/az/reference/naming.md)-ə baxın.

RWA lotlar xüsusi `RegisterRwa` təlimatı vasitəsilə yaradılır. Mövcud kod `UnregisterRwa` təlimatını açıq göstərmir; göstərilən miqdarı ləğv etmək üçün `RedeemRwa`-dən istifadə edin.

::: info

Qeyd edin ki, `genesis.json`-da [blokçeyn başlanğıc bloku](/az/guide/configure/genesis.md)-inizi necə qurmağa qərar verdiyinizdən asılı olaraq (xüsusən də icazə tokenlərinin qeydiyyatını daxil edib-etməməyinizdən), hesabın qeydiyyatı prosesi çox fərqli ola bilər. Ümumiyyətlə, bunu belə ümumiləşdirə bilərik:

- İctimai blokçeyndə hər kəs hesab qeydiyyatdan keçirə bilməlidir.
- Şəxsi blokçeyndə hesabların qeydiyyatı üçün unikal bir proses ola bilər. Tipik şəxsi blokçeyndə, yəni hesabların qeydiyyatı üçün heç bir unikal prosesi olmayan bir blokçeyndə, başqa bir hesabı qeydiyyatdan keçirmək üçün hesab lazımdır.

Biz bu fərqləri böyük təfərrüatla müzakirə edirik, biz [şəxsi və ictimai blokçeynleri müqayisə edin](/az/guide/configure/modes.md) zaman.

:::

::: info

Şəbəkə yoldaşını qeydiyyatdan keçirmək, hazırda orijinal etibarlı şəbəkə yoldaşları dəstinin bir hissəsi olmayan şəbəkə yoldaşlarını şəbəkəyə əlavə etməyin yeganə yoludur.

:::

Blockchain obyektlərini qeydiyyatdan keçirmək üçün dilə xas təlimatdan istifadə edin:

|Dil|Bələdçi|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |Domainləri qurmaq və hesablar və aktivləri qeydiyyatdan keçirmək üçün [Iroha CLI](/az/get-started/operate-iroha-via-cli.md)-dən istifadə edin.|
| Rust                  | [Rust dərsliyi](/az/guide/tutorials/rust.md)-dən istifadə edin.|
| Kotlin/Java           | [Kotlin/Java](/az/guide/tutorials/kotlin-java.md)-dən istifadə edin.|
| Python                | [Python dərsliyi](/az/guide/tutorials/python.md)-dən istifadə edin.|
| JavaScript/TypeScript | [JavaScript/TypeScript](/az/guide/tutorials/javascript.md)-dən istifadə edin.|

Adi domen quruluşunu planlaşdırın və tətbiq edin, sonra domen artıq lazım olmadıqda qeydiyyatdan çıxarın:

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

Hesabları qeydiyyatdan keçirin və qeydiyyatdan çıxarın:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Aktiv təyinatlarını qeydiyyatdan keçirin və qeydiyyatdan silin:

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

NFTs-i qeydiyyatdan keçirin və qeydiyyatdan silin. NFT qeydiyyatı onun məzmununu JSON standart girişdən oxuyur:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Rolları qeydiyyatdan keçirin və qeydiyyatını ləğv edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Tətikçiləri qeydiyyatdan keçirmək və qeydiyyatdan çıxarmaq. Tətikçi qeydiyyatı ya tərcümə olunmuş IVM bayt koduna, ya da seriyalaşdırılmış təlimatlar siyahısına ehtiyac duyur. Bu nümunə CLI ilə bir `Log` təlimatı yaradır və onu tətikçi qeydiyyatına yönləndirir:

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

Şəbəkə iştirakçılarını qeydiyyatdan keçirin və qeydiyyatını ləğv edin. Əgər artıq onlara malik deyilsinizsə, BLS açarını və PoP-i `kagami` ilə yaradın:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Yaratmaq/Yandırmaq {#mint-burn}

verilməsi və məhv edilməsi məhdud sayda təkrarlarla rəqəmsal aktivlərə və tetikleyicilərə aid ola bilər. Bəzi aktivlər qeydə alındıqdan sonra yalnız bir dəfə verilməsi mümkün olan qeyri-mintable kimi elan edilə bilər.

Aktivlər müəyyən bir hesaba verilir, adətən aktivin ilk dəfə qeydiyyata alındığı hesaba. Aktivlərin miqdarı mənfi deyil, buna görə də bir aktivdən `$-1.0` ola bilməz və ya mənfi miqdarı məhv edib bir veriliş əldə edə bilməzsiniz.

Blockchain aktivlərini çıxarmaq üçün dilə spesifik təlimatdan istifadə edin:

- [CLI](/az/get-started/operate-iroha-via-cli.md)
- [Rust](/az/guide/tutorials/rust.md)
- [Kotlin/Java](/az/guide/tutorials/kotlin-java.md)
- [Python](/az/guide/tutorials/python.md)
- [JavaScript/TypeScript](/az/guide/tutorials/javascript.md)

Əmlakları məhv etməyin nümunələri:

- [CLI](/az/get-started/operate-iroha-via-cli.md)
- [Rust](/az/guide/tutorials/rust.md)

rəqəmsal aktivləri buraxmaq və məhv etmək:

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

təhvil verin və təkrarları məhv edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Köçürmə {#transfer}

Transferlər mülkiyyətin və ya dəyərin hesablar arasında hərəkətini təmin edir. Ümumi transfer variantları domenləri, aktiv təriflərini, ədədi aktivləri və NFTs-ü əhatə edir. RWA miqdarın hərəkəti, [Həqiqi Dünyada Aktivlər](/az/blockchain/rwas.md)-də təsvir olunan xüsusi `TransferRwa` və `ForceTransferRwa` təlimatlarından istifadə edir.

Bunu etmək üçün bir hesaba [aktivlərin köçürülməsi icazəsi](/az/reference/permissions.md) verilməlidir. Aktivləri [CLI](/az/get-started/operate-iroha-via-cli.md) və ya [Rust](/az/guide/tutorials/rust.md) ilə necə köçürmək nümunəsinə baxın.

Rəqəmsal aktivləri köçürmək:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Domeni, aktiv-tərifini və NFT mülkiyyətini köçürmək:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Yerli Depozit və Aktiv Bloklamaları {#native-escrow-and-asset-locks}

Yerleşik etibarnamə təlimatları rəqəmsal aktivləri blokçeyn dəftər protokolu tərəfindən idarə olunan mühafizədə kilidləyir. Onlar bazar tərzi maliyyə əməliyyatlarının həlli, ümumi aktiv kilidləri və anonim qorunan etibarnamə axınları üçün istifadə olunur.

Marketplace depoziti `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute` və `ResolveEscrowDispute`-dən istifadə edir. Ümumi aktiv kilidləri `OpenAssetLock`, `DrawdownAssetLock`-dən istifadə edir, `CancelAssetLock` və `ExpireAssetLock`. Anonim depozit `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute` və `ResolveAnonymousEscrowDispute` ilə bazar dövrünü əks etdirir.

Bu ISIs hazırda birinci dərəcəli CLI əmrlərə malik deyil. Tipli SDK quruculardan və ya sıralanmış təlimat paketlərindən istifadə edin və həyat dövrü detalları, icazələr, sorğular, hadisələr və Rust nümunələri üçün [Yerli Aktiv Əmanət](/az/blockchain/escrow.md)-a baxın.

## Atomik Şəxsi maliyyə əməliyyatı hesablaşması {#atomic-private-settlement}

Tənzimlənən atom-xüsusi-hesablama təlimatı ailəsi şəffaf Yerli AMX-dən ayrıdir. `ActivatePrivateSettlementPoolV1` qırmızı gözdən keçirilmiş idarəetmə proyeksiyasından və tək protokol-standart mənşəli kriptoqrafik öhdəlik dəyərlərindən bir marşrut-dəməli məxfi protokol məlumat qrupu müəyyən edir. `FinalizeAtomicPrivateSettlementV1` tam komitə tərəfindən təsdiqlənmiş paketi atomik şəkildə tətbiq edir, `AbortAtomicPrivateSettlementV1` isə yalnız sponsor tərəfindən təsdiqlənmiş ictimai terminal markerini yayımlayır.

`RotatePrivateSettlementPoolPolicyV1` məxfilik idarəçiliyi ilə məhdudlaşdırılıb. Bu, dəqiq cari idarəetmə kriptoqrafik xülasə dəyərini tələb edir, marşrutu, protokol məlumat qrupunu, aktiv-bağlama kriptoqrafik öhdəlik dəyərini, vəziyyət sərhədini, təkrar dəstlərini və yekunlaşdırılmış protokol nəticə qeydlərini qoruyur, ictimai təftişi bir addım irəlilədərək, daha yeni auditçi açarı epoxundan istifadə edir. Dövriyyə daxilolma hündürlüyündə aktivləşir və eyni marşrut/baxa üçün protokol nəticəsi qeydi ilə həmin hündürlüyü paylaşa bilməz. İctimai baxış soyadı protokol nəticəsi qeydlərini dövriyyə yenidən başlatmadan əvvəl sonlandırılmış, doğru və dəqiq təkrar icra olunabilən saxlayır; hərəkətdə olan köhnə siyasət paketləri bağlı şəkildə uğursuz olur. Operatorlar saxlanılmış kapsullar üçün köhnə deşifrə açarlarını qorumalı və ya onları məhv etməzdən əvvəl kapsulu yenidən bükməyi idarə etməli və yoxlamalıdırlar.

Yol varsayılan olaraq deaktivdir və istehsal üçün uyğun deyil. Konfiqurasiya, səlahiyyət prinsipi, audit, bərpa və buraxılış tələbləri üçün [Atomik Şəxsi Çarpaz Məlumatlar Məkanında maliyyə əməliyyatı hesablaşmasını icra et](/az/get-started/atomic-private-settlement)-a baxın.

## Təyin et/Ləğv et {#grant-revoke}

Hesab [icazələr və rollar](permissions.md) üçün icazə vermək və ləğv etmək göstərişləri istifadə olunur.

`Grant` istifadəçiyə ya tək bir icazə, ya da bir icazələr qrupunu ("rol") daimi olaraq vermək üçün istifadə olunur. Verilən rollar və icazələr yalnız `Revoke` təlimatı vasitəsilə silinə bilər. Beləliklə, bu təlimatlar diqqətlə istifadə edilməlidir.

Hesabda rolu vermək və ya ləğv etmək:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

İcazə tokenlərini vermək və geri almaq. İcazə əmrləri icazə obyektini standart girişdən oxuyur:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Bir rolda icazələri verin və ləğv edin:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Bu təlimatlar [metaməlumat](/az/blockchain/metadata.md) obyektini yeniləyir. Metaməlumat girişini əlavə etmək və ya əvəz etmək üçün `SetKeyValue`-dən və birini silmək üçün `RemoveKeyValue`-dən istifadə edin.

Metadata `set` əmrləri standart girişdən JSON dəyərini oxuyur:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Eyni nümunə hesablar, aktiv tərifləri, NFTs, RWAs və tetikleyicilər üçün də mövcuddur:

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

`SetParameter` aktiv məlumat modeli və icraçı tərəfindən göstərilən zəncir üzrə parametrləri dəyişdirir.

Standart girişdə tək parametr JSON obyekti ötürərək parametri təyin edin:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Bu təlimat [tetikleyicilər](./triggers.md)-i icra etmək üçün istifadə olunur.

CLI tetikleyiciləri qeydiyyatdan keçirə və tetikleyici icra hadisələrinə birbaşa abunə ola bilər. O, tiplənmiş `execute trigger` əmri təmin etmir, buna görə təqdim etmək üçün əl kitabçası `ExecuteTrigger` təlimat, sıra şəklində `InstructionBox` yaradın SDK və ya icraçı alət ilə və yaranan JSON massivini `ledger transaction stdin` vasitəsilə keçirin:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Digər təlimatlar {#other-instructions}

Iroha həmçinin proqram icra mühiti və icraçı inteqrasiyası üçün aşağı səviyyəli təlimatları da aşkar edir:

- `Log`: icra zamanı bir qeyd qeydi göndərin
- `CustomInstruction`: icraçıya xas JSON yükləri daşımaq
- `Upgrade`: icraçı təkmilləşdirməsini aktivləşdir

Ping yardımçısı ilə `Log` təlimatını təqdim edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Xüsusi icraçı təlimatını serializə edilmiş `InstructionBox` kimi təqdim edin. Yükləmə forması icraçıya xasdır, buna görə təlimatı uyğun SDK və ya icraçı alətləri ilə yaradın:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

İcraçını tərtib edilmiş IVM baytkod faylından yeniləyin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
