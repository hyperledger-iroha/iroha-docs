---
translation_locale: az
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Qədim Mövzular {#genesis-reference}

Hal-hazırda Iroha 3 iş axınında `genesis.json` manifestində şəbəkənin başlanğıcı zamanı tətbiq ediləcək ilk əməliyyatlar və parametrlər təsvir edilir.

Tərəfdaşlara paylaşılan imzalanmış əşya Norito kodlu `.nrt` sənədidir ki, `kagami genesis sign` tərəfindən istehsal olunur.

## Əsas sahələr {#main-fields}

Bir genesis manifestı müəyyən edə bilər:

- `chain` silsilə kimliyi üçün
- `executor` seçkin bir icraçı yüksəltmə bytecode yolu üçün
- `ivm_dir` aktivləşdiricilər və yeniləmələr tərəfindən istifadə olunan IVM kitabxanaları üçün
- `consensus_mode` manifestdə elan edilən ilkin rejim üçün
- `transactions` sıralanmış parametrlər yeniləmələri, təlimatlar, tetikləyici və topologiya üçün
- `crypto` ilk kripto görüntüsü üçün

`transactions` daxilində topologiya girişləri bir-birinə bənzər idlər və PoPs birlikdə:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Manifest yaratın {#generate-a-manifest}

Şablon yaratmaq üçün Kagami istifadə edin:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

İctimai SORA Nexus məlumat sahəsi üçün, `npos` gözlənilən konsensus rejimidir. Digər Iroha 3 tətbiqlərində hədəf profilindən asılı olaraq icazəli və ya NPoS istifadə edilə bilər.

## Manifestoya imza atın {#sign-the-manifest}

JSON-nin redaktə olunmasından və təsdiqlənməsindən sonra onu `.nrt` blokuna imzalayın:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` manifestdən genesis ictimai açarını oxuyur və tətbiq edilə bilən imzalanmış blokun istehsalı üçün verilən xüsusi açar, toxum və alqoritmi istifadə edir. Nəticədə həmyaşıdları öz quruluşlarından istinad etməli olan fayl olurlar.

## Konfiqurasiya `irohad` {#configure-irohad}

Demonu imzalanmış Genesis blokuna yönəldin:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Əlaqəli vasitələr {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Generatorun icrası və əmr detalları üçün [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) səhifəsini baxın.
