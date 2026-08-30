---
translation_locale: az
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# Yaradılış {#genesis}

Yaradılış ilkin zəncir vəziyyətini müəyyən edir.Redaktə edilə bilən mənbə a JSON aşkar,
və bir Iroha 3 node imzalanmış istehlak edir Norito əməliyyat faylı.

::: details Defolt genezis manifestosu

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

Yuxarı repozitor defolt manifest göndərir `defaults/genesis.json`.
Kagami-yaradılmış şəbəkələr öz manifestlərini və imzalanmış əməliyyatlarını yazır
çıxış kataloqu:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Yaradılan `README.md` həmin kataloqda dəqiq faylları qeyd edir və işə salır
seçilmiş profil üçün əmrlər.

## Peer Konfiqurasiyası {#peer-configuration}

Həmyaşıdları imzalanmış genezis əməliyyatına işarə edir `[genesis]` bölməsi
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Şəbəkədəki bütün həmyaşıdlar imzalanmış genezis əməliyyatı və müqavilə ilə razılaşmalıdırlar
genesis açıq açarı.

## Yaradılışın imzalanması {#signing-genesis}

Manifesti əl ilə redaktə edirsinizsə, həmyaşıdlara başlamazdan əvvəl onu təsdiqləyin və imzalayın:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` sahibi tərəfindən idarə olunan rejim olmalıdır-`0600`, tək keçid
bir kanonik xüsusi açar multihash və sondan ibarət müntəzəm fayl
yeni sətir. Kagami simvolik əlaqələri rədd edir və heç vaxt özəl bir xam genesis qəbul etmir
komanda xəttində düyməni basın.

NPoS üçün və ya Nexus profillər, topologiya və daxildir BLS Sahiblik sübutları
yaradılan profil tərəfindən tələb olunur. Kagami `localnet`, `wizard`, və profil
nəsil əmrləri bu detalları avtomatik idarə edir.

## Yaradılışın təkrar edilməsi {#recommitting-genesis}

Həmyaşıd yalnız anbarı boş olduqda yaranır.Yeni bir genezisi sınamaq üçün
birdəfəlik yerli şəbəkə, həmyaşıdları dayandırın, onların yaradılan dövlət qovluğunu silin,
və yeni imzalanmış genezisdən başlayın.Qaçışda genezisi əvəz etməyin
hər validator eyni miqrasiyanı koordinasiya etmirsə, şəbəkə.
