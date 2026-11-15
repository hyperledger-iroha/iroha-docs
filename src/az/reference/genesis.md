---
translation_locale: az
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# blokçeyn başlanğıc istinadı {#genesis-reference}

Mövcud Iroha 3 iş axınında, `genesis.json` texniki manifesto şəbəkə başladıqda tətbiq olunacaq ilk əməliyyatları və parametrləri təsvir edir.

Şəbəkə həmkarlarına paylanan imzalanmış artefakt Norito kodlu `.nrt` fayldır və `kagami genesis sign` tərəfindən hazırlanıb.

## Əsas Sahələr {#main-fields}

Bir blokçeyn genesis texniki manifesti aşağıdakıları təyin edə bilər:

- `chain` zəncir identifikatoru üçün
- manifestdəki hesab yazılışlarını kodlamaq üçün istifadə olunan I105 şəbəkə prefiksi üçün `chain_discriminant`
- `executor` ixtiyari icraçı təkmilləşdirmə bytecode yolu üçün
- `ivm_dir` üçün IVM kitabxanaları tetikleyicilər və yeniləmələr tərəfindən istifadə olunur
- `consensus_mode` texniki manifesto tərəfindən elan edilmiş ilkin rejim üçün
- `wire_protocol_version` ilk buraxılışın konsensus ötürmə protokolu versiyası üçün
- `consensus_fingerprint` konsensus parametrlərinin məcburi olmayan tipli barmaq izi üçün; JSON manifestləri onu açıq şəkildə göstərir
- `transactions` sifariş edilmiş parametr yeniləmələri, təlimatlar, tetikleyicilər və topologiya üçün
- imzalanmış Sumeragi hündürlük konteksti parametrləri üçün `sumeragi_context`
- zəncirin qəbul etdiyi, `allowed_algorithms` daxilində sadalanan dəqiq imzalama və nəzarətçi alqoritmləri üçün `crypto_admission_policy`

`transactions` daxilində, topologiya qeydləri şəbəkə həmyaşıd id-lərini və PoPs birlikdə qoşur:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Texniki manifest yaradın {#generate-a-manifest}

Şablon yaratmaq üçün Kagami istifadə edin. Qəbul edilən hər alqoritm üçün `--allowed-signing` seçimini artan kanonik ardıcıllıqla təkrarlayın; Kagami buraxılmış alqoritmləri özü əlavə etmir:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

Açıq SORA Nexus məlumat məkanı üçün gözlənilən konsensus rejimi `npos`-dur. Digər Iroha 3 yerləşdirmələri hədəf profildən asılı olaraq icazəli rejim və ya NPoS istifadə edə bilər.

## Texniki manifesti imzalayın {#sign-the-manifest}

JSON redaktə edib təsdiqlədikdən sonra, onu yerləşdirilə bilən `.nrt` blokuna daxil edin:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` yerləşdirilə bilən imzalanmış bloku yaratmaq üçün genezis açar cütünü sahib tərəfindən saxlanılan, tək bağlantılı adi fayldakı şəxsi açardan törədir. Onun dərc edilmiş genezis açıq açarına uyğun gəlməsini tələb etmək üçün `--expected-public-key` ötürün. Fayl tək bir protokol-standartına uyğun xüsusi açar multihashini və onu izləyən yeni sətiri ehtiva etməlidir; Kagami simvolik keçidləri və `0600` istisna olmaqla digər modları rədd edir. Komanda sətrində xam xüsusi açarlar qəbul edilmir. Nəticə şəbəkə iştirakçılarının öz konfiqurasiyalarında istinad etməli olduqları fayldır.

## `iroha3d` Tənzimləmək {#configure-iroha3d}

Xidmət prosesinə imzalanmış genezis blokunu və gözlənilən həşini sabitləyən faylı göstərin. Həmin faylı `kagami genesis sign --expected-hash-out` yazır və qovşaq onu həm ilk, həm də təkrar işə salınmada tələb edir:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Əlaqəli Alətlər {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Generatorun icrası və əmrlərin təfərrüatları üçün [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md)-a baxın.
