---
translation_locale: az
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Əməliyyatlar {#transactions}

Əməliyyat blokçeyn üzərində iş yerinə yetirmək üçün imzalanmış sorğudur. Yerinə yetirilə bilən yük [təlimatlar](./instructions.md)-ın sıralanmış ardıcıllığı, müqavilənin texniki çağırışı, IVM baytkodu və ya sübut edilmiş IVM icra ola bilər. Mövcud müqavilə icra modelini görmək üçün [Ağıllı Müqavilələr](./smart-contracts.md)-ə baxın.

Əməliyyatlar vəziyyəti dəyişdirən və ya icra edilə bilən işləri yerinə yetirir. Yalnız oxumaq üçün müfəttişlik imzalı sorğular və ya ümumi oxuma API son nöqtələrindən istifadə edir və əməliyyat yaratmır.

Tamamlanmış bloka daxil edilmiş əməliyyat, icra nəticəsi ilə birlikdə, icranın rədd edilməsi də daxil olmaqla, saxlanılır. Bloka daxil edilmədən əvvəl rədd edilmiş sorğular, məsələn, etibarsız məlumat konteyneri və ya növbə tərəfindən rədd edilmiş əməliyyat, blokda saxlanılmır.

Məxfilik qoruyucu aktiv köçürmələri üçün baxın [Anonim Əməliyyatlar](./anonymous-transactions.md). Anonim əməliyyatlar açıq hesabdan hesab balans dəyişiklikləri əvəzinə qorunan aktiv qeydləri, kriptoqrafik öhdəlik dəyərləri, nullifierlər və sıfır-bilik sübutlarından istifadə edir.

Seçilmiş şəffaf icra təsirləri üzərində sübut üçün baxın [FastPQ](./fastpq.md). FastPQ normal əməliyyat icrasından sonra icra şahidlərini istifadə edir və dəstəklənən vəziyyət keçidləri üçün deterministik sübut paketləri yaradır.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İmza hesabı olmadan son ictimai Taira bloklarını və əməliyyat vəziyyətlərini yoxlamaq üçün kəşfiyyat marşrutlarından istifadə edin:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Əvvəl göndərdiyiniz əməliyyatı izləmək üçün siyahıdan `hash` kodunu kopyalayın və araşdırıcı detallar marşrutunu yoxlayın:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Bu hələ də yalnız oxunandır. Əməliyyatı təqdim etmək üçün imzalanmış Norito məlumat konteyneri, düzgün zəncir ID-si, ödəniş metadatasi və testnet ilə maliyyələşdirilmiş Taira hesab tələb olunur.

Ödənişli nümunələr üçün Taira üzərində, testnet maliyyələşdirmə xidmət köməkçisini [Taira üzərində Testnet XOR əldə edin](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-dən `taira_faucet_claim.py` kimi yadda saxlayın, sonra kriptoqrafik imzalayanı əvvəlcə ictimai testnet maliyyələşdirmə xidməti vasitəsilə maliyyələşdirin:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Əgər testnet maliyyələşdirmə xidməti tapmacası və ya tələb yolu `502` qaytarırsa, tranzaksiyanı özü debug etməzdən əvvəl gözləyin və yenidən cəhd edin.

Sonra əməliyyatı təqdim edərkən Taira rüsum aktiv metadatasını əlavə edin:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Offline Əməliyyatlar {#offline-transactions}

Iroha-ın iki oflayn əməliyyat iş axını var:

- Offline imzalama cihaz bağlandıqda normal imzalanmış əməliyyat yaradır. Əməliyyat, imzalanmış məlumat konteynerini Torii ünvanına göndərən onlayn müştəri təqdim edənə qədər işlənmir, buna görə də hələ də düzgün zəncir ID-si, avtorizasiya prinsipi, icazələr, ödənişlər tələb olunur, və əməliyyat ömrü.
- Kagemusha oflayn nağd pulları onlayn olduqda cüzdana yükləyir, hər iki cüzdan oflayn olduqda alıcı tərəfindən başlanan cüzdandan cüzdana keçidləri dəstəkləyir və alıcı onlayna qayıtdıqda yaranmış qeyd vəziyyətini istifadə edir.

Torii `/v1/offline/*` altında tam Kagemusha həyat dövranını göstərir:

|Metod və API son nöqtə|Məqsəd|
| --- | --- |
| `GET /v1/offline/readiness` |Kagemusha-nın bir `asset_definition_id` üçün hazırlığını qiymətləndirin|
| `POST /v1/offline/receiver-lineage` |İmzalı qəbulçu sorğusu üçün sübut-a sahib aktiv qeydiyyat mənşəyini həll edin|
| `POST /v1/offline/top-up` |İmzalı onlayn-dən-oflayna yükləmə əməliyyatını təqdim edin|
| `POST /v1/offline/redeem` |İmzalanmış oflayn geri ödəmə əməliyyatını təqdim edin|
| `GET /v1/offline/operations/{operation_id}` |Yeniləmə və ya çıxarışın tək protokol-standart statusunu oxuyun|

Əməliyyata keçmədən əvvəl aktivin hazır olub-olmadığını yoxlayın:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

Hazır vəziyyət pulqabını aktiv körpü ABI 21 və təsdiqlənmiş V4 artefakt dəsti ilə bağlayır. Soy, yükləmə və geri alma sorğuları yazılmış `application/x-norito` arxivlərdən istifadə edir. Əlavə ödəniş və geri ödəmə qaytarılması `202 Accepted` əməliyyat resursuna işarə edən `Location` başlığı ilə; daxil edilmiş sıfır olmayan əməliyyat ID-si idempotentlik açarını təmin edir.

Tipik axın belədir:

1. Sorğuya hazır olmağı yoxlayın və əgər `ready` yanlışdırsa və ya hər hansı bir bloklayıcı tətbiq olunursa dayandırın.
2. Tək protokol-standart doldurma arxivi yaratmaq üçün yazılı Swift və ya JVM cüzdanından istifadə edin, bunu təqdim edin və əməliyyat son zəncir vəziyyətinə çatana qədər həm giriş notu vəziyyətini, həm də əməliyyat ID-sini saxlayın.
3. Tələb olunduqda qəbul edənin qeydiyyat soy ağacını həll edin, hər bir şəbəkə qonşu ötürməsini yerli olaraq qurun və yoxlayın, və ötürməni təsdiqləməzdən əvvəl şifrəli qeyd vəziyyətini saxlayın.
4. Qəbul edici onlayndaykən, tək protokol-standart geri ödəmə arxivini qurun, təqdim edin və onun əməliyyat resursunu yekunlaşana qədər sorğu edin.

Blokçeyn dəftəri, qeyd vəziyyəti onlayn həyat dövrü vasitəsilə qayıtmayana qədər ziddiyyətli oflayn ötürməni görə bilməz. Buna görə də, cüzdan və operator siyasəti dəyər məhdudiyyətlərini, müddət bitməsini, qəbul edilmiş buraxanları, davamlı yerli saxlama və uyğunlaşdırma pəncərələrini tətbiq etməlidir.

Burada `Grant` təlimatı ilə yeni bir əməliyyat yaratmaq nümunəsi var. Bu əməliyyatda, Mouse Alice-ə müəyyən edilmiş rol (`role_id`) verir. [tam nümunə](./permissions.md#register-a-new-role)-ni yoxlayın.

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
