---
translation_locale: az
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Nəticə {#outcome}

Taira NFT vəziyyətini yoxlayın, sonra bir unikal NFT i yaradılmış lokal şəbəkədə qeydiyyatdan keçirin, yeniləyin, köçürün və sorğu edin. İş axını tam sertifikatlı `name$domain.dataspace` NFT ID və tək protokol-standart I105 sahiblər ID-lərindən istifadə edir.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Python 3.11 və daha sonrakı versiyaları, həmçinin cari `iroha` CLI.
- Yalnız oxumaq üçün Taira girişi.
- Yazmaq üçün, [Iroha-ı işə sal](/az/get-started/launch-iroha.md)-dən yaradılmış yerli şəbəkə, `http://127.0.0.1:8080`-də `./localnet/client.toml` və Torii ilə.

## Addımlar {#steps}

### 1. İctimai Taira kolleksiyasını yoxlayın {#_1-inspect-the-public-taira-collection}

Boş bir səhifə uğurlu oxunuşdur: bu, istənilən səhifədə görünən heç bir NFTs olmadığını göstərir.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs unikal qeydlərdir, rəqəmli balanslar deyil. Onların bir ID-si, bir sahibi və kompakt `content` metadata xəritəsi var.

### 2. Yerli sahibin şəxsiyyət vəsiqələrini hazırlayın {#_2-prepare-local-owner-ids}

Yazı nümunəsi yoxlanılmış `wonderland.universal` domenindən istifadə edir. Konfiqurasiya olunmuş avtorizasiya əsasını özəl açarını ifşa etmədən çıxarın, sonra digər bir qeydiyyatdan keçmiş hesabı köçürmə məkanı kimi seçin.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` ayırıcı NFT mətn formasına aiddir. Tam `wonderland.universal` domen və məlumat sahəsi sonluğunu qoruyun.

### 3. NFT-i ilkin məzmunla qeydiyyatdan keçirin {#_3-register-the-nft-with-initial-content}

CLI standart girişdən ilkin JSON obyektini oxuyur. Cari səlahiyyət prinsipi sahib olur.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Məzmun xəritəsini yeniləyin {#_4-update-the-content-map}

Metaməlumat dəyərləri JSON -dir. Açar təyin etmək həmin girişin əlavə olunması və ya əvəz olunması deməkdir; bu, bütün NFT qeydlərini əvəz etmir.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Mülkiyyətin köçürülməsi {#_5-transfer-ownership}

Hər iki tək protokol-standart I105 hesab ID-sini təmin edin. Bir əvəzetmə `--from` və ya `--to` kimi istifadə edilməzdən əvvəl həll edilməlidir.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning İcazə sərhədi

Hər Taira üçün hər yazı həmçinin `--metadata ./taira.tx-metadata.json` və açıq-aşkar ödəniş edən tələb edir. Qeydiyyat, köçürmə, silmə və metadata yeniləmələri aktiv proqram təminatı icrası tərəfindən yoxlanılır mühit (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` və `CanModifyNftMetadata` standart icazə səthində). Tətbiqinizə təyin edilmiş domeni istifadə edin və ya bu walkthrough-u localnet-də saxlayın.

:::

Müqavilə-əlaqəli iş axınları üçün, Kotodama tipləndirilmiş NFT host-funksiyası çağırışlarını göstərir. Aşağıda, pinlənmiş IVM sənədləşdirmə testi tərəfindən tərtib edilmiş və icra edilmiş dəqiq həyat dövrü test artefaktı verilmişdir:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

İki sabit I105 dəyəri yuxarı axın test sənədləridir; test işlədicisi icradan əvvəl təyinatı qeyd edir. Onlar CLI addım-addım izahlardan `CURRENT_OWNER` və `NEW_OWNER` deyillər. Tətbiq müqaviləsi üçün onun faktiki tək protokol-standart hesablarını təmin edin, sonra isə onu tərtib edin, sınaqdan keçirin, yerləşdirin və [Ağıllı müqavilələr](./smart-contracts.md) vasitəsilə çağırın. Gözdən keçirilməmiş baytkodu Taira-ə göndərməyin və yadda saxlayın ki, müqavilənin icrası hələ də proqram təminatı icra mühiti səlahiyyətindən keçir.

## Yoxla {#verify}

Məzmunu bağlı qalarkən sahibinin dəyişdiyini təsdiqləyin və NFT-ı birbaşa oxuyun:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Əgər CLI qeydi çıxış məlumat konteynerində sarğılayırsa, JSON-i bir dəfə yoxlayın və iddianı daxil edilmiş NFT obyektinə tətbiq edin. Səlahiyyətli invariantslar `id`, `owned_by` və `content`-dir.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `name$domain` bəzi analizlərdə universal verilənlər məkanına defolt olaraq gedə bilər, lakin kitabça və tətbiq ID-ləri açıq `name$domain.dataspace` formasından istifadə etməlidir.
- Eyni NFT ID-nin təkrarlanan qeydiyyatı rədd edilir. Fərqli bir qeyd üçün yeni bir localnet istifadə edin və ya stabilliyini qoruyan yeni bir ID seçin.
- Metaməlumat girişi standart girişdə etibarlı olmalıdır JSON. JSON sitatlaşdırılmamış bir səth sətir metaməlumat dəyəri deyil.
- Cari sahib olmayan bir hesab tərəfindən imzalanmış köçürmə üçün dəqiq icazə lazımdır; `--from` dəyişmək kriptoqrafik imzalayanı dəyişmir.
- Köçürmədən sonra, ilkin müştərinin NFT-i dəyişdirməsinə və ya qeydiyyatdan çıxarmasına icazə verilməyə bilər. Yeni sahibin kriptoqrafik imzalayıcısından və ya səlahiyyətli nəzarətçidən istifadə edin.
- Taira boş NFT kolleksiyasını qaytara bilər. `items: []`-ı NFT təlimatlarının mövcud olmadığının sübutu kimi qəbul etməyin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [NFT pin edilmiş mənbə kodu reviziyasında inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT bərkidilmiş mənbə kodu versiyasında host-texniki çağırış sınaqları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Qeyd olunmuş mənbə kodu reviziyasında dəqiq Kotodama NFT həyat dövrü test artefaktı](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/az/blockchain/nfts.md)
- [Metaməlumat](/az/blockchain/metadata.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [İcazə tokenləri](/az/reference/permissions.md)
