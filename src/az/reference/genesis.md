---
translation_locale: az
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Yaradılış Referansı {#genesis-reference}

Cərəyanda Iroha 3 iş axını, a `genesis.json` manifest birincini təsvir edir
şəbəkə işə salındıqda tətbiq ediləcək əməliyyatlar və parametrlər.

Həmyaşıdlarına paylanan imzalı artefakt a Norito-şifrələnmiş `.nrt` fayl
tərəfindən istehsal edilmişdir `kagami genesis sign`.

## Əsas sahələr {#main-fields}

Bir genezis manifest müəyyən edə bilər:

- `chain` zəncir identifikatoru üçün
- `executor` isteğe bağlı icraçı təkmilləşdirmə bayt kodu yolu üçün
- `ivm_dir` üçün IVM tetikleyiciler və təkmilləşdirmələr tərəfindən istifadə olunan kitabxanalar
- `consensus_mode` manifest tərəfindən reklam edilən ilkin rejim üçün
- `transactions` sifarişli parametr yeniləmələri, təlimatlar, tetikleyiciler və topologiya üçün
- `crypto` ilkin kriptovalyutası üçün

İçində `transactions`, topologiya girişləri cüt identifikatorları və PoPs birlikdə:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest yaradın {#generate-a-manifest}

istifadə edin Kagami şablon yaratmaq üçün:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

İctimaiyyət üçün SORA Nexus məlumat məkanı, `npos` gözlənilən konsensus rejimidir.
Digər Iroha 3 yerləşdirmələr hədəfdən asılı olaraq icazəli və ya NPoS istifadə edə bilər
profil.

## Manifest imzalayın {#sign-the-manifest}

Redaktə etdikdən və təsdiq etdikdən sonra JSON, onu yerləşdirilə bilən bir yerə daxil edin `.nrt` blok:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifestdən genezis açıq açarını oxuyur və istifadə edir
istehsal etmək üçün sahibinə məxsus, tək keçidli müntəzəm fayldan şəxsi açar
yerləşdirilə bilən imzalanmış blok.Faylda bir kanonik özəl açar olmalıdır
multihash ardınca yeni sətir; Kagami simvolik əlaqələri və digər rejimləri rədd edir
-dən `0600`. Xam şəxsi açarlar komanda xəttində qəbul edilmir.Nəticə
həmyaşıdlarının konfiqurasiyasından istinad etməli olduğu fayldır.

## Konfiqurasiya edin `iroha3d` {#configure-iroha3d}

Demonu imzalanmış genezis blokuna yönəldin:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Əlaqədar Alətlər {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Generatorun icrası və əmr təfərrüatları üçün baxın
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
