---
translation_locale: az
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadatalar {#metadata}

## Nəticə {#outcome}

Taira metadatalarını oxuyun, açıq şəkildə ödənişli bir əməliyyatla bir hesabın metadata dəyərini müəyyənləşdirin və təsdiqləyin və qiyməti yenidən çıxarın.

## Əvvəlki şərtlər {#prerequisites}

- `curl`, `jq`, Python 3.11 və ya daha sonrakı dövrlər və axın `iroha` CLI.
- [-dən Taira](./connect-to-taira.md)-ə bağlanan və maliyyələşdirilən `taira.client.toml` və `taira.tx-metadata.json`
- Məqsədli hesabın metadataları üzərində səlahiyyət. nümunə qurulmuş səlahiyyəti hədəfləyir; başqa bir hesab dəqiq icazə tələb edir.

## Dərslər {#steps}

### 1. Metadataları imzalanmadan oxuyun. {#_1-read-metadata-without-a-signer}

Metadata `Name` ilə JSON xəritələrində yoxlanılır. Boş xəritələr və boş filtrlənmiş çıxış etibarlı nəticədir.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Kiçik təsviri və ya indeksləmə sahələri üçün meta məlumatlardan istifadə edin. Böyük paylı yükləri kitabdan çıxarın və əvəzinə URI və ya SoraFS istinadını saxlayın.

### 2. Hədəf hesabını çıxarın {#_2-derive-the-target-account}

Taira konfiqurasiyasından yalnız ictimai açar oxuyun və onu kanonik domensiz I105 formasına çevirin.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. Bir JSON dəyərini təyin edin. {#_3-set-one-json-value}

Standart girişdən oxunan JSON hesabın `cookbook_profile` dəyərinə çevrilir. Buna müqayisədə, `--metadata ./taira.tx-metadata.json` əməliyyat zarfına ödəniş sahələrini əlavə edir.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

İndiki CLI ödənişi qeyd edir, imzalar, təqdim edir və default olaraq gözləyir. `--no-wait` Sonrakı əməliyyat bu dəyərdən asılıdır.

::: warning Rəsmi sərhəd

Aktiv təsdiqləyici hər bir obyektin kim dəyişə biləcəyinə qərar verir. Başqa hesabı yeniləmək normal olaraq `CanModifyAccountMetadata` tələb edir; domenlər, aktiv tərifləri, NFTs və tetikçilərin öz hədəf xüsusi metadata icazələrinə malikdirlər. Əgər Taira tələb olunan səlahiyyəti verməyibsə, eyni hesab əmrlərini `./localnet/client.toml` ilə icra edin, istehsal olunan lokalnet səlahiyyətliyinin kanonik I105 ID adını əvəz edin və Taira ödəniş metadata dosyasını çıxarın.

:::

### 4. Açığı çıxarın. {#_4-remove-the-key}

Əvvəlcə öhdəlik götürülmüş qiyməti oxuyun, sonra ayrı bir çıxarış əməliyyatını təqdim edin.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python tətbiqetmələri üçün uyğunlaşdırılmış tiplənmiş qurucular `Instruction.set_account_key_value` və `Instruction.remove_account_key_value`; onları tranzaksiya metadataları ilə birlikdə təqdim edin və [Python təlimatından gözləyən köməkçi ](/az/guide/tutorials/python.md#shared-setup).

## Tətbiq edin {#verify}

Satılan əməliyyatdan sonra `meta get` obyektin `version: 1` ilə qaytarılması lazımdır. çıxarıldıqdan sonra birbaşa axtarış artıq dəyər qaytarmamalıdır:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Ayrı hesab oxunması çatışmayan metadata açarını şəbəkə və ya hesab pozuntularından ayırır. İstehsalat kodu, onu təyin etdikdən sonra bütün JSON dəyərini yoxlamalıdır.

## Problemlərin həlli {#troubleshooting}

- Standart giriş bir etibarlı JSON dəyərini ehtiva etməlidir. Satırlara JSON sitatları lazımdır; obyektlər və sıralar yaxşı formalaşdırılmalıdır .
- Metadata açarları `Name` dəyərlərdir və analizdən sonra vəziyyətə həssasdırlar. Hər sxem dəyişikliyi üçün versiyalaşdırılmış açarlar yaratmaq əvəzinə sabit bir açar lüğəti saxlayın.
- `--metadata` əməliyyat metadatalarıdır; bu, nəşriyyat obyekti metadatalarını təyin etmir. Sonrakı üçün müəssisənin `meta set` alt əmri istifadə edin.
- Müvəffəqiyyətli göndərmə, köhnə oxunuşdan sonra yayılma gecikməsi ola bilər. İstifadə olunmuş yekunluğu gözləyin və yenidən göndərmədən əvvəl sualı təkrarlayın.
- İzin verilməsinin rədd edilməsi hədəf obyektini və səlahiyyət sərhədlərini müəyyənləşdirir. Yerli şəkildə təcrübə edin və ya dəqiq token tələb edin; giriş nəzarətindən qaçmaq üçün xüsusi tətbiq məlumatlarını ictimai bir metadata sahəsinə köçürməyin.
- Heç vaxt özəl açarları, xırda şəxsi identifikatorları, giriş nömrələri və ya böyük sənədləri metadata saxlama.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Metadata sorğusunun birləşdirilməsi testləri bağlanmış komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK əməliyyat qurucuları bağlanmış məbləğdə ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metadata](/az/blockchain/metadata.md)
- [Metadata və kitabxana saxlama seçimləri ](/az/guide/configure/metadata-and-store-assets.md)
- [Təlimat istinadları ](/az/reference/instructions.md)
- [Rəsmi nişanlar ](/az/reference/permissions.md)
