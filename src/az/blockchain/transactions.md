---
translation_locale: az
translation_source: /blockchain/transactions.md
translation_source_hash: d9227effcdb4d54ac76f6288ba213de20f2574e1585e13b96a5202c44b69f3be
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Əməliyyatlar {#transactions}

Əməliyyat blokçeyn üzərində iş yerinə yetirmək üçün imzalanmış sorğudur. Yerinə yetirilə bilən yük [təlimatlar](./instructions.md)-ın sıralanmış ardıcıllığı, müqavilənin texniki çağırışı, IVM baytkodu və ya sübut edilmiş IVM icra ola bilər. Mövcud müqavilə icra modelini görmək üçün [Ağıllı Müqavilələr](./smart-contracts.md)-ə baxın.

Əməliyyatlar vəziyyəti dəyişən və ya icra olunan iş görür. Yalnız oxuma yoxlamaları imzalanmış sorğulardan və ya açıq oxuma son nöqtələrindən istifadə edir və əməliyyat yaratmır.

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

Bu hələ də yalnız oxuma əməliyyatıdır. Əməliyyat göndərmək üçün imzalanmış Norito zərfi, düzgün zəncir ID-si və şəbəkə ID-si, açıq göstərilmiş haqq ödəyicisi və test vəsaiti paylama xidməti ilə maliyyələşdirilmiş Taira hesabı tələb olunur.

Taira üzərində haqq tələb edən nümunələr üçün [Taira üzərində testnet XOR əldə etmək](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bölməsindəki əvvəlcədən hazırlanan vəsait alma axını ilə imzalayan hesabı maliyyələşdirin, sonra haqq aktivinin balansını yoxlayın:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Vəsait paylama marşrutu `502` qaytararsa, əməliyyatın özündə xəta axtarmazdan əvvəl gözləyin və yenidən cəhd edin.

Sonra əməliyyatı göndərərkən haqq ödəyicisini seçin. `--fee-payer authority` ilə imzalayan hesab ödəyir və CLI imzalamadan əvvəl dəqiq haqqı Taira-nın haqq aktivində hesablayıb göstərir:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## Offline Əməliyyatlar {#offline-transactions}

Iroha-ın iki oflayn əməliyyat iş axını var:

- Offline imzalama cihaz bağlandıqda normal imzalanmış əməliyyat yaradır. Əməliyyat, imzalanmış məlumat konteynerini Torii ünvanına göndərən onlayn müştəri təqdim edənə qədər işlənmir, buna görə də hələ də düzgün zəncir ID-si, avtorizasiya prinsipi, icazələr, ödənişlər tələb olunur, və əməliyyat ömrü.
- **Kagemusha oflayn nağd pul** qeydiyyatdan keçmiş, aparatla qorunan pul kisəsi onlayn olduqda ona dəyər yükləyir, hər iki pul kisəsi oflayn olduqda kisələrarası ödənişləri dəstəkləyir və pul kisəsi yenidən onlayn olduqda qalan dəyəri reyestr hesabına boşaldır.

Torii bir Kagemusha dəyişiklik marşrutu təqdim edir: `POST /v1/kagemusha/enrollment`. O, hesabla autentifikasiya edilmiş `application/x-norito` qeydiyyat çərçivələrini qəbul edir və keşlənməməli olan özəl cavablar qaytarır. `/v1/kagemusha/{scheme}/wallets/{wallet}/` altındakı hesabla imzalanan SDK oxuma marşrutları Load qəbzlərini və yekunluq sübutlarını qaytarır; onlar `/openapi.json` siyahısına daxil edilməyib. Həyat dövrünün reyestr tərəfi `KagemushaWalletLedgerV1` təlimatı daşıyan adi imzalanmış əməliyyatlardan istifadə edir:

| Əməl | Məqsəd |
| --- | --- |
| `Activate` | Qeydiyyatdan keçmiş pul kisəsini aktivləşdirmək; birbaşa platformada ilkin qurulma yoxlaması məcburidir |
| `IssueLoad` | Ödəyicinin balansından çıxmaq və pul kisəsinin növbəti Load qeydini atomik şəkildə yazmaq |
| `Unload` | Tam Unload tələbini onun bağlandığı hesaba ən çox bir dəfə ödəmək |
| `ClaimFee` | Tam haqq tələbini onun sabit faydalananına ödəmək |
| `Abandon` | İstifadə olunmamış qeydiyyatdan imtina etmək |

Tipik axın belədir:

1. Tipləşdirilmiş interfeysi olan Swift və ya Android pul kisəsi ilə `/v1/kagemusha/enrollment` vasitəsilə qeydiyyatdan keçin, sonra pul kisəsini aktivləşdirin.
2. `IssueLoad` əməliyyatı göndərin. İcra gözlənilən növbəti Load sıra nömrəsini və sıfırdan fərqli sorğu ID-sini yoxlayır; buna görə köhnəlmiş və ya dəyişdirilmiş təkrar cəhd uğursuz olur. Cavab itdikdə başqa Load imzalamaq əvəzinə ilkin Load qəbzini oxuyun.
3. Pul kisələri oflayn olduqda ödənişləri onların arasında yerli şəkildə mübadilə edin və yoxlayın; hər köçürməni təsdiqləməzdən əvvəl pul kisəsinin vəziyyətini davamlı saxlayın.
4. Pul kisəsi yenidən onlayn olduqda onun Unload tələbini göndərin və yekunluğu gözləyin.

Kagemusha buraxılış üçün kvalifikasiyadan keçməyib: canlı monetar kvalifikasiya, həmçinin fiziki cihazlarda telefon qeydiyyatı, aktivləşdirmə və ödəniş hələ açıq məsələ olaraq qalır.

Blokçeyn dəftəri, qeyd vəziyyəti onlayn həyat dövrü vasitəsilə qayıtmayana qədər ziddiyyətli oflayn ötürməni görə bilməz. Buna görə də, cüzdan və operator siyasəti dəyər məhdudiyyətlərini, müddət bitməsini, qəbul edilmiş buraxanları, davamlı yerli saxlama və uyğunlaşdırma pəncərələrini tətbiq etməlidir.

Burada `Grant` təlimatı ilə yeni bir əməliyyat yaratmaq nümunəsi var. Bu əməliyyatda, Mouse Alice-ə müəyyən edilmiş rol (`role_id`) verir. [tam nümunə](./permissions.md#register-a-new-role)-ni yoxlayın.

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
