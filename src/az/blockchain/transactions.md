---
translation_locale: az
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Əməliyyatlar {#transactions}

Bir əməliyyat blockchain üzərində iş yerinə yetirmək üçün imzalanmış bir tələbdir. İcra edilə bilən payload [ təlimatların ](./instructions.md), müqavilə çağırışı, IVM bytecode və ya sübut edilmiş IVM icrasının sifarişlənmiş ardıcıllığı ola bilər. Mövcud müqavilənin icrası modeli üçün [Ağıllı Müqavilələr](./smart-contracts.md)-ə baxın.

Transaksiyalar vəziyyəti dəyişdirən və ya icra edilə bilən işləri həyata keçirir. Yalnız oxumaqla yoxlama imzalanan sorğuları və ya ictimai oxuma son nöqtələrindən istifadə edir və bir əməliyyat yaratmır.

Məqsədli blokda qəbul edilmiş bir əməliyyat onun icrasının nəticəsi ilə, o cümlədən icra edilməsinin rədd edilməsi ilə saxlanılır.

Məxfiliyini qoruyub saxlayan aktivlərin hərəkəti üçün [Anonymous Transactions](./anonymous-transactions.md) baxın. Anonim əməliyyatlar ictimai hesab-hesab balansında dəyişikliklər əvəzinə qorunan aktiv notları, öhdəlikləri, ləğv edən və sıfır bilik sübutlarını istifadə edir.

Seçilmiş şəffaf icra effektlərinə dair sübut əlamətləri üçün [FastPQ](./fastpq.md) baxın. FastPQ normal əməliyyat icrasından sonra icra şahidlərini istehlak edir və dəstəklənmiş dövlət keçidləri üçün deterministik sübut partiyaları qurur.

## Taira üzərində sınayın. {#try-it-on-taira}

Axırıncı açıq Taira blokları və əməliyyat statuslarını imzalama hesabı olmadan yoxlamaq üçün kəşfçi marşrutlarından istifadə edin:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Əvvəlcədən təqdim etdiyiniz bir əməliyyatı izləmək üçün siyahıdan `hash` nüsxəsini kopyalayın və kəşfiyyatçının detal marşrutunu yoxlayın:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Bu, hələ də yalnız oxunur. Transaksiyanın təqdim edilməsi üçün imzalanmış Norito zarf, düzgün bir zəncir ID, ödəniş metadataları və faucet maliyyələşdirilmiş Taira hesabı tələb olunur.

Taira-də ödənişli nümunələr üçün faucet köməkçisini [-dən saxlayın Testnet XOR-i Taira](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-də `taira_faucet_claim.py` olaraq alın, sonra əvvəlcə imzalananı ictimai faucet vasitəsilə maliyyələşdirin:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Əgər faucet puzzle və ya iddia yolu `502` qaytarılırsa, əməliyyatın özünü debug etmədən əvvəl gözləyin və yenidən cəhd edin.

Bundan sonra əməliyyatın təqdim edilməsində Taira ödəniş aktivinin metadatalarını əlavə edin:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Offline əməliyyatlar {#offline-transactions}

Iroha iki offline əməliyyat iş axını var:

- Offline imzalanması imzalanma qurğusu bağlanmadan normal imzalanan bir əməliyyat yaratır. Əməliyyat onlayn müştəri imzalanmış zarfı Torii -a göndərənə qədər icra edilmir, buna görə də hələ də düzgün zəncir ID, səlahiyyət, icazələr, ödənişlər və əməliyyat ömrü lazımdır.
- Kagemusha offline pul cüzdanı onlayn olduğu müddətdə toplayır, hər iki cüzdan offline ikən alıcı tərəfindən başlanılmış cüzdan-cüzdan çatdırılmalarını dəstəkləyir və alıcının onlayn qayıdanda nəticəli qeyd vəziyyətini əvəz edir.

Torii Kagemusha-nın tam həyat dövrünü `/v1/offline/*` altında göstərir:

|Metod və son nöqtə |Məqsəd|
| --- | --- |
|`GET /v1/offline/readiness` |`asset_definition_id` üçün Kagemusha hazırlığını qiymətləndirmək |
|`POST /v1/offline/receiver-lineage` |İmzalanmış alıcı tələbi üçün təsdiqləyici aktiv qeydiyyat soyunu həll etmək |
|`POST /v1/offline/top-up` |İmzalanmış onlayn-offline toplama əməliyyatını təqdim edin |
|`POST /v1/offline/redeem` |İmzalanmış offline ödəniş əməliyyatını təqdim edin |
|`GET /v1/offline/operations/{operation_id}` |Yeniləmə və ya töhfənin kanonik statusunu oxuyun |

Offline əməliyyat qurmadan əvvəl aktivin hazırlığını yoxlayın:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

Hazırlıq pul cüzdanı aktiv körpü ABI 21 və təsdiqlənmiş V4 artefakt dəstinə bağlayır. soy, toplama və fidye tələbləri `application/x-norito` arxivlərindən istifadə edir. İşləmə mənbəsinə işarə edən `Location` başlığı ilə toplama və ödəniş qaytarılması `202 Accepted`; yerləşdirilmiş sıfır olmayan əməliyyat ID idempotency açarını təmin edir.

Tipik axın:

1. `ready` səhvdirsə və ya hər hansı bir bloker tətbiq olunduğu təqdirdə hazırlığı soruşun və dayandırın.
2. Təsvir edilmiş bir istifadə edin Swift və ya JVM Canonical top-up arxivini qurmaq, təqdim etmək və giriş qeydinin vəziyyətini və fəaliyyətini saxlamaq üçün cüzdan. ID əməliyyatın sonuncu zəncir vəziyyətinə çatana qədər.
3. Lazım olduqda alıcının qeydiyyat soyunu həll edin, hər bir peer transferini yerli olaraq qurun və yoxlayın və köçürülməni təsdiqləməkdən əvvəl şifrələnmiş qeyd vəziyyətini davam etdirin .
4. Alıcı onlayn olduqda, qanuni fidye arxivini qurun, göndərin və sonluq üçün əməliyyat resursunu sorğulayın.

Bu səbəbdən pul və operator siyasəti dəyər məhdudiyyətlərini, müddətin bitməsini, qəbul edilmiş emitentləri, davamlı yerli saxlama və uyğunlaşma pəncərələrini tətbiq etməlidir.

Burada yeni bir əməliyyatın yaradılması nümunəsi `Grant` Bu əməliyyatda Mouse Alice-ə müəyyən edilmiş rolu verəcək.`role_id`Çəkim). [tam nümunə](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
