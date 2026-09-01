---
translation_locale: az
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Konfiqurasiya olunur {#configuring-iroha}

Yerel şəbəkə əlaqə nöqtəsinin konfiqurasiyası təyin olunur TOML fayllar. Bu, zəncirdə konfiqurasiyanın dəyişdirilməsi ilə fərqlidir [`SetParameter`](/az/blockchain/instructions.md#setparameter) təlimatlar. İstehsal davranışı konfiqurasiyada əks etdirilməlidir fayl və ya zəncirdəki parametr; mühit dəyişənləri xüsusiyyət qapıları deyildir.

İstifadə et [`--config`](../iroha3d-cli#arg-config) CLI Konfiqurasiya faylının yolunu göstərmək üçün arqument.

## Şablon {#template}

Hər bir parametrin ətraflı təsviri üçün zəhmət olmasa [Parametrlər](./params.md) istinadına baxın.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Konfiqurasiya fayllarını tərtib etmək {#composing-configuration-files}

TOML konfiqurasiya fayllarında əlavə `extends` sahəsi var, hansı ki digər TOML fayla(fayllara) işarə edir. Bu tək bir yol və ya birdən çox yol ola bilər:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha `extends` ilə göstərilən bütün faylları rekursiv şəkildə oxuyacaq və onları qatlar şəklində birləşdirəcək, burada sonrakılar əvvəlkiləri parametr səviyyəsində üstələyəcək. Məsələn, əgər `config.toml` oxunursa:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

Nəticədə yaranan konfiqurasiya `a.toml`-dən `chain`, `b.toml`-dən `max_content_len` və `config.toml`-dən `torii.address` olacaq (`b.toml`-nı əvəz edir).

## Problemlərin aradan qaldırılması {#troubleshooting}

Keçmək [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI Konfiqurasiyanın necə oxunduğunu və təhlil edildiyini görmək üçün bayraq.
