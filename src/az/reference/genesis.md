---
translation_locale: az
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# blokçeyn başlanğıc istinadı {#genesis-reference}

Mövcud Iroha 3 iş axınında, `genesis.json` texniki manifesto şəbəkə başladıqda tətbiq olunacaq ilk əməliyyatları və parametrləri təsvir edir.

Şəbəkə həmkarlarına paylanan imzalanmış artefakt Norito kodlu `.nrt` fayldır və `kagami genesis sign` tərəfindən hazırlanıb.

## Əsas Sahələr {#main-fields}

Bir blokçeyn genesis texniki manifesti aşağıdakıları təyin edə bilər:

- `chain` zəncir identifikatoru üçün
- `executor` ixtiyari icraçı təkmilləşdirmə bytecode yolu üçün
- `ivm_dir` üçün IVM kitabxanaları tetikleyicilər və yeniləmələr tərəfindən istifadə olunur
- `consensus_mode` texniki manifesto tərəfindən elan edilmiş ilkin rejim üçün
- `transactions` sifariş edilmiş parametr yeniləmələri, təlimatlar, tetikleyicilər və topologiya üçün
- `crypto` ilkin kripto nöqtə-vaxt məlumat baxışı üçün

`transactions` daxilində, topologiya qeydləri şəbəkə həmyaşıd id-lərini və PoPs birlikdə qoşur:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Texniki manifest yaradın {#generate-a-manifest}

Şablon yaratmaq üçün Kagami-dən istifadə edin:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

İctimai SORA Nexus verilənlər məkanında, `npos` gözlənilən konsensus rejimidir. Digər Iroha 3 yerləşdirmələr hədəf profilindən asılı olaraq icazəli və ya NPoS istifadə edə bilər.

## Texniki manifesti imzalayın {#sign-the-manifest}

JSON redaktə edib təsdiqlədikdən sonra, onu yerləşdirilə bilən `.nrt` blokuna daxil edin:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` texniki manifestdən blokçeyn başlanğıc açarını oxuyur və yerləşdirilə bilən imzalanmış bloku yaratmaq üçün sahib tərəfindən saxlanılan, tək bağlantılı adi fayldan şəxsi açardan istifadə edir. Fayl tək bir protokol-standartına uyğun xüsusi açar multihashini və onu izləyən yeni sətiri ehtiva etməlidir; Kagami simvolik keçidləri və `0600` istisna olmaqla digər modları rədd edir. Komanda sətrində xam xüsusi açarlar qəbul edilmir. Nəticə şəbəkə iştirakçılarının öz konfiqurasiyalarında istinad etməli olduqları fayldır.

## `iroha3d` Tənzimləmək {#configure-iroha3d}

Daimonu imzalanmış blokçeyn başlanğıc blokuna yönəldin:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Əlaqəli Alətlər {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Generatorun icrası və əmrlərin təfərrüatları üçün [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md)-a baxın.
