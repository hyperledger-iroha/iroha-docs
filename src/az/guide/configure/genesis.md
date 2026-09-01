---
translation_locale: az
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# blokçeyn genesis {#genesis}

blokçeyn genesis ilkin zəncir vəziyyətini müəyyən edir. Redaktə edilə bilən mənbə JSON texniki manifestdir və Iroha 3 node imzalanmış Norito əməliyyat faylını istifadə edir.

::: details Defolt blockchain genesis texniki manifesti

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

Yuxarı axın anbarı `defaults/genesis.json` ünvanında standart texniki manifest təqdim edir. Kagami-tərəfindən yaradılmış şəbəkələr öz texniki manifestlərini və imzalanmış əməliyyatlarını çıxış qovluğuna yazır:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Həmin kataloqda yaradılan `README.md` seçilmiş profil üçün dəqiq faylları və işə salma əmrlərini qeyd edir.

## şəbəkə tərəfdaşının Konfiqurasiyası {#peer-configuration}

şəbəkə həmkarları `config.toml` bölməsindəki `[genesis]` hissəsində imzalanmış blokçeyn başlanğıc əməliyyatını göstərir:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Şəbəkədəki bütün şəbəkə iştirakçıları, imzalanmış blokzincir başlanğıc əməliyyatı və blokzincir başlanğıc açarı ilə razılaşmalıdır.

## Blokçeyn başlanğıcının imzalanması {#signing-genesis}

Əgər texniki sənədi əl ilə redaktə edirsinizsə, şəbəkə tərəfdaşlarını başlatmazdan əvvəl onu yoxlayın və imzalayın:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` sahibi-ələ keçirilmiş rejim-`0600`, tək-bağlantılı adi fayl olmalıdır və bir tək protokol-standart özəl açar çoxhashı və sonuncu yeni sətiri ehtiva etməlidir. Kagami simvolik bağlantıları rədd edir və heç vaxt kommanda sətrində xam blokçeyn başlanğıc özəl açarını qəbul etmir.

NPoS və ya Nexus profilləri üçün, yaradılmış profil tərəfindən tələb olunan topologiya və BLS Sahibliyin Sübutlarını daxil edin. Kagami `localnet`, `wizard` və profil yaradılması komandaları bu detalları avtomatik idarə edir.

## Blok zəncirinin başlanğıcını yenidən təsdiqləmək {#recommitting-genesis}

Şəbəkə qoşqusu yalnız onun yaddaşı boş olduqda blokçeyn başlanğıcını yekunlaşdırır. Tullantı yerli şəbəkədə yeni blokçeyn başlanğıcını sınamaq üçün, şəbəkə qoşqusunu dayandırın, yaratdıqları vəziyyət kataloqunu silin və yeni imzalanmış blokçeyn başlanğıcından başlayın. Heç bir təsdiqləyici eyni miqrasiyanı koordinasiya etmədikcə işləyən bir şəbəkədə blokçeyn başlanğıcını əvəz etməyin.
