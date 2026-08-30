---
translation_locale: az
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Nəticə {#outcome}

Təftiş Taira NFT qeyd, sonra qeydiyyat, yeniləmək, köçürmək və unikal bir sual NFT Bu iş axını tam ixtisaslı bir `name$domain.dataspace` NFT ID və kanonik I105 sahibkar IDs.

## Əvvəlki şərtlər {#prerequisites}

- `curl`, `jq`, Python 3.11 və ya daha sonrakı dövrlər və axın `iroha` CLI.
- Yalnız oxumaq üçün Taira giriş.
- Yazılar üçün, [dan yaradılan yerli şəbəkə Iroha ](/az/get-started/launch-iroha.md) ilə `./localnet/client.toml` və Torii ilə `http://127.0.0.1:8080` başlatılır.

## Dərslər {#steps}

### 1. İctimaiyyətin Taira toplanmasını yoxlayın {#_1-inspect-the-public-taira-collection}

Boş səhifə uğurla oxunur: bu da tələb olunan səhifədə görünən NFTs yoxdur deməkdir.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs unikal qeydlərdir, rəqəmsal balanslar deyil. Onlar bir ID, bir sahibi və kompakt `content` metadata xəritəsi var.

### 2. Yerli sahibini hazırlayın IDs {#_2-prepare-local-owner-ids}

Yazı nümunəsində `wonderland.universal` daxil edilmiş domen istifadə olunur. Konfiqurasiyalı hakimiyyəti özəl açarını açıqlamadan çıxarın, sonra transfer məqsədi olaraq başqa qeydiyyatdan keçmiş hesab seçin.

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

`$` ayırıcı NFT mətn formasına aiddir. Tam `wonderland.universal` domen və məlumat sahəsi sufixini saxlayın.

### 3. Başlanğıc məzmunlu NFT qeydiyyatına alın. {#_3-register-the-nft-with-initial-content}

CLI standart girişdən ilkin JSON obyektini oxuyur. Hal-hazırda olan səlahiyyətli şəxs sahibi olur.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Məzmun xəritəsini yeniləyin. {#_4-update-the-content-map}

Metadata qiymətləri JSON dir. Bir açarı daxil etmək və ya həmin bir giriş əvəz etmək; bütün NFT qeydini əvəz etmir

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Mülkiyyətin ötürülməsi {#_5-transfer-ownership}

Hər iki kanonik I105 hesabını təmin edin IDs. `--from` və ya `--to` olaraq istifadə edilməzdən əvvəl bir alias həll olunmalıdır.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Rəsmi sərhəd

Taira, hər yazmaq da lazımdır `--metadata ./taira.tx-metadata.json` və açıq bir ödəniş ödəyicisi. qeydiyyat, köçürmə, çıxarma və metadata yeniləmələr aktiv icra vaxtı ilə yoxlanılır (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` və `CanModifyNftMetadata` varsayılan icazə səthində). Tətbiqinizə təyin edilmiş bir domen istifadə edin və ya bunu localnet-də saxlayın.

:::

Müqaviləyə məxsus iş axınları üçün Kotodama NFT tiplənmiş ev sahibi çağırışlarını aşkar edir. Aşağıda bağlanmış IVM sənədləşmə testi ilə tərtib edilmiş və icra edilən tam həyat dövrü qurğusu:

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

İkisi də düzəldilib. I105 Qiymətlər test qurğularıdır; arnes yerinə yetirilmədən əvvəl istiqaməti qeydə alır. Onlar `CURRENT_OWNER` və `NEW_OWNER` Qəzetdən CLI Ərizə müqaviləsi üçün əsl kanonik hesablarını təqdim edin, sonra tərtib edin, sınaqdan keçin, tətbiq edin və onu çağırın [Akıllı müqavilələr](./smart-contracts.md). Yenidən nəzərdən keçirilməmiş byt kodunu Taira, və unutmayın ki, müqavilənin icrası hələ də icra müddətinin icazəsi keçib.

## Tətbiq edin {#verify}

NFT ünvanını birbaşa oxuyun və məzmunu bağlı qalsa da sahibinin dəyişdiyini bildirin:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI qeydini bir çıxış qovşağı ilə bağlayırsa, JSON bir dəfə yoxlayın və təsdiqləməni daxil olan NFT obyektinə tətbiq edin. Əsas dəyişikliklər `id`, `owned_by` və `content`.

## Problemlərin həlli {#troubleshooting}

- `name$domain` bəzi parserlərdə universal məlumat boşluğuna təyin edilə bilər, lakin mətbəx kitabı və tətbiq IDs açıq şəkildə `name$domain.dataspace` formasını istifadə etməlidir.
- Eyni NFT ID-nin təkrar qeydiyyatı rədd edilir. Tək bir qeyd üçün yeni lokal şəbəkədən istifadə edin və ya sabit bir yeni ID seçin.
- Metadata daxil edilməsi standart girişdə JSON etibarlı olmalıdır. JSON qeyd edilməyən bir qabıq silsiləsi metadata dəyəri deyil.
- Hələlik sahibindən başqa bir hesab tərəfindən imzalanmış köçürülmə dəqiq icazə tələb edir; `--from` dəyişdirmək imzalananı dəyişmir.
- Transferdən sonra orijinal müştəri NFT -nin dəyişdirilməsinə və ya qeydiyyatdan çıxarılmasına icazə verilə bilməz. Yeni sahibinin imzası və ya icazəli nəzarətçisi istifadə edin.
- Taira boş bir NFT kolleksiyasını geri verə bilər. `items: []` NFT təlimatlarının mövcud olmadığını sübut etmək üçün qəbul etməyin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [NFT bağlanmış komitdə inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT bağlanmış komitdə aparıcı çağırış sınaqları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Düzgün Kotodama NFT həyat dövrü sabitləşdirilmiş komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/az/blockchain/nfts.md)
- [Metadata](/az/blockchain/metadata.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [Rəsmi nişanlar ](/az/reference/permissions.md)
