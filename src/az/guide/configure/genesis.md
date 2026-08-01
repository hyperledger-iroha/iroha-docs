---
translation_locale: az
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Müqəddəs Kitab {#genesis}

Genesis başlanğıc silsilə vəziyyətini təyin edir. Düzenlənə bilən mənbə JSON manifestidir və Iroha 3 düyün imzalanmış Norito əməliyyat faylini istehlak edir.

::: details Default genesis manifestı

<<< @/snippets/genesis.json

:::

## Dosyalar {#files}

Upstream repository default manifestini `defaults/genesis.json` ünvanına göndərir. Kagami tərəfindən istehsal olunan şəbəkələr öz manifesti və imzalanmış əməliyyatlarını çıxışı dizaynına yazırlar:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Bu dizaynda yaradılan `README.md` seçilmiş profil üçün dəqiq faylları və başlatma əmrlərini qeyd edir.

## Tərəflər arasındakı seçim {#peer-configuration}

`config.toml` `[genesis]` bölməsində imzalanmış genesis əməliyyatı ilə əlaqəli rəfiqələr:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Şəbəkədəki bütün həmyaşıdlar imzalanmış genesis əməliyyatı və genesis ictimai açarı barədə razılığa gəlməlidirlər.

## Qədim Mövzunun imzalanması {#signing-genesis}

Manifesti əl ilə redaktə edirsinizsə, həmyaşıdları başlamadan əvvəl təsdiqləyin və imzalayın:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS və ya Nexus profilləri üçün topoloji və BLS Yaradılmış profil tərəfindən tələb olunan mülkiyyət sübutları daxil edin. Kagami `localnet`, `wizard` və profil istehsalı əmrləri həmin detalları avtomatik olaraq idarə edir.

## Yaradılışın yenidən qurulması {#recommitting-genesis}

Bir həmyaşıd yalnız saxlama boş olduğu zaman genesi həyata keçirir.Birbaşa istifadə edilə bilən lokal şəbəkədə yeni bir genesi sınaqdan keçirmək üçün həmyaşıdıları dayandırın, istehsal olunan dövlət dizini çıxarın və yeni imzalanmış genesisdən başlayın. Hər təsdiqçi eyni miqrasiyanı əlaqələndirmədiyi təqdirdə işləyən şəbəkədə genesi əvəz etməyin.
